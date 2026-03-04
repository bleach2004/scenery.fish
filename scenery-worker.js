const API_ORIGIN = "https://marisu.bleach-542.workers.dev";
const SITE_ORIGIN = "https://raw.githubusercontent.com/bleach2004/scenery.fish/main";
const VAULT_AUTH_CACHE_TTL_MS = 5 * 60 * 1000;
const vaultAuthCache = new Map();

function hasExtension(pathname) {
  const last = pathname.split("/").pop() || "";
  return /\.[a-z0-9]+$/i.test(last);
}

function normalizePathname(pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return "";
  }
  if (!decoded.startsWith("/")) return "";
  if (decoded.includes("\0") || decoded.includes("\\") || decoded.includes("..")) return "";
  return decoded;
}

function buildCandidates(pathname) {
  if (pathname === "/") return ["/index.html"];
  if (pathname.endsWith("/")) return [`${pathname}index.html`];
  if (hasExtension(pathname)) return [pathname];
  return [pathname, `${pathname}/index.html`];
}

function contentTypeFor(pathname) {
  const ext = (pathname.split(".").pop() || "").toLowerCase();
  const map = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    txt: "text/plain; charset=utf-8",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    ico: "image/x-icon",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime"
  };
  return map[ext] || "";
}

function cacheControlFor(pathname) {
  return pathname.endsWith(".html")
    ? "no-cache, no-store, must-revalidate"
    : "public, max-age=300";
}

function withPath(origin, pathname, search) {
  return `${origin}${pathname}${search || ""}`;
}

function parseBasicPassword(authHeader) {
  if (!authHeader || !authHeader.startsWith("Basic ")) return "";
  try {
    const decoded = atob(authHeader.slice(6).trim());
    const splitAt = decoded.indexOf(":");
    if (splitAt < 0) return "";
    return decoded.slice(splitAt + 1);
  } catch {
    return "";
  }
}

function vaultAuthRequired() {
  return new Response("Vault authentication required.", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="SCENERY Vault"',
      "cache-control": "no-store"
    }
  });
}

async function verifyVaultPassword(password) {
  if (!password) return false;
  const now = Date.now();
  const cachedUntil = vaultAuthCache.get(password) || 0;
  if (cachedUntil > now) return true;

  const response = await fetch(`${API_ORIGIN}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://scenery.fish"
    },
    body: JSON.stringify({ password })
  });
  if (!response.ok) return false;

  vaultAuthCache.set(password, now + VAULT_AUTH_CACHE_TTL_MS);
  return true;
}

async function proxyApi(request) {
  const url = new URL(request.url);
  const upstream = withPath(API_ORIGIN, url.pathname, url.search);
  const next = new Request(upstream, request);
  return fetch(next);
}

async function fetchSiteFile(pathname, search, request) {
  const upstream = withPath(SITE_ORIGIN, pathname, search);
  const headers = new Headers();
  const range = request.headers.get("range");
  if (range) headers.set("range", range);
  return fetch(upstream, {
    method: "GET",
    headers,
    cf: {
      cacheEverything: true,
      cacheTtl: 60
    }
  });
}

function toSiteResponse(upstream, pathname, method) {
  const headers = new Headers();
  const passthroughHeaders = ["content-length", "content-range", "accept-ranges", "etag", "last-modified"];
  for (const name of passthroughHeaders) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  const contentType = contentTypeFor(pathname);
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", cacheControlFor(pathname));
  headers.set(
    "content-security-policy",
    "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https:; media-src 'self' https: data: blob:;"
  );
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-powered-by", "scenery-worker");
  if (method === "HEAD") {
    return new Response(null, { status: upstream.status, headers });
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return proxyApi(request);
    }

    if (url.pathname === "/vault" || url.pathname.startsWith("/vault/")) {
      const password = parseBasicPassword(request.headers.get("authorization"));
      const ok = await verifyVaultPassword(password);
      if (!ok) return vaultAuthRequired();
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const safePath = normalizePathname(url.pathname);
    if (!safePath) {
      return new Response("Bad Request", { status: 400 });
    }

    const candidates = buildCandidates(safePath);
    for (const candidate of candidates) {
      const upstream = await fetchSiteFile(candidate, url.search, request);
      if (upstream.status === 404) continue;
      if (!upstream.ok) {
        return new Response("Upstream error", { status: 502 });
      }
      return toSiteResponse(upstream, candidate, request.method);
    }

    return new Response("Not Found", { status: 404 });
  }
};
