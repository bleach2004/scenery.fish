const WORKSPACE_URL = "./workspace.json";
const AUTH_API_BASE = window.SCENERY_AUTH_BASE || "https://marisu.bleach-542.workers.dev";
const WORKSPACE_API_URL = `${AUTH_API_BASE}/api/workspace/published`;
const AUTH_ENDPOINT_LOGIN = `${AUTH_API_BASE}/api/auth/login`;
const AUTH_ENDPOINT_EDIT = `${AUTH_API_BASE}/api/auth/edit`;
const ASSET_POOL_REF_KEY = "__vaultAssetRef";
const ASSET_EXTERNAL_REF_KEY = "__vaultAssetExternalRef";
const ASSET_POOL_VERSION = 1;
const ASSET_SOURCE_TYPE = "github-workspace-v1";
const ASSET_RESOLVE_MAX_DEPTH = 5;
const GITHUB_OWNER = "bleach2004";
const GITHUB_REPO = "scenery.fish";
const GITHUB_WORKSPACE_PATH = "vault/workspace.json";
const assetSourceCache = new Map();
let currentItems = [];

function asNumber(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function applyBoxStyle(node, item) {
  node.style.left = `${asNumber(item.x, 0)}px`;
  node.style.top = `${asNumber(item.y, 0)}px`;
  node.style.width = `${Math.max(1, asNumber(item.w, 240))}px`;
  node.style.height = `${Math.max(1, asNumber(item.h, 120))}px`;
  if (item.hidden) node.classList.add("hidden");
}

function applyOptionalLink(node, item) {
  if (!item.linkUrl || typeof item.linkUrl !== "string") return node;
  const link = document.createElement("a");
  link.href = item.linkUrl;
  link.target = item.linkTarget === "_self" ? "_self" : "_blank";
  link.rel = "noopener noreferrer";
  link.style.display = "block";
  link.style.width = "100%";
  link.style.height = "100%";
  link.appendChild(node);
  return link;
}

function normalizeCardExplodeLayers(item) {
  if (!item || !Array.isArray(item.cardExplodeLayers)) return [];
  return item.cardExplodeLayers
    .filter((src) => typeof src === "string" && src.trim())
    .slice(0, 6);
}

function isAssetPoolRefObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== ASSET_POOL_REF_KEY) return false;
  const index = value[ASSET_POOL_REF_KEY];
  return Number.isInteger(index) && index >= 0;
}

function isAssetExternalRefObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== ASSET_EXTERNAL_REF_KEY) return false;
  const data = value[ASSET_EXTERNAL_REF_KEY];
  return Boolean(
    data &&
    typeof data === "object" &&
    Number.isInteger(data.source) &&
    data.source >= 0 &&
    Number.isInteger(data.index) &&
    data.index >= 0
  );
}

function normalizeAssetSourceDescriptor(source) {
  if (!source || typeof source !== "object") return null;
  if (source.type !== ASSET_SOURCE_TYPE) return null;
  const owner = typeof source.owner === "string" && source.owner.trim() ? source.owner.trim() : GITHUB_OWNER;
  const repo = typeof source.repo === "string" && source.repo.trim() ? source.repo.trim() : GITHUB_REPO;
  const path = typeof source.path === "string" && source.path.trim() ? source.path.trim() : GITHUB_WORKSPACE_PATH;
  const commit = typeof source.commit === "string" && source.commit.trim() ? source.commit.trim() : "";
  if (!commit) return null;
  return { type: ASSET_SOURCE_TYPE, owner, repo, path, commit };
}

function buildAssetSourceCacheKey(source) {
  return `${source.owner}/${source.repo}:${source.path}@${source.commit}`;
}

function looksLikeEmbeddableDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:");
}

function collectEmbeddableAssets(value, assets, indexByAsset) {
  if (looksLikeEmbeddableDataUrl(value)) {
    if (!indexByAsset.has(value)) {
      indexByAsset.set(value, assets.length);
      assets.push(value);
    }
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const entry of value) {
      collectEmbeddableAssets(entry, assets, indexByAsset);
    }
    return;
  }
  if (isAssetPoolRefObject(value) || isAssetExternalRefObject(value)) return;
  for (const entry of Object.values(value)) {
    collectEmbeddableAssets(entry, assets, indexByAsset);
  }
}

function buildEmbeddableAssetIndex(value) {
  const assets = [];
  const indexByAsset = new Map();
  collectEmbeddableAssets(value, assets, indexByAsset);
  return { assets, indexByAsset };
}

