function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

function getContentType(pathname) {
  if (pathname.endsWith(".html")) return "text/html; charset=utf-8";
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".ico")) return "image/x-icon";
  if (pathname.endsWith(".mp3")) return "audio/mpeg";
  if (pathname.endsWith(".wav")) return "audio/wav";
  if (pathname.endsWith(".ogg")) return "audio/ogg";
  if (pathname.endsWith(".mp4")) return "video/mp4";
  if (pathname.endsWith(".webm")) return "video/webm";
  return "application/octet-stream";
}

function normalizeStaticPath(pathname) {
  if (!pathname || pathname === "/") return "index.html";
  if (pathname.endsWith("/")) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
}

async function fetchStaticFromGithub(pathname) {
  const staticPath = normalizeStaticPath(pathname);
  if (!staticPath || staticPath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const url = `https://raw.githubusercontent.com/bleach2004/scenery.fish/main/${staticPath}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "scenery-fish-worker"
    }
  });

  if (response.status === 404 && !staticPath.endsWith(".html")) {
    const maybeHtml = `${staticPath}.html`;
    const htmlResponse = await fetch(`https://raw.githubusercontent.com/bleach2004/scenery.fish/main/${maybeHtml}`, {
      headers: { "User-Agent": "scenery-fish-worker" }
    });
    if (htmlResponse.ok) {
      const headers = new Headers(htmlResponse.headers);
      headers.delete("content-security-policy");
      headers.delete("content-security-policy-report-only");
      headers.delete("x-frame-options");
      headers.delete("x-content-type-options");
      headers.delete("cross-origin-opener-policy");
      headers.delete("cross-origin-embedder-policy");
      headers.delete("cross-origin-resource-policy");
      headers.set("content-type", "text/html; charset=utf-8");
      headers.set("cache-control", "public, max-age=60");
      return new Response(await htmlResponse.arrayBuffer(), { status: 200, headers });
    }
  }

  if (!response.ok) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers(response.headers);
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");
  headers.delete("x-content-type-options");
  headers.delete("cross-origin-opener-policy");
  headers.delete("cross-origin-embedder-policy");
  headers.delete("cross-origin-resource-policy");
  headers.set("content-type", getContentType(staticPath));
  headers.set("cache-control", "public, max-age=60");
  return new Response(await response.arrayBuffer(), { status: 200, headers });
}

function getCorsHeaders(origin) {
  return {
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-vault-edit-password, x-vault-publish-message",
    "access-control-max-age": "86400"
  };
}

const MAX_RAW_PUBLISH_BYTES = 90 * 1024 * 1024;

function timingSafeStringEqual(a, b) {
  const enc = new TextEncoder();
  const ax = enc.encode(String(a || ""));
  const bx = enc.encode(String(b || ""));
  const len = Math.max(ax.length, bx.length);
  let diff = ax.length ^ bx.length;
  for (let i = 0; i < len; i += 1) {
    diff |= (ax[i] || 0) ^ (bx[i] || 0);
  }
  return diff === 0;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function base64EncodeUtf8(input) {
  const bytes = new TextEncoder().encode(input);
  const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const parts = [];
  let chunk = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const tri = (a << 16) | (b << 8) | c;
    chunk += table[(tri >> 18) & 63];
    chunk += table[(tri >> 12) & 63];
    chunk += i + 1 < bytes.length ? table[(tri >> 6) & 63] : "=";
    chunk += i + 2 < bytes.length ? table[tri & 63] : "=";
    if (chunk.length >= 16384) {
      parts.push(chunk);
      chunk = "";
    }
  }
  if (chunk) parts.push(chunk);
  return parts.join("");
}

function base64DecodeUtf8(input) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeRepoPath(path) {
  return path.split("/").filter(Boolean).map((segment) => encodeURIComponent(segment)).join("/");
}

async function getExistingGithubFileSha(owner, repo, path, branch, token) {
  const encodedPath = encodeRepoPath(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "scenery-fish-worker",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (response.status === 404) return "";
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to check existing file (${response.status}): ${body}`);
  }
  const data = await response.json();
  return typeof data.sha === "string" ? data.sha : "";
}

async function readPublishedWorkspaceFromGithub(env) {
  const owner = env.GITHUB_OWNER || "bleach2004";
  const repo = env.GITHUB_REPO || "scenery.fish";
  const branch = env.GITHUB_BRANCH || "main";
  const path = env.GITHUB_PATH || "vault/workspace.json";
  const token = env.GITHUB_TOKEN || "";
  const encodedPath = encodeRepoPath(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "scenery-fish-worker",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (response.status === 404) {
    throw new Error("Published workspace file not found.");
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to read published workspace (${response.status}): ${body}`);
  }

  const data = await response.json();
  const encoded = typeof data.content === "string" ? data.content : "";
  if (encoded) {
    const normalized = encoded.replace(/\s+/g, "");
    const decoded = base64DecodeUtf8(normalized);
    return JSON.parse(decoded);
  }

  // Large files may omit inline `content`; use the raw download URL when available.
  const downloadUrl = typeof data.download_url === "string" ? data.download_url : "";
  if (!downloadUrl) {
    throw new Error("Published workspace content missing.");
  }
  const rawResponse = await fetch(downloadUrl, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "User-Agent": "scenery-fish-worker"
        }
      : {
          "User-Agent": "scenery-fish-worker"
        }
  });
  if (!rawResponse.ok) {
    const body = await rawResponse.text();
    throw new Error(`Failed to download published workspace (${rawResponse.status}): ${body}`);
  }
  return await rawResponse.json();
}

