const WORKSPACE_URL = "./workspace.json";
const AUTH_API_BASE = window.SCENERY_AUTH_BASE || "";
const AUTH_ENDPOINT_LOGIN = `${AUTH_API_BASE}/api/auth/login`;
const AUTH_ENDPOINT_EDIT = `${AUTH_API_BASE}/api/auth/edit`;
let currentItems = [];
let isUnlocked = false;

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

function renderItem(item, canvas) {
  const type = typeof item.type === "string" ? item.type : "";
  const wrapper = document.createElement("div");
  wrapper.className = `canvas-item ${type}`;
  applyBoxStyle(wrapper, item);

  if (type === "image") {
    const img = document.createElement("img");
    img.alt = item.name || "";
    img.src = item.src || "";
    img.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
    wrapper.appendChild(img);
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

function pickCanvas(payload) {
  const workspace = payload && payload.workspace ? payload.workspace : payload;
  if (!workspace || !Array.isArray(workspace.canvases)) return null;
  const id = workspace.publicCanvasId || workspace.activeCanvasId;
  return workspace.canvases.find((canvas) => canvas.id === id) || workspace.canvases[0] || null;
}

function applyResponsiveLayout() {
  const canvas = document.getElementById("canvas");
  const wrap = document.querySelector(".canvas-wrap");
  const topbar = document.querySelector(".topbar");
  if (!canvas || !wrap) return;

  let maxRight = 0;
  let maxBottom = 0;
  for (const item of currentItems) {
    if (item && item.hidden) continue;
    const x = asNumber(item && item.x, 0);
    const y = asNumber(item && item.y, 0);
    const w = Math.max(1, asNumber(item && item.w, 240));
    const h = Math.max(1, asNumber(item && item.h, 120));
    maxRight = Math.max(maxRight, x + w + 40);
    maxBottom = Math.max(maxBottom, y + h + 40);
  }

  const designWidth = Math.max(640, Math.round(maxRight || 640));
  const designHeight = Math.max(420, Math.round(maxBottom || 420));
  const topbarHeight = topbar ? topbar.offsetHeight : 0;
  const viewportWidth = Math.max(320, window.innerWidth);
  const viewportHeight = Math.max(240, window.innerHeight - topbarHeight - 12);
  let fitScale = Math.min(viewportWidth / designWidth, viewportHeight / designHeight);
  fitScale = Math.max(0.25, Math.min(1.35, fitScale));
  const offsetX = Math.max(0, Math.round((viewportWidth - (designWidth * fitScale)) / 2));

  canvas.style.width = `${designWidth}px`;
  canvas.style.height = `${designHeight}px`;
  canvas.style.transformOrigin = "top left";
  canvas.style.transform = `translate(${offsetX}px, 0px) scale(${fitScale})`;
  wrap.style.minHeight = `${Math.ceil((designHeight * fitScale) + topbarHeight)}px`;
}

async function loadAndRender() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  try {
    const response = await fetch(WORKSPACE_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const selected = pickCanvas(payload);
    if (!selected) return;

    const settings = selected.settings || {};
    if (typeof settings.canvasBg === "string" && settings.canvasBg) {
      document.querySelector(".canvas-wrap").style.background = settings.canvasBg;
    }

    const items = Array.isArray(selected.items) ? selected.items : [];
    currentItems = items;
    for (const item of items) renderItem(item, canvas);
    applyResponsiveLayout();
  } catch (error) {
    console.error("Vault viewer failed to load workspace.json", error);
  }
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

async function verifyVaultLoginPassword(password) {
  try {
    const response = await postJson(AUTH_ENDPOINT_LOGIN, { password });
    return response.ok;
  } catch (error) {
    console.error("Vault login request failed.", error);
    return false;
  }
}

function unlockViewer() {
  isUnlocked = true;
  const gate = document.getElementById("gate");
  const topbar = document.querySelector(".topbar");
  const wrap = document.querySelector(".canvas-wrap");
  if (gate) gate.style.display = "none";
  if (topbar) topbar.hidden = false;
  if (wrap) wrap.hidden = false;
  loadAndRender();
}

function setupViewerGate() {
  const form = document.getElementById("loginForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("errorMsg");
  const submit = form ? form.querySelector("button[type='submit'], button") : null;
  if (!form || !input || !error) {
    unlockViewer();
    return;
  }
  input.focus();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = input.value;
    if (submit) submit.disabled = true;
    error.textContent = "Checking...";
    const ok = await verifyVaultLoginPassword(password);
    if (submit) submit.disabled = false;
    if (!ok) {
      error.textContent = "REQUEST/./SCENERY. (OR SERVER OFFLINE)";
      input.select();
      return;
    }
    error.textContent = "";
    input.value = "";
    unlockViewer();
  });
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

setupViewerGate();
setupEditorEntry();
window.addEventListener("resize", () => {
  if (!isUnlocked) return;
  applyResponsiveLayout();
});
