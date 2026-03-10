const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const VAULT_LOGIN_PASSWORD = process.env.VAULT_LOGIN_PASSWORD || "";
const VAULT_EDIT_PASSWORD = process.env.VAULT_EDIT_PASSWORD || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const WORKSPACE_FILE = process.env.WORKSPACE_FILE || path.join(ROOT, "data", "vault-workspace.json");
const SESSION_COOKIE = "vault_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const IS_PROD = String(process.env.NODE_ENV || "").toLowerCase() === "production";

if (!VAULT_LOGIN_PASSWORD || !VAULT_EDIT_PASSWORD || !SESSION_SECRET) {
  console.error(
    "Missing env vars. Set VAULT_LOGIN_PASSWORD, VAULT_EDIT_PASSWORD, and SESSION_SECRET before starting."
  );
  process.exit(1);
}

const sessions = new Map();

function getDefaultWorkspace() {
  return {
    canvases: [
      {
        id: "canvas-1",
        name: "Canvas 1",
        items: [],
        settings: {
          canvasBg: "#000000",
          snapEnabled: true,
          gridSize: 24,
          showGuides: true,
          zoom: 1,
          cursorData: "",
          textStretchDrag: false,
          dockVisible: true
        }
      }
    ],
    activeCanvasId: "canvas-1",
    publicCanvasId: "canvas-1"
  };
}

function readWorkspaceFromDisk() {
  try {
    if (!fs.existsSync(WORKSPACE_FILE)) return getDefaultWorkspace();
    const raw = fs.readFileSync(WORKSPACE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : getDefaultWorkspace();
  } catch (error) {
    console.error("Failed to read workspace file:", error);
    return getDefaultWorkspace();
  }
}

function writeWorkspaceToDisk(workspace) {
  const parent = path.dirname(WORKSPACE_FILE);
  fs.mkdirSync(parent, { recursive: true });
  const tmpFile = `${WORKSPACE_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(workspace), "utf8");
  fs.renameSync(tmpFile, WORKSPACE_FILE);
}

function constantTimeEqual(a, b) {
  const aBuffer = Buffer.from(String(a || ""), "utf8");
  const bBuffer = Buffer.from(String(b || ""), "utf8");
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function signSessionToken(token) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
}

function issueSessionValue() {
  const token = crypto.randomBytes(32).toString("hex");
  return `${token}.${signSessionToken(token)}`;
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  const out = {};
  for (const pair of raw.split(";")) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = decodeURIComponent(trimmed.slice(0, idx));
    const value = decodeURIComponent(trimmed.slice(idx + 1));
    out[key] = value;
  }
  return out;
}

function validateSession(cookieValue) {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;
  const [token, signature] = parts;
  const expected = signSessionToken(token);
  if (!constantTimeEqual(signature, expected)) return null;
  const record = sessions.get(token);
  if (!record) return null;
  if (record.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, record };
}

function setJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function setSessionCookie(res, sessionValue) {
  const attrs = [
    `${SESSION_COOKIE}=${encodeURIComponent(sessionValue)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  ];
  if (IS_PROD) attrs.push("Secure");
  res.setHeader("Set-Cookie", attrs.join("; "));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 50_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime"
  };
  return map[ext] || "application/octet-stream";
}

function safeResolveStaticPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const absolute = path.join(ROOT, normalized);
  if (!absolute.startsWith(ROOT)) return null;
  return absolute;
}

function serveStatic(req, res, urlPathname) {
  let target = urlPathname === "/" ? "/index.html" : urlPathname;
  const absolute = safeResolveStaticPath(target);
  if (!absolute) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.stat(absolute, (statErr, stats) => {
    if (statErr) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const filePath = stats.isDirectory() ? path.join(absolute, "index.html") : absolute;
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
      res.end(data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/auth/status" && req.method === "GET") {
    const cookies = parseCookies(req);
    const session = validateSession(cookies[SESSION_COOKIE]);
    setJson(res, 200, { unlocked: Boolean(session) });
    return;
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const password = typeof body.password === "string" ? body.password : "";
      if (!constantTimeEqual(password, VAULT_LOGIN_PASSWORD)) {
        setJson(res, 401, { ok: false });
        return;
      }
      const sessionValue = issueSessionValue();
      const token = sessionValue.split(".")[0];
      sessions.set(token, { expiresAt: Date.now() + SESSION_TTL_MS });
      setSessionCookie(res, sessionValue);
      setJson(res, 200, { ok: true });
      return;
    } catch (error) {
      setJson(res, 400, { ok: false });
      return;
    }
  }

  if (url.pathname === "/api/auth/edit" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const password = typeof body.password === "string" ? body.password : "";
      if (!constantTimeEqual(password, VAULT_EDIT_PASSWORD)) {
        setJson(res, 401, { ok: false });
        return;
      }
      setJson(res, 200, { ok: true });
      return;
    } catch (error) {
      setJson(res, 400, { ok: false });
      return;
    }
  }

  if (url.pathname === "/api/vault/workspace" && req.method === "GET") {
    const workspace = readWorkspaceFromDisk();
    setJson(res, 200, { workspace });
    return;
  }

  if (url.pathname === "/api/vault/workspace" && req.method === "PUT") {
    const cookies = parseCookies(req);
    const session = validateSession(cookies[SESSION_COOKIE]);
    if (!session) {
      setJson(res, 401, { ok: false, error: "unauthorized" });
      return;
    }
    try {
      const body = await readJsonBody(req);
      if (!body || typeof body.workspace !== "object" || Array.isArray(body.workspace)) {
        setJson(res, 400, { ok: false, error: "invalid workspace payload" });
        return;
      }
      writeWorkspaceToDisk(body.workspace);
      setJson(res, 200, { ok: true });
      return;
    } catch (error) {
      console.error("Failed to write workspace:", error);
      setJson(res, 500, { ok: false, error: "workspace save failed" });
      return;
    }
  }

  serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