async function publishWorkspaceToGithub(env, message, workspace) {
  const payload = {
    version: 1,
    publishedAt: new Date().toISOString(),
    workspace
  };
  // Compact JSON helps keep Worker CPU/memory usage under limits on large media-heavy workspaces.
  const encodedContent = base64EncodeUtf8(JSON.stringify(payload));
  return publishEncodedContentToGithub(env, message, encodedContent);
}

async function publishEncodedContentToGithub(env, message, encodedContent) {
  const owner = env.GITHUB_OWNER || "bleach2004";
  const repo = env.GITHUB_REPO || "scenery.fish";
  const branch = env.GITHUB_BRANCH || "main";
  const path = env.GITHUB_PATH || "vault/workspace.json";
  const token = env.GITHUB_TOKEN || "";
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN secret.");
  }

  const existingSha = await getExistingGithubFileSha(owner, repo, path, branch, token);
  const encodedPath = encodeRepoPath(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const requestBody = {
    message,
    content: String(encodedContent || "").replace(/\s+/g, ""),
    branch
  };
  if (existingSha) requestBody.sha = existingSha;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "scenery-fish-worker",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub publish failed (${response.status}): ${body}`);
  }
  return { owner, repo, branch, path };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "*";
    const cors = getCorsHeaders(origin);

    if (!url.pathname.startsWith("/api/")) {
      return fetchStaticFromGithub(url.pathname);
    }

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: cors });
    }

    if (!env.VAULT_LOGIN_PASSWORD || !env.VAULT_EDIT_PASSWORD) {
      return json({ ok: false, error: "missing worker secrets" }, 500, cors);
    }

    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      const body = await readJson(request);
      const password = typeof body.password === "string" ? body.password : "";
      if (!timingSafeStringEqual(password, env.VAULT_LOGIN_PASSWORD)) {
        return json({ ok: false }, 401, cors);
      }
      return json({ ok: true }, 200, cors);
    }

    if (url.pathname === "/api/auth/edit" && request.method === "POST") {
      const body = await readJson(request);
      const password = typeof body.password === "string" ? body.password : "";
      if (!timingSafeStringEqual(password, env.VAULT_EDIT_PASSWORD)) {
        return json({ ok: false }, 401, cors);
      }
      return json({ ok: true }, 200, cors);
    }

    if (url.pathname === "/api/publish/github" && request.method === "POST") {
      const contentType = String(request.headers.get("content-type") || "").toLowerCase();
      if (contentType.startsWith("text/plain")) {
        const contentLength = Number(request.headers.get("content-length") || 0);
        if (Number.isFinite(contentLength) && contentLength > MAX_RAW_PUBLISH_BYTES) {
          return json({
            ok: false,
            error: "Publish payload is too large for this endpoint. Reduce media size and try again."
          }, 413, cors);
        }
        const editPassword = request.headers.get("x-vault-edit-password") || "";
        if (!timingSafeStringEqual(editPassword, env.VAULT_EDIT_PASSWORD)) {
          return json({ ok: false, error: "unauthorized" }, 401, cors);
        }
        const rawMessage = request.headers.get("x-vault-publish-message") || "";
        let message = "";
        try {
          message = decodeURIComponent(rawMessage);
        } catch {
          message = rawMessage;
        }
        if (!message.trim()) {
          message = `Publish vault workspace ${new Date().toISOString()}`;
        }
        const encodedContent = (await request.text()).replace(/\s+/g, "");
        if (!encodedContent) {
          return json({ ok: false, error: "invalid workspace payload" }, 400, cors);
        }
        try {
          const result = await publishEncodedContentToGithub(env, message.trim(), encodedContent);
          return json({ ok: true, ...result }, 200, cors);
        } catch (error) {
          return json({ ok: false, error: String(error && error.message ? error.message : error) }, 500, cors);
        }
      }

      if (contentType.includes("application/json")) {
        return json({
          ok: false,
          error: "Legacy publish format blocked. Hard refresh the editor (Ctrl+F5) and publish again."
        }, 426, cors);
      }

      const body = await readJson(request);
      const editPassword = typeof body.editPassword === "string" ? body.editPassword : "";
      if (!timingSafeStringEqual(editPassword, env.VAULT_EDIT_PASSWORD)) {
        return json({ ok: false, error: "unauthorized" }, 401, cors);
      }
      const workspace = body && typeof body.workspace === "object" && !Array.isArray(body.workspace)
        ? body.workspace
        : null;
      if (!workspace) {
        return json({ ok: false, error: "invalid workspace payload" }, 400, cors);
      }
      const message = typeof body.message === "string" && body.message.trim()
        ? body.message.trim()
        : `Publish vault workspace ${new Date().toISOString()}`;
      try {
        const result = await publishWorkspaceToGithub(env, message, workspace);
        return json({ ok: true, ...result }, 200, cors);
      } catch (error) {
        return json({ ok: false, error: String(error && error.message ? error.message : error) }, 500, cors);
      }
    }

    if (url.pathname === "/api/workspace/published" && request.method === "GET") {
      try {
        const payload = await readPublishedWorkspaceFromGithub(env);
        return json({ ok: true, payload }, 200, cors);
      } catch (error) {
        return json({ ok: false, error: String(error && error.message ? error.message : error) }, 500, cors);
      }
    }

    return json({ ok: false, error: "not found" }, 404, cors);
  }
};
