const API_ORIGIN = "https://marisu.bleach-542.workers.dev";
const SITE_ORIGIN = "https://raw.githubusercontent.com/bleach2004/scenery.fish/main";

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
  const useEdgeCache = !pathname.endsWith(".html");
  if (!useEdgeCache) {
    return fetch(upstream, {
      method: "GET",
      headers
    });
  }
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
  const passthroughHeaders = pathname.endsWith(".html")
    ? ["content-length", "content-range", "accept-ranges"]
    : ["content-length", "content-range", "accept-ranges", "etag", "last-modified"];
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
