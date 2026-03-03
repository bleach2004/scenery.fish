const WORKSPACE_URL = "./workspace.json";

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
    for (const item of items) renderItem(item, canvas);
  } catch (error) {
    console.error("Vault viewer failed to load workspace.json", error);
  }
}

loadAndRender();
