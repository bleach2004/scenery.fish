const WORKSPACE_URL = "./workspace.json";
const AUTH_API_BASE = window.SCENERY_AUTH_BASE || "https://marisu.bleach-542.workers.dev";
const WORKSPACE_API_URL = `${AUTH_API_BASE}/api/workspace/published`;
const AUTH_ENDPOINT_LOGIN = `${AUTH_API_BASE}/api/auth/login`;
const AUTH_ENDPOINT_EDIT = `${AUTH_API_BASE}/api/auth/edit`;
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
      const payload = await response.json();
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
