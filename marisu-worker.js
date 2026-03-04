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

function getCorsHeaders(origin) {
  return {
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400"
  };
}

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
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
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
  const owner = env.GITHUB_OWNER || "bleach2004";
  const repo = env.GITHUB_REPO || "scenery.fish";
  const branch = env.GITHUB_BRANCH || "main";
  const path = env.GITHUB_PATH || "vault/workspace.json";
  const token = env.GITHUB_TOKEN || "";
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN secret.");
  }

  const payload = {
    version: 1,
    publishedAt: new Date().toISOString(),
    workspace
  };
  const existingSha = await getExistingGithubFileSha(owner, repo, path, branch, token);
  const encodedPath = encodeRepoPath(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const requestBody = {
    message,
    content: base64EncodeUtf8(JSON.stringify(payload, null, 2)),
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
