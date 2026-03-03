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
    "access-control-allow-methods": "POST, OPTIONS",
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

    return json({ ok: false, error: "not found" }, 404, cors);
  }
};