function unpackValueWithAssetPool(value, assetPool) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.map((entry) => unpackValueWithAssetPool(entry, assetPool));
  }
  if (isAssetPoolRefObject(value)) {
    const index = value[ASSET_POOL_REF_KEY];
    if (index >= 0 && index < assetPool.length) return assetPool[index];
    return "";
  }
  if (isAssetExternalRefObject(value)) {
    return value;
  }
  const next = {};
  for (const [key, entry] of Object.entries(value)) {
    next[key] = unpackValueWithAssetPool(entry, assetPool);
  }
  return next;
}

function decodePublishedPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const pool = Array.isArray(payload.assetPool) ? payload.assetPool : null;
  if (!pool || payload.assetPoolVersion !== ASSET_POOL_VERSION) return payload;
  if (!pool.every((entry) => typeof entry === "string")) return payload;

  const unpackSource = { ...payload };
  delete unpackSource.assetPool;
  delete unpackSource.assetPoolVersion;
  return unpackValueWithAssetPool(unpackSource, pool);
}

function getWorkspaceShape(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.workspace && typeof payload.workspace === "object") return payload.workspace;
  if (Array.isArray(payload.canvases)) return payload;
  return null;
}

async function getAssetsForSource(source, depth = 0) {
  if (depth > ASSET_RESOLVE_MAX_DEPTH) return [];
  const normalized = normalizeAssetSourceDescriptor(source);
  if (!normalized) return [];
  const cacheKey = buildAssetSourceCacheKey(normalized);
  if (assetSourceCache.has(cacheKey)) {
    return assetSourceCache.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const url =
      `https://raw.githubusercontent.com/${normalized.owner}/${normalized.repo}/` +
      `${encodeURIComponent(normalized.commit)}/${normalized.path}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to load asset source (${response.status}): ${body}`);
    }
    const sourcePayload = await response.json();
    const resolvedSourcePayload = await resolvePublishedPayloadAssets(sourcePayload, depth + 1);
    const sourceWorkspace = getWorkspaceShape(resolvedSourcePayload);
    if (!sourceWorkspace) return [];
    return buildEmbeddableAssetIndex(sourceWorkspace).assets;
  })().catch((error) => {
    assetSourceCache.delete(cacheKey);
    throw error;
  });

  assetSourceCache.set(cacheKey, fetchPromise);
  return fetchPromise;
}

async function resolveAssetExternalRefs(value, assetSources, depth = 0) {
  if (depth > ASSET_RESOLVE_MAX_DEPTH) return value;
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    const out = [];
    for (const entry of value) {
      out.push(await resolveAssetExternalRefs(entry, assetSources, depth));
    }
    return out;
  }
  if (isAssetExternalRefObject(value)) {
    const ref = value[ASSET_EXTERNAL_REF_KEY];
    const source = assetSources[ref.source];
    if (!source) return "";
    try {
      const assets = await getAssetsForSource(source, depth + 1);
      return ref.index >= 0 && ref.index < assets.length ? assets[ref.index] : "";
    } catch (error) {
      console.warn("Failed to resolve external asset ref.", error);
      return "";
    }
  }
  const next = {};
  for (const [key, entry] of Object.entries(value)) {
    next[key] = await resolveAssetExternalRefs(entry, assetSources, depth);
  }
  return next;
}

async function resolvePublishedPayloadAssets(payload, depth = 0) {
  const decoded = decodePublishedPayload(payload);
  if (!decoded || typeof decoded !== "object") return decoded;
  const sources = Array.isArray(decoded.assetSources)
    ? decoded.assetSources.map((source) => normalizeAssetSourceDescriptor(source)).filter(Boolean)
    : [];
  if (!sources.length) return decoded;

  if (decoded.workspace && typeof decoded.workspace === "object") {
    return {
      ...decoded,
      workspace: await resolveAssetExternalRefs(decoded.workspace, sources, depth)
    };
  }
  if (Array.isArray(decoded.canvases)) {
    return await resolveAssetExternalRefs(decoded, sources, depth);
  }
  return decoded;
}

async function decodePublishEnvelope(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.payload && typeof payload.payload === "object") {
    return { ...payload, payload: await resolvePublishedPayloadAssets(payload.payload) };
  }
  return resolvePublishedPayloadAssets(payload);
}

function renderItem(item, canvas) {
  const type = typeof item.type === "string" ? item.type : "";
  const wrapper = document.createElement("div");
  wrapper.className = `canvas-item ${type}`;
  applyBoxStyle(wrapper, item);

  if (type === "image") {
    const layers = normalizeCardExplodeLayers(item);
    const hasCardExplode = layers.length === 6;
    const primarySrc = typeof item.src === "string" && item.src.trim()
      ? item.src
      : (layers[0] || "");
    if (hasCardExplode) {
      wrapper.classList.add("card-explode");
      const scene = document.createElement("div");
      scene.className = "card-explode-scene";

      const main = document.createElement("img");
      main.alt = item.name || "";
      main.src = primarySrc;
      main.className = "card-explode-main";
      main.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
      scene.appendChild(main);

      layers.forEach((src, index) => {
        const layer = document.createElement("img");
        layer.alt = "";
        layer.src = src;
        layer.className = `card-explode-layer card-explode-layer-${index + 1}`;
        layer.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
        scene.appendChild(layer);
      });

      wrapper.style.filter = item.invertMedia ? "invert(1)" : "none";
      wrapper.appendChild(scene);
    } else {
      const img = document.createElement("img");
      img.alt = item.name || "";
      img.src = primarySrc;
      img.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
      img.style.filter = item.invertMedia ? "invert(1)" : "none";
      wrapper.appendChild(img);
    }
  } else if (type === "video") {
    const video = document.createElement("video");
    video.src = item.src || "";
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.controls = true;
    video.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
    wrapper.appendChild(video);
  } else if (type === "audio") {
    const audio = document.createElement("audio");
    audio.src = item.src || "";
    audio.controls = true;
    audio.style.width = "100%";
    wrapper.appendChild(audio);
  } else {
    wrapper.textContent = item.text || "";
    if (item.fontSize) wrapper.style.fontSize = `${asNumber(item.fontSize, 20)}px`;
    if (item.color) wrapper.style.color = item.color;
    if (item.fontFamily) wrapper.style.fontFamily = item.fontFamily;
  }

  const node = applyOptionalLink(wrapper, item);
  canvas.appendChild(node);
}

function toWorkspaceShape(payload) {
  let next = payload;
  for (let i = 0; i < 4; i += 1) {
    if (!next || typeof next !== "object") return null;
    if (Array.isArray(next.canvases)) return next;
    if (next.workspace && typeof next.workspace === "object") {
      next = next.workspace;
      continue;
    }
    if (next.payload && typeof next.payload === "object") {
      next = next.payload;
      continue;
    }
    return null;
  }
  return null;
}

function pickCanvas(payload) {
  const workspace = toWorkspaceShape(payload);
  if (!workspace || !Array.isArray(workspace.canvases)) return null;
  const id = workspace.publicCanvasId || workspace.activeCanvasId;
  return workspace.canvases.find((canvas) => canvas.id === id) || workspace.canvases[0] || null;
}

function applyResponsiveLayout() {
  const canvas = document.getElementById("canvas");
  const wrap = document.querySelector(".canvas-wrap");
  const topbar = document.querySelector(".topbar");
  if (!canvas || !wrap) return;

  const topbarHeight = topbar ? topbar.offsetHeight : 0;
  const viewportWidth = Math.max(320, window.innerWidth);
  const viewportHeight = Math.max(240, window.innerHeight - topbarHeight);

  // Keep the published view at viewport size so offscreen placement stays offscreen.
  canvas.style.width = `${viewportWidth}px`;
  canvas.style.height = `${viewportHeight}px`;
  canvas.style.transformOrigin = "top left";
  canvas.style.transform = "none";
  wrap.style.minHeight = `${Math.ceil(viewportHeight + topbarHeight)}px`;
}

async function loadAndRender() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  const sources = [`${WORKSPACE_API_URL}?t=${Date.now()}`, `${WORKSPACE_URL}?t=${Date.now()}`];
  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) continue;
      const payload = await decodePublishEnvelope(await response.json());
      const selected = pickCanvas(payload);
      if (!selected) continue;

      const settings = selected.settings || {};
      if (typeof settings.canvasBg === "string" && settings.canvasBg) {
        document.querySelector(".canvas-wrap").style.background = settings.canvasBg;
      }

      const items = Array.isArray(selected.items) ? selected.items : [];
      currentItems = items;
      for (const item of items) renderItem(item, canvas);
      applyResponsiveLayout();
      return;
    } catch (error) {
      console.error("Vault viewer source failed", source, error);
    }
  }
  console.error("Vault viewer failed to load any workspace source");
}

async function postJson(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function verifyAnyVaultPassword(password) {
  try {
    const loginResp = await postJson(AUTH_ENDPOINT_LOGIN, { password });
    if (loginResp.ok) return true;
    const editResp = await postJson(AUTH_ENDPOINT_EDIT, { password });
    return editResp.ok;
  } catch (error) {
    console.error("Vault auth request failed.", error);
    return false;
  }
}

function setupEditorEntry() {
  const button = document.getElementById("enterEditorBtn");
  if (!button) return;
  button.addEventListener("click", async () => {
    const input = prompt("SCENERY ONLY");
    if (input === null) return;
    button.disabled = true;
    const ok = await verifyAnyVaultPassword(input);
    button.disabled = false;
    if (!ok) {
      alert("XD");
      return;
    }
    window.location.href = "./sceneryonly/";
  });
}

loadAndRender();
setupEditorEntry();
window.addEventListener("resize", applyResponsiveLayout);
