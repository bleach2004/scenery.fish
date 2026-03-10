    const AUTH_API_BASE = String(window.SCENERY_AUTH_BASE || "").trim().replace(/\/+$/, "");
    const API_BASE = AUTH_API_BASE || "";
    const PUBLISHED_WORKSPACE_URL = "/vault/workspace.json";
    const PUBLISHED_WORKSPACE_API_URL = `${API_BASE}/api/workspace/published`;
    const PUBLISH_MAX_BYTES = 90 * 1024 * 1024;
    const LEGACY_STORAGE_KEY = "vaultCanvasItemsV1";
    const LEGACY_SETTINGS_KEY = "vaultUiSettingsV1";
    const WORKSPACE_KEY = "vaultWorkspaceV2";
    const HISTORY_LIMIT = 150;
    const DEFAULT_FONT_FAMILY = "Segoe UI, Trebuchet MS, sans-serif";
    const DEFAULT_ITEMS = [];
    const DEFAULT_SETTINGS = {
      canvasBg: "#000000",
      snapEnabled: true,
      gridSize: 24,
      showGuides: true,
      zoom: 1,
      cursorData: "",
      textStretchDrag: false,
      dockVisible: true,
      topbarAutoHide: false,
      sceneTransition: "none",
      sceneTransitionSpeed: 0.5,
      stylePresets: []
    };

    const gate = document.getElementById("gate");
    const portfolio = document.getElementById("portfolio");
    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("passwordInput");
    const errorMsg = document.getElementById("errorMsg");
    const toolbar = document.getElementById("toolbar");
    const toggleEditBtn = document.getElementById("toggleEdit");
    const addTextBtn = document.getElementById("addTextBtn");
    const addBlogBtn = document.getElementById("addBlogBtn");
    const addImageBtn = document.getElementById("addImageBtn");
    const duplicateBtn = document.getElementById("duplicateBtn");
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const toggleDockBtn = document.getElementById("toggleDockBtn");
    const toggleTopbarBtn = document.getElementById("toggleTopbarBtn");
    const saveBtn = document.getElementById("saveBtn");
    const publishBtn = document.getElementById("publishBtn");
    const resetBtn = document.getElementById("resetBtn");
    const purgeCacheBtn = document.getElementById("purgeCacheBtn");
    const saveStatus = document.getElementById("saveStatus");
    const imageInput = document.getElementById("imageInput");
    const importInput = document.getElementById("importInput");
    const cursorInput = document.getElementById("cursorInput");
    const canvas = document.getElementById("canvas");
    const canvasWrap = document.querySelector(".canvas-wrap");
    const guideX = document.getElementById("guideX");
    const guideY = document.getElementById("guideY");
    const sidePanel = document.getElementById("sidePanel");
    const panelToggleButtons = Array.from(document.querySelectorAll("[data-panel-toggle]"));
    const boldBtn = document.getElementById("boldBtn");
    const italicBtn = document.getElementById("italicBtn");
    const h1Btn = document.getElementById("h1Btn");
    const h2Btn = document.getElementById("h2Btn");
    const h3Btn = document.getElementById("h3Btn");
    const paragraphBtn = document.getElementById("paragraphBtn");
    const quoteBtn = document.getElementById("quoteBtn");
    const bulletListBtn = document.getElementById("bulletListBtn");
    const numberedListBtn = document.getElementById("numberedListBtn");
    const alignLeftTextBtn = document.getElementById("alignLeftTextBtn");
    const alignCenterTextBtn = document.getElementById("alignCenterTextBtn");
    const alignRightTextBtn = document.getElementById("alignRightTextBtn");
    const selectionFontSizeInput = document.getElementById("selectionFontSizeInput");
    const applySelectionSizeBtn = document.getElementById("applySelectionSizeBtn");
    const boxFontSizeInput = document.getElementById("boxFontSizeInput");
    const applyBoxSizeBtn = document.getElementById("applyBoxSizeBtn");
    const selectionColorInput = document.getElementById("selectionColorInput");
    const applySelectionColorBtn = document.getElementById("applySelectionColorBtn");
    const boxColorInput = document.getElementById("boxColorInput");
    const applyBoxColorBtn = document.getElementById("applyBoxColorBtn");
    const fontFamilySelect = document.getElementById("fontFamilySelect");
    const applySelectionFontBtn = document.getElementById("applySelectionFontBtn");
    const applyBoxFontBtn = document.getElementById("applyBoxFontBtn");
    const linkUrlInput = document.getElementById("linkUrlInput");
    const linkLabelInput = document.getElementById("linkLabelInput");
    const linkDisplaySelect = document.getElementById("linkDisplaySelect");
    const linkTargetSelect = document.getElementById("linkTargetSelect");
    const applyTextLinkBtn = document.getElementById("applyTextLinkBtn");
    const removeTextLinkBtn = document.getElementById("removeTextLinkBtn");
    const attachTextBoxLinkBtn = document.getElementById("attachTextBoxLinkBtn");
    const attachLayerLinkBtn = document.getElementById("attachLayerLinkBtn");
    const clearLayerLinkBtn = document.getElementById("clearLayerLinkBtn");
    const animationSelect = document.getElementById("animationSelect");
    const animationSpeedInput = document.getElementById("animationSpeedInput");
    const applyAnimationBtn = document.getElementById("applyAnimationBtn");
    const stretchXInput = document.getElementById("stretchXInput");
    const stretchYInput = document.getElementById("stretchYInput");
    const applyStretchBtn = document.getElementById("applyStretchBtn");
    const stretchDragToggle = document.getElementById("stretchDragToggle");
    const mediaFitSelect = document.getElementById("mediaFitSelect");
    const applyMediaFitBtn = document.getElementById("applyMediaFitBtn");
    const toggleMediaFitBtn = document.getElementById("toggleMediaFitBtn");
    const invertMediaToggle = document.getElementById("invertMediaToggle");
    const applyInvertMediaBtn = document.getElementById("applyInvertMediaBtn");
    const zoomInput = document.getElementById("zoomInput");
    const zoomValue = document.getElementById("zoomValue");
    const snapToggle = document.getElementById("snapToggle");
    const gridSizeInput = document.getElementById("gridSizeInput");
    const guideToggle = document.getElementById("guideToggle");
    const canvasSelect = document.getElementById("canvasSelect");
    const prevCanvasBtn = document.getElementById("prevCanvasBtn");
    const nextCanvasBtn = document.getElementById("nextCanvasBtn");
    const newCanvasBtn = document.getElementById("newCanvasBtn");
    const publicCanvasSelect = document.getElementById("publicCanvasSelect");
    const quickClumpBtn = document.getElementById("quickClumpBtn");
    const quickRandomizeBtn = document.getElementById("quickRandomizeBtn");
    const quickInspireBtn = document.getElementById("quickInspireBtn");
    const alignLeftBtn = document.getElementById("alignLeftBtn");
    const alignCenterBtn = document.getElementById("alignCenterBtn");
    const alignRightBtn = document.getElementById("alignRightBtn");
    const alignTopBtn = document.getElementById("alignTopBtn");
    const alignMiddleBtn = document.getElementById("alignMiddleBtn");
    const alignBottomBtn = document.getElementById("alignBottomBtn");
    const distributeHBtn = document.getElementById("distributeHBtn");
    const distributeVBtn = document.getElementById("distributeVBtn");
    const exportJsonBtn = document.getElementById("exportJsonBtn");
    const importJsonBtn = document.getElementById("importJsonBtn");
    const layerList = document.getElementById("layerList");
    const renameLayerBtn = document.getElementById("renameLayerBtn");
    const toggleLockBtn = document.getElementById("toggleLockBtn");
    const toggleVisibleBtn = document.getElementById("toggleVisibleBtn");
    const layerDeleteBtn = document.getElementById("layerDeleteBtn");
    const bgColorInput = document.getElementById("bgColorInput");
    const uploadCursorBtn = document.getElementById("uploadCursorBtn");
    const clearCursorBtn = document.getElementById("clearCursorBtn");
    const cursorStatus = document.getElementById("cursorStatus");
    const smartLayoutSelect = document.getElementById("smartLayoutSelect");
    const layoutGapInput = document.getElementById("layoutGapInput");
    const applySmartLayoutBtn = document.getElementById("applySmartLayoutBtn");
    const slideColumnsInput = document.getElementById("slideColumnsInput");
    const applySlideColumnsBtn = document.getElementById("applySlideColumnsBtn");
    const balanceColumnsBtn = document.getElementById("balanceColumnsBtn");
    const clumpStrengthInput = document.getElementById("clumpStrengthInput");
    const clumpSpreadInput = document.getElementById("clumpSpreadInput");
    const clumpBtn = document.getElementById("clumpBtn");
    const explodeBtn = document.getElementById("explodeBtn");
    const randomizeLayoutBtn = document.getElementById("randomizeLayoutBtn");
    const inspireLayoutBtn = document.getElementById("inspireLayoutBtn");
    const hoverFxSelect = document.getElementById("hoverFxSelect");
    const applyHoverFxBtn = document.getElementById("applyHoverFxBtn");
    const clearHoverFxBtn = document.getElementById("clearHoverFxBtn");
    const hoverBlurInput = document.getElementById("hoverBlurInput");
    const hoverBlurValue = document.getElementById("hoverBlurValue");
    const applyHoverBlurBtn = document.getElementById("applyHoverBlurBtn");
    const hoverSwapInput = document.getElementById("hoverSwapInput");
    const applyHoverSwapBtn = document.getElementById("applyHoverSwapBtn");
    const clearHoverSwapBtn = document.getElementById("clearHoverSwapBtn");
    const blendModeSelect = document.getElementById("blendModeSelect");
    const applyBlendModeBtn = document.getElementById("applyBlendModeBtn");
    const clearBlendModeBtn = document.getElementById("clearBlendModeBtn");
    const depthInput = document.getElementById("depthInput");
    const shadowSoftnessInput = document.getElementById("shadowSoftnessInput");
    const applyDepthBtn = document.getElementById("applyDepthBtn");
    const scrollRevealSelect = document.getElementById("scrollRevealSelect");
    const applyScrollRevealBtn = document.getElementById("applyScrollRevealBtn");
    const clearScrollRevealBtn = document.getElementById("clearScrollRevealBtn");
    const marqueeAxisSelect = document.getElementById("marqueeAxisSelect");
    const marqueeGapInput = document.getElementById("marqueeGapInput");
    const applyMarqueeStripBtn = document.getElementById("applyMarqueeStripBtn");
    const clearMarqueeStripBtn = document.getElementById("clearMarqueeStripBtn");
    const sceneTransitionSelect = document.getElementById("sceneTransitionSelect");
    const sceneTransitionSpeedInput = document.getElementById("sceneTransitionSpeedInput");
    const applySceneTransitionBtn = document.getElementById("applySceneTransitionBtn");
    const stylePresetNameInput = document.getElementById("stylePresetNameInput");
    const saveStylePresetBtn = document.getElementById("saveStylePresetBtn");
    const stylePresetSelect = document.getElementById("stylePresetSelect");
    const applyStylePresetBtn = document.getElementById("applyStylePresetBtn");
    const deleteStylePresetBtn = document.getElementById("deleteStylePresetBtn");

    let isUnlocked = false;
    let isEditMode = false;
    let transformState = null;
    let activeItemId = null;
    let selectedItemIds = [];
    let activeTextRange = null;
    let draggingLayerId = null;
    let workspace = normalizeWorkspace(loadWorkspaceFromLocal());
    let currentCanvasId = workspace.activeCanvasId;
    let items = [];
    let settings = normalizeSettings({});
    let history = [];
    let historyIndex = -1;
    let isRestoringHistory = false;
    let isPublishingGithub = false;
    let lastVerifiedEditPassword = "";
    let revealObserver = null;
    let topbarPeekActive = false;
    let imageInspectOverlay = null;
    let imageInspectImg = null;
    let imageInspectTitle = null;

    function forceHideVaultToolbar() {
      if (!toolbar) return;
      document.body.classList.add("vault-no-toolbar");
      toolbar.setAttribute("hidden", "");
      toolbar.style.setProperty("display", "none", "important");
      toolbar.style.setProperty("visibility", "hidden", "important");
      toolbar.style.setProperty("pointer-events", "none", "important");
    }

    function apiUrl(path) {
      if (!path.startsWith("/")) return path;
      return `${API_BASE}${path}`;
    }

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function ensureImageInspectOverlay() {
      if (imageInspectOverlay) return imageInspectOverlay;
      const overlay = document.createElement("div");
      overlay.className = "image-inspect-overlay";
      overlay.setAttribute("aria-hidden", "true");

      const frame = document.createElement("figure");
      frame.className = "image-inspect-frame";

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "image-inspect-close";
      closeBtn.setAttribute("aria-label", "Close image");
      closeBtn.textContent = "Close";

      const img = document.createElement("img");
      img.className = "image-inspect-img";
      img.alt = "";

      const caption = document.createElement("figcaption");
      caption.className = "image-inspect-caption";
      caption.textContent = "";

      closeBtn.addEventListener("click", () => closeImageInspect());
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeImageInspect();
      });
      frame.addEventListener("click", (event) => event.stopPropagation());

      frame.appendChild(closeBtn);
      frame.appendChild(img);
      frame.appendChild(caption);
      overlay.appendChild(frame);
      document.body.appendChild(overlay);

      imageInspectOverlay = overlay;
      imageInspectImg = img;
      imageInspectTitle = caption;
      return overlay;
    }

    function openImageInspect(src, title = "") {
      if (!src) return;
      const overlay = ensureImageInspectOverlay();
      imageInspectImg.src = src;
      imageInspectImg.alt = title || "Image preview";
      imageInspectTitle.textContent = title || "";
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("vault-image-inspect-open");
    }

    function closeImageInspect() {
      if (!imageInspectOverlay) return;
      imageInspectOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("vault-image-inspect-open");
      if (imageInspectImg) {
        imageInspectImg.removeAttribute("src");
        imageInspectImg.alt = "";
      }
      if (imageInspectTitle) imageInspectTitle.textContent = "";
    }

    function estimateJsonBytes(value) {
      try {
        return new TextEncoder().encode(JSON.stringify(value)).length;
      } catch {
        return Number.POSITIVE_INFINITY;
      }
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes) || bytes < 0) return "unknown size";
      const units = ["B", "KB", "MB", "GB"];
      let size = bytes;
      let unitIndex = 0;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
      }
      return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
    }

    async function postJson(url, payload, options = {}) {
      const timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(1, options.timeoutMs) : 20000;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          cache: "no-store",
          signal: controller.signal
        });
      } finally {
        clearTimeout(timer);
      }
    }

    async function postJsonWithRetry(url, payload, options = {}) {
      const attempts = Number.isFinite(options.attempts) ? Math.max(1, options.attempts) : 3;
      const timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(1, options.timeoutMs) : 20000;
      const retryDelayMs = Number.isFinite(options.retryDelayMs) ? Math.max(0, options.retryDelayMs) : 800;
      let lastError = null;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          const response = await postJson(url, payload, { timeoutMs });
          if (response.status >= 500 && attempt < attempts) {
            await delay(retryDelayMs * attempt);
            continue;
          }
          return response;
        } catch (error) {
          lastError = error;
          if (attempt >= attempts) throw error;
          await delay(retryDelayMs * attempt);
        }
      }
      throw lastError || new Error("Request failed.");
    }

    async function verifyVaultPassword(password) {
      try {
        const response = await postJson(apiUrl("/api/auth/login"), { password });
        if (!response.ok) return false;
        const data = await response.json();
        return Boolean(data && data.ok);
      } catch (error) {
        console.error("Vault login request failed.", error);
        return false;
      }
    }

    async function verifyEditPassword(password) {
      try {
        const response = await postJson(apiUrl("/api/auth/edit"), { password });
        if (!response.ok) return false;
        const data = await response.json();
        const ok = Boolean(data && data.ok);
        if (ok) lastVerifiedEditPassword = password;
        return ok;
      } catch (error) {
        console.error("Edit-mode auth request failed.", error);
        return false;
      }
    }

    function generateId() {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
        return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
      }
      return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function fallbackClone(data) {
      return JSON.parse(JSON.stringify(data));
    }

    function getDefaultSettings() {
      return fallbackClone(DEFAULT_SETTINGS);
    }

    function normalizeSettings(next) {
      return {
        canvasBg: typeof next.canvasBg === "string" ? next.canvasBg : "#000000",
        snapEnabled: Boolean(next.snapEnabled),
        gridSize: clamp(Number(next.gridSize) || 24, 4, 256),
        showGuides: Boolean(next.showGuides),
        zoom: clamp(Number(next.zoom) || 1, 0.25, 3),
        cursorData: typeof next.cursorData === "string" ? next.cursorData : "",
        textStretchDrag: Boolean(next.textStretchDrag),
        dockVisible: typeof next.dockVisible === "boolean" ? next.dockVisible : true,
        topbarAutoHide: typeof next.topbarAutoHide === "boolean" ? next.topbarAutoHide : false,
        sceneTransition: ["none", "fade", "slide-left", "slide-right", "zoom"].includes(next.sceneTransition)
          ? next.sceneTransition
          : "none",
        sceneTransitionSpeed: clamp(Number(next.sceneTransitionSpeed) || 0.5, 0.1, 4),
        stylePresets: Array.isArray(next.stylePresets) ? next.stylePresets.slice(0, 80) : []
      };
    }

    function loadLegacyItems() {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return fallbackClone(DEFAULT_ITEMS);
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallbackClone(DEFAULT_ITEMS);
      } catch {
        return fallbackClone(DEFAULT_ITEMS);
      }
    }

    function loadLegacySettings() {
      const fallback = getDefaultSettings();
      const raw = localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (!raw) return getDefaultSettings();
      try {
        const parsed = JSON.parse(raw);
        return normalizeSettings({
          canvasBg: typeof parsed.canvasBg === "string" ? parsed.canvasBg : fallback.canvasBg,
          snapEnabled: typeof parsed.snapEnabled === "boolean" ? parsed.snapEnabled : fallback.snapEnabled,
          gridSize: typeof parsed.gridSize === "number" ? parsed.gridSize : fallback.gridSize,
          showGuides: typeof parsed.showGuides === "boolean" ? parsed.showGuides : fallback.showGuides,
          zoom: typeof parsed.zoom === "number" ? parsed.zoom : fallback.zoom,
          cursorData: typeof parsed.cursorData === "string" ? parsed.cursorData : fallback.cursorData,
          textStretchDrag: typeof parsed.textStretchDrag === "boolean" ? parsed.textStretchDrag : fallback.textStretchDrag,
          dockVisible: typeof parsed.dockVisible === "boolean" ? parsed.dockVisible : fallback.dockVisible,
          topbarAutoHide: typeof parsed.topbarAutoHide === "boolean" ? parsed.topbarAutoHide : fallback.topbarAutoHide,
          sceneTransition: typeof parsed.sceneTransition === "string" ? parsed.sceneTransition : fallback.sceneTransition,
          sceneTransitionSpeed: typeof parsed.sceneTransitionSpeed === "number"
            ? parsed.sceneTransitionSpeed
            : fallback.sceneTransitionSpeed,
          stylePresets: Array.isArray(parsed.stylePresets) ? parsed.stylePresets : fallback.stylePresets
        });
      } catch {
        return getDefaultSettings();
      }
    }

    function normalizeWorkspace(raw) {
      const sourceCanvases = raw && Array.isArray(raw.canvases) ? raw.canvases : [];
      const canvases = sourceCanvases.map((entry, index) => {
        const name = typeof entry.name === "string" && entry.name.trim()
          ? entry.name.trim()
          : `Canvas ${index + 1}`;
        const id = typeof entry.id === "string" && entry.id.trim()
          ? entry.id
          : generateId();
        const sourceItems = Array.isArray(entry.items) ? entry.items : fallbackClone(DEFAULT_ITEMS);
        return {
          id,
          name,
          items: normalizeItems(sourceItems),
          settings: normalizeSettings(entry.settings || getDefaultSettings())
        };
      });
      if (!canvases.length) {
        canvases.push({
          id: generateId(),
          name: "Canvas 1",
          items: normalizeItems(fallbackClone(DEFAULT_ITEMS)),
          settings: normalizeSettings(getDefaultSettings())
        });
      }
      const validIds = new Set(canvases.map((entry) => entry.id));
      const activeCanvasId = raw && typeof raw.activeCanvasId === "string" && validIds.has(raw.activeCanvasId)
        ? raw.activeCanvasId
        : canvases[0].id;
      const publicCanvasId = raw && typeof raw.publicCanvasId === "string" && validIds.has(raw.publicCanvasId)
        ? raw.publicCanvasId
        : canvases[0].id;
      return {
        canvases,
        activeCanvasId,
        publicCanvasId
      };
    }

    function loadWorkspaceFromLocal() {
      const raw = localStorage.getItem(WORKSPACE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return normalizeWorkspace(parsed);
        } catch {
          // Fall back to legacy storage.
        }
      }
      return normalizeWorkspace({
        canvases: [
          {
            id: generateId(),
            name: "Canvas 1",
            items: loadLegacyItems(),
            settings: loadLegacySettings()
          }
        ]
      });
    }

    async function loadPublishedWorkspace() {
      const apiUrl = `${PUBLISHED_WORKSPACE_API_URL}?t=${Date.now()}`;
      try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (response.ok) {
          const payload = await response.json();
          const apiPayload = payload && payload.payload && typeof payload.payload === "object"
            ? payload.payload
            : null;
          if (apiPayload && apiPayload.workspace && typeof apiPayload.workspace === "object") {
            return normalizeWorkspace(apiPayload.workspace);
          }
          if (apiPayload && Array.isArray(apiPayload.canvases)) {
            return normalizeWorkspace(apiPayload);
          }
        }
      } catch (error) {
        console.error("Failed to load published workspace from API.", error);
      }

      try {
        const response = await fetch(`${PUBLISHED_WORKSPACE_URL}?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return null;
        const payload = await response.json();
        if (!payload || typeof payload !== "object") return null;
        if (payload.workspace && typeof payload.workspace === "object") {
          return normalizeWorkspace(payload.workspace);
        }
        if (Array.isArray(payload.canvases)) {
          return normalizeWorkspace(payload);
        }
        return null;
      } catch (error) {
        console.error("Failed to load published workspace.json.", error);
        return null;
      }
    }

    function findCanvasById(canvasId) {
      return workspace.canvases.find((entry) => entry.id === canvasId) || null;
    }

    function syncCurrentCanvasToWorkspace() {
      syncTextNodesToModel();
      const canvasEntry = findCanvasById(currentCanvasId);
      if (!canvasEntry) return;
      canvasEntry.items = normalizeItems(fallbackClone(items));
      canvasEntry.settings = normalizeSettings(fallbackClone(settings));
    }

    function saveWorkspace() {
      syncCurrentCanvasToWorkspace();
      try {
        localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(LEGACY_SETTINGS_KEY, JSON.stringify(settings));
        return true;
      } catch (error) {
        console.error("Failed to save vault workspace.", error);
        return false;
      }
    }

    function clearLocalWorkspaceCache() {
      try {
        localStorage.removeItem(WORKSPACE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.removeItem(LEGACY_SETTINGS_KEY);
        return true;
      } catch (error) {
        console.error("Failed to clear vault workspace cache.", error);
        return false;
      }
    }

    async function purgeLocalWorkspaceCache() {
      const confirmed = confirm("Clear local workspace cache on this browser? Published workspace will not be changed.");
      if (!confirmed) return;
      const cleared = clearLocalWorkspaceCache();
      if (!cleared) {
        alert("Failed to clear local cache. Browser storage may be blocked.");
        return;
      }

      const publishedWorkspace = await loadPublishedWorkspace();
      if (publishedWorkspace) {
        workspace = publishedWorkspace;
      } else {
        workspace = normalizeWorkspace({
          canvases: [
            {
              id: generateId(),
              name: "Canvas 1",
              items: normalizeItems(fallbackClone(DEFAULT_ITEMS)),
              settings: normalizeSettings(getDefaultSettings())
            }
          ]
        });
      }

      currentCanvasId = workspace.activeCanvasId;
      refreshCanvasSelectors();
      loadCanvasIntoState(workspace.activeCanvasId, true);
      resetHistoryState();
      setSaveStatus("Local cache cleared");
      pushHistory();
    }

    function refreshCanvasSelectors() {
      if (canvasSelect) canvasSelect.innerHTML = "";
      if (publicCanvasSelect) publicCanvasSelect.innerHTML = "";
      for (const entry of workspace.canvases) {
        if (canvasSelect) {
          const activeOption = document.createElement("option");
          activeOption.value = entry.id;
          activeOption.textContent = entry.name;
          canvasSelect.appendChild(activeOption);
        }
        if (publicCanvasSelect) {
          const publicOption = document.createElement("option");
          publicOption.value = entry.id;
          publicOption.textContent = entry.name;
          publicCanvasSelect.appendChild(publicOption);
        }
      }
      if (canvasSelect) canvasSelect.value = workspace.activeCanvasId;
      if (publicCanvasSelect) publicCanvasSelect.value = workspace.publicCanvasId;
    }

    function loadCanvasIntoState(canvasId, rememberAsActive = false) {
      const target = findCanvasById(canvasId) || workspace.canvases[0];
      if (!target) return;
      currentCanvasId = target.id;
      if (rememberAsActive) workspace.activeCanvasId = target.id;
      items = normalizeItems(fallbackClone(target.items || DEFAULT_ITEMS));
      settings = normalizeSettings(target.settings || getDefaultSettings());
      clearSelection();
      applySettings();
      renderCanvas();
      refreshCanvasSelectors();
    }

    function resetHistoryState() {
      history = [];
      historyIndex = -1;
      updateHistoryButtons();
    }

    function setSaveStatus(text) {
      if (!saveStatus) return;
      saveStatus.textContent = text;
    }

    function setPanelCollapsed(panelId, collapsed) {
      const group = sidePanel.querySelector(`.panel-group[data-panel-id="${panelId}"]`);
      const toggle = sidePanel.querySelector(`[data-panel-toggle="${panelId}"]`);
      if (!group || !toggle) return;
      group.classList.toggle("collapsed", collapsed);
      toggle.textContent = collapsed ? "+" : "-";
    }

    function initPanelToggles() {
      for (const button of panelToggleButtons) {
        button.addEventListener("click", () => {
          const panelId = button.dataset.panelToggle;
          if (!panelId) return;
          const group = sidePanel.querySelector(`.panel-group[data-panel-id="${panelId}"]`);
          if (!group) return;
          const collapsed = !group.classList.contains("collapsed");
          setPanelCollapsed(panelId, collapsed);
        });
      }
    }

    function updateLayoutClasses() {
      const dockVisible = Boolean(settings.dockVisible) && isEditMode;
      document.body.classList.toggle("vault-unlocked", isUnlocked);
      document.body.classList.toggle("vault-edit-mode", isUnlocked && isEditMode);
      document.body.classList.toggle("vault-dock-open", isUnlocked && dockVisible);
      const topbarAutoHideEnabled =
        isUnlocked &&
        isEditMode &&
        Boolean(settings.topbarAutoHide) &&
        !document.body.classList.contains("vault-no-toolbar");
      if (!topbarAutoHideEnabled) topbarPeekActive = false;
      document.body.classList.toggle("vault-topbar-autohide", topbarAutoHideEnabled);
      document.body.classList.toggle("vault-topbar-peek", topbarAutoHideEnabled && topbarPeekActive);
    }

    function setTopbarPeekActive(next) {
      const normalized = Boolean(next);
      if (topbarPeekActive === normalized) return;
      topbarPeekActive = normalized;
      updateLayoutClasses();
    }

    function updateDockVisibility() {
      const dockVisible = Boolean(settings.dockVisible);
      sidePanel.style.display = isEditMode && dockVisible ? "flex" : "none";
      toggleDockBtn.textContent = dockVisible ? "Hide Dock" : "Show Dock";
      toggleDockBtn.hidden = !isEditMode;
      if (toggleTopbarBtn) {
        toggleTopbarBtn.hidden = !isEditMode;
        toggleTopbarBtn.textContent = settings.topbarAutoHide ? "Pin Topbar" : "Hide Topbar";
      }
      updateLayoutClasses();
      ensureCanvasHeight();
    }

    function snapshotState() {
      return JSON.stringify({
        items,
        settings,
        publicCanvasId: workspace.publicCanvasId
      });
    }

    function pushHistory() {
      if (isRestoringHistory) return;
      const snapshot = snapshotState();
      if (historyIndex >= 0 && history[historyIndex] === snapshot) return;
      history = history.slice(0, historyIndex + 1);
      history.push(snapshot);
      if (history.length > HISTORY_LIMIT) history.shift();
      historyIndex = history.length - 1;
      updateHistoryButtons();
    }

    function restoreHistorySnapshot(snapshot) {
      try {
        const parsed = JSON.parse(snapshot);
        isRestoringHistory = true;
        items = normalizeItems(parsed.items || []);
        settings = normalizeSettings(parsed.settings || {});
        if (typeof parsed.publicCanvasId === "string" && findCanvasById(parsed.publicCanvasId)) {
          workspace.publicCanvasId = parsed.publicCanvasId;
        }
        syncCurrentCanvasToWorkspace();
        normalizeSelection();
        applySettings();
        saveWorkspace();
        refreshCanvasSelectors();
        renderCanvas();
      } catch {
        // Ignore invalid history state.
      } finally {
        isRestoringHistory = false;
      }
    }

    function undo() {
      if (historyIndex <= 0) return;
      historyIndex -= 1;
      restoreHistorySnapshot(history[historyIndex]);
      updateHistoryButtons();
    }

    function redo() {
      if (historyIndex >= history.length - 1) return;
      historyIndex += 1;
      restoreHistorySnapshot(history[historyIndex]);
      updateHistoryButtons();
    }

    function updateHistoryButtons() {
      if (undoBtn) undoBtn.disabled = !isEditMode || historyIndex <= 0;
      if (redoBtn) redoBtn.disabled = !isEditMode || historyIndex >= history.length - 1;
    }

    function persistAll(push = true) {
      const saved = saveWorkspace();
      setSaveStatus(saved ? "Saved" : "Save failed");
      if (push) pushHistory();
      return saved;
    }

    function applySettings() {
      const siteCursor = getComputedStyle(document.documentElement).getPropertyValue("--site-cursor").trim() || "auto";
      document.documentElement.style.setProperty("--canvas-bg", settings.canvasBg);
      bgColorInput.value = settings.canvasBg;
      canvasWrap.style.zoom = isEditMode ? String(settings.zoom) : "1";
      zoomInput.value = String(Math.round(settings.zoom * 100));
      zoomValue.textContent = `${Math.round(settings.zoom * 100)}%`;
      snapToggle.checked = settings.snapEnabled;
      gridSizeInput.value = String(settings.gridSize);
      guideToggle.checked = settings.showGuides;
      stretchDragToggle.checked = settings.textStretchDrag;
      if (sceneTransitionSelect) sceneTransitionSelect.value = settings.sceneTransition || "none";
      if (sceneTransitionSpeedInput) sceneTransitionSpeedInput.value = String(settings.sceneTransitionSpeed || 0.5);
      canvasWrap.style.setProperty("--scene-speed", `${settings.sceneTransitionSpeed || 0.5}s`);
      if (settings.snapEnabled && isEditMode) {
        const g = settings.gridSize;
        canvasWrap.style.backgroundImage =
          `linear-gradient(transparent ${g - 1}px, rgba(255,255,255,0.08) ${g}px),` +
          `linear-gradient(90deg, transparent ${g - 1}px, rgba(255,255,255,0.08) ${g}px)`;
        canvasWrap.style.backgroundSize = `${g}px ${g}px`;
      } else {
        canvasWrap.style.backgroundImage = "none";
      }
      canvasWrap.style.backgroundColor = settings.canvasBg;
      if (!settings.showGuides) hideGuides();
      if (settings.cursorData) {
        document.body.style.cursor = `url(${settings.cursorData}) 0 0, auto`;
        cursorStatus.textContent = "Cursor: custom";
      } else {
        document.body.style.cursor = siteCursor;
        cursorStatus.textContent = "Cursor: site default";
      }
      refreshStylePresetSelect();
      updateDockVisibility();
    }

    function normalizeItems(list) {
      return list.map((item) => {
        const next = { ...item };
        if (!next.w) next.w = next.type === "image" ? 300 : 260;
        if (!next.h) next.h = next.type === "image" ? 220 : 150;
        if (typeof next.hidden !== "boolean") next.hidden = false;
        if (typeof next.locked !== "boolean") next.locked = false;
        if (!next.name) {
          if (next.type === "image") next.name = "Image";
          else if (next.type === "video") next.name = "Video";
          else if (next.type === "audio") next.name = "Audio";
          else next.name = "Text";
        }
        if (typeof next.linkUrl !== "string") next.linkUrl = "";
        if (next.linkTarget !== "_self") next.linkTarget = "_blank";
        if (!["default", "plain", "button", "highlight"].includes(next.linkDisplay)) next.linkDisplay = "default";
        if (!next.animation) next.animation = "none";
        if (!next.animationSpeed) next.animationSpeed = 6;
        if (!Number.isFinite(next.rotateDeg)) next.rotateDeg = 0;
        if (!["none", "zoom", "tilt", "lift", "gray-pop", "blur-pop"].includes(next.hoverFx)) next.hoverFx = "none";
        if (typeof next.hoverSwapSrc !== "string") next.hoverSwapSrc = "";
        if (!Number.isFinite(next.hoverBlurPx)) next.hoverBlurPx = 2;
        next.hoverBlurPx = clamp(Number(next.hoverBlurPx) || 2, 0, 40);
        if (typeof next.blendMode !== "string" || !next.blendMode.trim()) next.blendMode = "normal";
        if (typeof next.invertMedia !== "boolean") next.invertMedia = false;
        if (!Number.isFinite(next.depthZ)) next.depthZ = 0;
        if (!Number.isFinite(next.shadowSoftness)) next.shadowSoftness = 18;
        if (!["none", "fade-up", "fade-in", "zoom-in", "slide-left", "slide-right"].includes(next.scrollReveal)) {
          next.scrollReveal = "none";
        }
        if (!["x", "y"].includes(next.marqueeAxis)) next.marqueeAxis = "x";
        if (!Number.isFinite(next.marqueeGap)) next.marqueeGap = 40;
        if (next.type === "text") {
          if (!next.fontSize) next.fontSize = 20;
          if (!next.color) next.color = "#f3f3f3";
          if (!next.fontFamily) next.fontFamily = DEFAULT_FONT_FAMILY;
          if (!next.textScaleX) next.textScaleX = 1;
          if (!next.textScaleY) next.textScaleY = 1;
          if (typeof next.blogMode !== "boolean") next.blogMode = false;
        } else if (next.type === "image" || next.type === "video" || next.type === "audio") {
          if (typeof next.src !== "string") next.src = "";
          if (!Array.isArray(next.mediaAnimations)) next.mediaAnimations = [];
          if (next.type !== "audio") {
            if (next.fitMode !== "stretch") next.fitMode = "contain";
          }
        }
        return next;
      });
    }

    function hideGuides() {
      guideX.style.display = "none";
      guideY.style.display = "none";
    }

    function showGuideX(y) {
      if (!settings.showGuides) return;
      guideX.style.top = `${y}px`;
      guideX.style.display = "block";
    }

    function showGuideY(x) {
      if (!settings.showGuides) return;
      guideY.style.left = `${x}px`;
      guideY.style.display = "block";
    }

    function normalizeSelection() {
      const valid = new Set(items.map((entry) => entry.id));
      selectedItemIds = selectedItemIds.filter((id) => valid.has(id));
      if (activeItemId && !valid.has(activeItemId)) activeItemId = null;
      if (activeItemId && !selectedItemIds.includes(activeItemId)) {
        selectedItemIds.push(activeItemId);
      }
      if (!activeItemId && selectedItemIds.length) {
        activeItemId = selectedItemIds[selectedItemIds.length - 1];
      }
    }

    function clearSelection() {
      activeItemId = null;
      selectedItemIds = [];
      activeTextRange = null;
    }

    function isSelected(id) {
      return selectedItemIds.includes(id);
    }

    function setSingleSelection(id) {
      activeItemId = id;
      selectedItemIds = id ? [id] : [];
      activeTextRange = null;
    }

    function toggleSelection(id) {
      if (isSelected(id)) {
        selectedItemIds = selectedItemIds.filter((entry) => entry !== id);
        if (activeItemId === id) activeItemId = selectedItemIds[selectedItemIds.length - 1] || null;
      } else {
        selectedItemIds.push(id);
        activeItemId = id;
      }
      activeTextRange = null;
    }

    function selectRangeTo(id) {
      const order = [...items].reverse().map((entry) => entry.id);
      const anchor = activeItemId || id;
      const a = order.indexOf(anchor);
      const b = order.indexOf(id);
      if (a < 0 || b < 0) {
        setSingleSelection(id);
        return;
      }
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      selectedItemIds = order.slice(min, max + 1);
      activeItemId = id;
      activeTextRange = null;
    }

    function getSelectionIds() {
      if (selectedItemIds.length) return [...selectedItemIds];
      return activeItemId ? [activeItemId] : [];
    }

    function getSelectedItems({ movableOnly = false } = {}) {
      return getSelectionIds()
        .map((id) => getItemById(id))
        .filter((entry) => entry && !entry.hidden && (!movableOnly || !entry.locked));
    }

    function getDockReservedWidth() {
      if (!isUnlocked || !isEditMode || !settings.dockVisible) return 0;
      if (window.innerWidth <= 900) return 0;
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--dock-width");
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 380;
    }

    function getAvailableViewportWidth() {
      return Math.max(320, window.innerWidth - getDockReservedWidth());
    }

    function getCanvasPointerScale() {
      const rect = canvas.getBoundingClientRect();
      const width = canvas.offsetWidth || canvas.clientWidth || 1;
      if (!rect.width || !width) return 1;
      const scale = rect.width / width;
      return Number.isFinite(scale) && scale > 0 ? scale : 1;
    }

    function ensureCanvasHeight() {
      let maxBottom = 0;
      let maxRight = 0;
      for (const item of items) {
        if (item.hidden) continue;
        const widthGuess = item.w || (item.type === "image" ? 320 : 260);
        const heightGuess = item.h || (item.type === "image" ? 240 : 160);
        maxRight = Math.max(maxRight, item.x + widthGuess + 40);
        maxBottom = Math.max(maxBottom, item.y + heightGuess + 40);
      }

      const boundsWidth = Math.max(640, Math.round(maxRight || 640));
      const boundsHeight = Math.max(420, Math.round(maxBottom || 420));
      const availableWidth = getAvailableViewportWidth();

      if (isEditMode) {
        let editMinHeight = window.innerHeight * 1.8;
        editMinHeight = Math.max(editMinHeight, 1600);
        const viewportWidth = Math.max(320, window.innerWidth);
        const viewportScale = clamp(availableWidth / viewportWidth, 0.35, 1);
        const rawHeight = Math.max(boundsHeight, Math.ceil(editMinHeight / viewportScale));
        canvas.style.width = `${boundsWidth}px`;
        canvas.style.height = `${rawHeight}px`;
        canvas.style.transformOrigin = "top left";
        canvas.style.transform = viewportScale < 0.999 ? `scale(${viewportScale})` : "none";
        canvasWrap.style.minHeight = `${Math.max(editMinHeight, Math.ceil(rawHeight * viewportScale))}px`;
        return;
      }

      const viewportWidth = availableWidth;
      let fitScale = viewportWidth / boundsWidth;
      fitScale = clamp(fitScale, 0.25, 1.35);

      const offsetX = Math.max(0, Math.round((viewportWidth - (boundsWidth * fitScale)) / 2));

      canvas.style.width = `${boundsWidth}px`;
      canvas.style.height = `${boundsHeight}px`;
      canvas.style.transformOrigin = "top left";
      canvas.style.transform = `translate(${offsetX}px, 0px) scale(${fitScale})`;
      canvasWrap.style.minHeight = `${Math.ceil(boundsHeight * fitScale)}px`;
    }

    function syncSelectionClasses() {
      const nodes = canvas.querySelectorAll(".canvas-item");
      for (const node of nodes) {
        node.classList.toggle("selected", selectedItemIds.includes(node.dataset.id));
      }
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function getItemById(itemId) {
      return items.find((entry) => entry.id === itemId) || null;
    }

    function getActiveItem() {
      return getItemById(activeItemId);
    }

    function getActiveTextContent() {
      const active = getActiveItem();
      if (!active || active.type !== "text") return null;
      return canvas.querySelector(`.canvas-item[data-id="${active.id}"] .content`);
    }

    function rangeInsideElement(range, element) {
      return element.contains(range.startContainer) && element.contains(range.endContainer);
    }

    function captureActiveTextRange() {
      const content = getActiveTextContent();
      if (!content) {
        activeTextRange = null;
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (!rangeInsideElement(range, content)) return;
      activeTextRange = range.cloneRange();
    }

    function restoreActiveTextRange() {
      const content = getActiveTextContent();
      if (!content) return false;
      const selection = window.getSelection();
      if (!selection) return false;
      if (selection.rangeCount > 0) {
        const current = selection.getRangeAt(0);
        if (rangeInsideElement(current, content)) {
          activeTextRange = current.cloneRange();
          return true;
        }
      }
      content.focus();
      if (activeTextRange && rangeInsideElement(activeTextRange, content)) {
        selection.removeAllRanges();
        selection.addRange(activeTextRange);
        return true;
      }
      return false;
    }

    function syncActiveTextToModel() {
      const item = getActiveItem();
      const content = getActiveTextContent();
      if (!item || !content) return;
      item.text = content.innerHTML;
      persistAll(false);
    }

    function syncTextNodesToModel() {
      const nodes = canvas.querySelectorAll(".canvas-item.text .content");
      for (const content of nodes) {
        const owner = content.closest(".canvas-item");
        if (!owner || !owner.dataset.id) continue;
        const item = getItemById(owner.dataset.id);
        if (!item || item.type !== "text") continue;
        item.text = content.innerHTML;
      }
    }

    function applyTextCommand(command) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      restoreActiveTextRange();
      document.execCommand(command, false);
      captureActiveTextRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyFormatBlock(tagName) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      restoreActiveTextRange();
      document.execCommand("formatBlock", false, tagName);
      captureActiveTextRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyTextJustify(command) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      restoreActiveTextRange();
      document.execCommand(command, false);
      captureActiveTextRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyFontSizeToSelection(px) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      const nextPx = clamp(px, 8, 300);
      if (!restoreActiveTextRange()) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed || !rangeInsideElement(range, content)) return;

      const span = document.createElement("span");
      span.style.fontSize = `${nextPx}px`;
      try {
        range.surroundContents(span);
      } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      activeTextRange = newRange.cloneRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyFontSizeToBox(px) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.fontSize = clamp(px, 8, 300);
      }
      persistAll(true);
      renderCanvas();
    }

    function applyColorToSelection(color) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      if (!restoreActiveTextRange()) return;
      document.execCommand("foreColor", false, color);
      captureActiveTextRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyColorToBox(color) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      for (const item of selected) item.color = color;
      persistAll(true);
      renderCanvas();
    }

    function applyFontFamilyToSelection(fontFamily) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      const family = String(fontFamily || "").trim() || DEFAULT_FONT_FAMILY;
      if (!restoreActiveTextRange()) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed || !rangeInsideElement(range, content)) return;

      const span = document.createElement("span");
      span.style.fontFamily = family;
      try {
        range.surroundContents(span);
      } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      activeTextRange = newRange.cloneRange();
      syncActiveTextToModel();
      pushHistory();
    }

    function applyFontFamilyToBox(fontFamily) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      const family = String(fontFamily || "").trim() || DEFAULT_FONT_FAMILY;
      for (const item of selected) item.fontFamily = family;
      persistAll(true);
      renderCanvas();
    }

    function normalizeUrl(raw) {
      const value = String(raw || "").trim();
      if (!value) return "";
      if (/^javascript:/i.test(value)) return "";
      if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value)) return value;
      return `https://${value}`;
    }

    function applyLinkPresentation(anchor, displayMode) {
      anchor.classList.add("vault-link");
      anchor.style.textDecoration = "";
      anchor.style.background = "";
      anchor.style.border = "";
      anchor.style.borderRadius = "";
      anchor.style.padding = "";
      anchor.style.display = "";
      anchor.style.color = "";
      if (displayMode === "plain") {
        anchor.style.textDecoration = "none";
      } else if (displayMode === "button") {
        anchor.style.textDecoration = "none";
        anchor.style.display = "inline-block";
        anchor.style.padding = "0.1em 0.55em";
        anchor.style.border = "1px solid currentColor";
        anchor.style.borderRadius = "999px";
        anchor.style.background = "rgba(255,255,255,0.08)";
      } else if (displayMode === "highlight") {
        anchor.style.textDecoration = "none";
        anchor.style.padding = "0.02em 0.26em";
        anchor.style.borderRadius = "0.18em";
        anchor.style.background = "rgba(255,255,255,0.18)";
      }
      anchor.dataset.linkDisplay = displayMode;
    }

    function addOrUpdateTextLink(urlRaw, labelRaw, displayMode, targetMode) {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      const url = normalizeUrl(urlRaw);
      if (!url) {
        alert("Enter a valid link URL.");
        return;
      }

      if (!restoreActiveTextRange()) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (!rangeInsideElement(range, content)) return;

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = targetMode === "_self" ? "_self" : "_blank";
      anchor.rel = "noopener noreferrer";
      applyLinkPresentation(anchor, displayMode);

      const label = String(labelRaw || "").trim();
      if (!range.collapsed) {
        try {
          const fragment = range.extractContents();
          anchor.appendChild(fragment);
        } catch {
          anchor.textContent = label || selection.toString() || url;
        }
        if (!anchor.textContent.trim()) {
          anchor.textContent = label || url;
        }
        range.insertNode(anchor);
      } else {
        anchor.textContent = label || url;
        range.insertNode(anchor);
      }

      const newRange = document.createRange();
      newRange.selectNodeContents(anchor);
      selection.removeAllRanges();
      selection.addRange(newRange);
      activeTextRange = newRange.cloneRange();
      active.linkTarget = anchor.target;
      active.linkDisplay = ["default", "plain", "button", "highlight"].includes(displayMode) ? displayMode : "default";
      syncActiveTextToModel();
      pushHistory();
    }

    function removeLinkFromSelection() {
      const content = getActiveTextContent();
      const active = getActiveItem();
      if (!content || !isEditMode || !active || active.locked) return;
      if (!restoreActiveTextRange()) return;
      document.execCommand("unlink", false);
      captureActiveTextRange();
      active.linkTarget = "_blank";
      active.linkDisplay = "default";
      syncActiveTextToModel();
      pushHistory();
    }

    function attachLinkToSelection(urlRaw, targetMode, displayMode) {
      const url = normalizeUrl(urlRaw);
      if (!url) {
        alert("Enter a valid link URL.");
        return;
      }
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.linkUrl = url;
        item.linkTarget = targetMode === "_self" ? "_self" : "_blank";
        item.linkDisplay = ["default", "plain", "button", "highlight"].includes(displayMode) ? displayMode : "default";
      }
      persistAll(true);
      renderCanvas();
    }

    function attachLinkToTextSelection(urlRaw, targetMode, displayMode) {
      const url = normalizeUrl(urlRaw);
      if (!url) {
        alert("Enter a valid link URL.");
        return;
      }
      const selected = getSelectionIds()
        .map((id) => getItemById(id))
        .filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.linkUrl = url;
        item.linkTarget = targetMode === "_self" ? "_self" : "_blank";
        item.linkDisplay = ["default", "plain", "button", "highlight"].includes(displayMode) ? displayMode : "default";
      }
      persistAll(true);
      renderCanvas();
    }

    function clearLinkFromSelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.linkUrl = "";
        item.linkTarget = "_blank";
        item.linkDisplay = "default";
      }
      persistAll(true);
      renderCanvas();
    }

    function applyAnimationToBox(animationName, speed) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && (item.type === "text" || item.type === "image" || item.type === "video" || item.type === "audio") && !item.locked
      );
      if (!selected.length) return;
      for (const item of selected) {
        if (item.type === "image" || item.type === "video" || item.type === "audio") {
          if (!Array.isArray(item.mediaAnimations)) item.mediaAnimations = [];
          if (animationName === "none") {
            item.mediaAnimations = [];
            item.animation = "none";
          } else {
            if (!item.mediaAnimations.includes(animationName)) item.mediaAnimations.push(animationName);
            item.animation = item.mediaAnimations[item.mediaAnimations.length - 1] || animationName;
          }
        } else {
          item.animation = animationName;
        }
        item.animationSpeed = clamp(speed, 0.2, 30);
      }
      persistAll(true);
      renderCanvas();
    }

    function applyTextStretchToBox(xScale, yScale) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      const sx = clamp(Number(xScale) || 1, 0.2, 5);
      const sy = clamp(Number(yScale) || 1, 0.2, 5);
      for (const item of selected) {
        item.textScaleX = sx;
        item.textScaleY = sy;
      }
      persistAll(true);
      renderCanvas();
    }

    function applyMediaFitToSelection(mode) {
      const fit = mode === "stretch" ? "stretch" : "contain";
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && (item.type === "image" || item.type === "video") && !item.locked
      );
      if (!selected.length) return;
      for (const item of selected) item.fitMode = fit;
      persistAll(true);
      renderCanvas();
    }

    function toggleMediaFitSelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && (item.type === "image" || item.type === "video") && !item.locked
      );
      if (!selected.length) return;
      const next = selected[0].fitMode === "stretch" ? "contain" : "stretch";
      for (const item of selected) item.fitMode = next;
      mediaFitSelect.value = next;
      persistAll(true);
      renderCanvas();
    }

    function duplicateSelection() {
      const selected = getSelectionIds();
      if (!selected.length) return;
      const clones = [];
      for (const id of selected) {
        const item = getItemById(id);
        if (!item) continue;
        const copy = fallbackClone(item);
        copy.id = generateId();
        copy.x += 24;
        copy.y += 24;
        copy.hidden = false;
        copy.locked = false;
        copy.name = `${item.name || item.type} copy`;
        clones.push(copy);
      }
      if (!clones.length) return;
      items.push(...clones);
      selectedItemIds = clones.map((entry) => entry.id);
      activeItemId = selectedItemIds[selectedItemIds.length - 1];
      persistAll(true);
      renderCanvas();
    }

    function deleteSelection() {
      const selected = getSelectionIds();
      if (!selected.length) return;
      const idSet = new Set(selected);
      items = items.filter((entry) => !idSet.has(entry.id));
      clearSelection();
      persistAll(true);
      renderCanvas();
    }

    function renameActiveLayer() {
      const active = getActiveItem();
      if (!active) return;
      const next = prompt("Layer name", active.name || "");
      if (next === null) return;
      const trimmed = next.trim();
      if (!trimmed) return;
      active.name = trimmed;
      persistAll(true);
      renderLayerList();
    }

    function toggleLockSelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter(Boolean);
      if (!selected.length) return;
      const shouldLock = selected.some((entry) => !entry.locked);
      for (const item of selected) item.locked = shouldLock;
      persistAll(true);
      renderCanvas();
    }

    function toggleVisibilitySelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter(Boolean);
      if (!selected.length) return;
      const shouldHide = selected.some((entry) => !entry.hidden);
      for (const item of selected) item.hidden = shouldHide;
      normalizeSelection();
      persistAll(true);
      renderCanvas();
    }

    function getBounds(sourceItems) {
      if (!sourceItems.length) return null;
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;
      for (const item of sourceItems) {
        left = Math.min(left, item.x);
        top = Math.min(top, item.y);
        right = Math.max(right, item.x + item.w);
        bottom = Math.max(bottom, item.y + item.h);
      }
      return { left, top, right, bottom, width: right - left, height: bottom - top };
    }

    function alignSelection(mode) {
      const selected = getSelectedItems({ movableOnly: true });
      if (selected.length < 2) return;
      const bounds = getBounds(selected);
      if (!bounds) return;
      for (const item of selected) {
        if (mode === "left") item.x = bounds.left;
        if (mode === "center") item.x = Math.round(bounds.left + (bounds.width / 2) - (item.w / 2));
        if (mode === "right") item.x = Math.round(bounds.right - item.w);
        if (mode === "top") item.y = bounds.top;
        if (mode === "middle") item.y = Math.round(bounds.top + (bounds.height / 2) - (item.h / 2));
        if (mode === "bottom") item.y = Math.round(bounds.bottom - item.h);
      }
      persistAll(true);
      renderCanvas();
    }

    function distributeSelection(axis) {
      const selected = getSelectedItems({ movableOnly: true });
      if (selected.length < 3) return;
      const sorted = [...selected].sort((a, b) => axis === "x" ? a.x - b.x : a.y - b.y);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const total = axis === "x" ? (last.x - first.x) : (last.y - first.y);
      const step = total / (sorted.length - 1);
      for (let i = 1; i < sorted.length - 1; i += 1) {
        const item = sorted[i];
        if (axis === "x") item.x = Math.round(first.x + (step * i));
        if (axis === "y") item.y = Math.round(first.y + (step * i));
      }
      persistAll(true);
      renderCanvas();
    }

    function nudgeSelection(dx, dy) {
      const selected = getSelectedItems({ movableOnly: true });
      if (!selected.length) return;
      for (const item of selected) {
        item.x = Math.max(0, item.x + dx);
        item.y = Math.max(0, item.y + dy);
      }
      persistAll(true);
      renderCanvas();
    }

    function getCreativeSelection() {
      return getSelectedItems({ movableOnly: true }).filter((item) => item && !item.hidden && !item.locked);
    }

    function randomBetween(min, max) {
      return min + (Math.random() * (max - min));
    }

    function styleSnapshotFromItem(item) {
      return {
        fontSize: item.fontSize,
        color: item.color,
        fontFamily: item.fontFamily,
        textScaleX: item.textScaleX,
        textScaleY: item.textScaleY,
        animation: item.animation,
        animationSpeed: item.animationSpeed,
        mediaAnimations: Array.isArray(item.mediaAnimations) ? [...item.mediaAnimations] : [],
        fitMode: item.fitMode,
        hoverFx: item.hoverFx,
        hoverBlurPx: item.hoverBlurPx,
        invertMedia: item.invertMedia,
        blendMode: item.blendMode,
        depthZ: item.depthZ,
        shadowSoftness: item.shadowSoftness,
        scrollReveal: item.scrollReveal
      };
    }

    function applyStyleSnapshotToItem(item, snapshot) {
      if (!item || !snapshot) return;
      if (item.type === "text") {
        if (Number.isFinite(snapshot.fontSize)) item.fontSize = snapshot.fontSize;
        if (typeof snapshot.color === "string") item.color = snapshot.color;
        if (typeof snapshot.fontFamily === "string") item.fontFamily = snapshot.fontFamily;
        if (Number.isFinite(snapshot.textScaleX)) item.textScaleX = snapshot.textScaleX;
        if (Number.isFinite(snapshot.textScaleY)) item.textScaleY = snapshot.textScaleY;
      }
      if (item.type === "image" || item.type === "video" || item.type === "audio") {
        if (typeof snapshot.fitMode === "string") item.fitMode = snapshot.fitMode === "stretch" ? "stretch" : "contain";
        if (Array.isArray(snapshot.mediaAnimations)) item.mediaAnimations = [...snapshot.mediaAnimations];
        if (typeof snapshot.invertMedia === "boolean") item.invertMedia = snapshot.invertMedia;
      }
      if (typeof snapshot.animation === "string") item.animation = snapshot.animation;
      if (Number.isFinite(snapshot.animationSpeed)) item.animationSpeed = clamp(snapshot.animationSpeed, 0.2, 30);
      if (typeof snapshot.hoverFx === "string") item.hoverFx = snapshot.hoverFx;
      if (Number.isFinite(snapshot.hoverBlurPx)) item.hoverBlurPx = clamp(snapshot.hoverBlurPx, 0, 40);
      if (typeof snapshot.blendMode === "string") item.blendMode = snapshot.blendMode;
      if (Number.isFinite(snapshot.depthZ)) item.depthZ = snapshot.depthZ;
      if (Number.isFinite(snapshot.shadowSoftness)) item.shadowSoftness = snapshot.shadowSoftness;
      if (typeof snapshot.scrollReveal === "string") item.scrollReveal = snapshot.scrollReveal;
    }

    function refreshStylePresetSelect() {
      if (!stylePresetSelect) return;
      const activeValue = stylePresetSelect.value;
      stylePresetSelect.innerHTML = "";
      const list = Array.isArray(settings.stylePresets) ? settings.stylePresets : [];
      if (!list.length) {
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "No presets";
        stylePresetSelect.appendChild(empty);
        stylePresetSelect.value = "";
        return;
      }
      for (const preset of list) {
        const option = document.createElement("option");
        option.value = preset.id || "";
        option.textContent = preset.name || "Preset";
        stylePresetSelect.appendChild(option);
      }
      const hasActive = list.some((preset) => preset.id === activeValue);
      stylePresetSelect.value = hasActive ? activeValue : (list[0].id || "");
    }

    function applySmartLayoutToSelection(layout, gap) {
      const selected = getCreativeSelection();
      if (selected.length < 2) return;
      const bounds = getBounds(selected);
      if (!bounds) return;
      const safeGap = clamp(Number(gap) || 0, 0, 240);
      const ordered = [...selected].sort((a, b) => (a.y - b.y) || (a.x - b.x));

      if (layout === "columns") {
        const columns = clamp(Number(slideColumnsInput && slideColumnsInput.value) || 3, 1, 12);
        arrangeSelectionInColumns(ordered, columns, safeGap, false);
        persistAll(true);
        renderCanvas();
        return;
      }

      if (layout === "hero-strip" && ordered.length >= 2) {
        const hero = getActiveItem() && ordered.includes(getActiveItem()) ? getActiveItem() : ordered[0];
        const others = ordered.filter((item) => item.id !== hero.id);
        const heroW = Math.max(240, Math.round(bounds.width * 0.62));
        const heroH = Math.max(180, Math.round(bounds.height * 0.62));
        hero.x = Math.round(bounds.left);
        hero.y = Math.round(bounds.top);
        hero.w = heroW;
        hero.h = heroH;
        let cursorX = bounds.left;
        const stripY = hero.y + hero.h + safeGap;
        for (const item of others) {
          item.x = Math.round(cursorX);
          item.y = Math.round(stripY);
          cursorX += item.w + safeGap;
        }
        persistAll(true);
        renderCanvas();
        return;
      }

      if (layout === "mosaic") {
        const columns = Math.max(2, Math.round(Math.sqrt(ordered.length)));
        const cellW = Math.max(60, Math.round((bounds.width - (safeGap * (columns - 1))) / columns));
        const cellH = Math.max(60, Math.round((bounds.height - (safeGap * (columns - 1))) / columns));
        for (let i = 0; i < ordered.length; i += 1) {
          const item = ordered[i];
          const col = i % columns;
          const row = Math.floor(i / columns);
          item.x = Math.round(bounds.left + (col * (cellW + safeGap)));
          item.y = Math.round(bounds.top + (row * (cellH + safeGap)));
          if (item.type !== "audio") {
            item.w = Math.max(36, Math.round(cellW * randomBetween(0.86, 1.15)));
            item.h = Math.max(36, Math.round(cellH * randomBetween(0.86, 1.15)));
          }
        }
        persistAll(true);
        renderCanvas();
        return;
      }

      const columns = Math.max(1, Math.ceil(Math.sqrt(ordered.length)));
      const cellW = Math.max(...ordered.map((item) => item.w));
      const cellH = Math.max(...ordered.map((item) => item.h));
      for (let i = 0; i < ordered.length; i += 1) {
        const item = ordered[i];
        const row = Math.floor(i / columns);
        const col = i % columns;
        item.x = Math.round(bounds.left + (col * (cellW + safeGap)));
        item.y = Math.round(bounds.top + (row * (cellH + safeGap)));
      }
      persistAll(true);
      renderCanvas();
    }

    function arrangeSelectionInColumns(selected, columnCount, gap, balanced) {
      if (!selected.length) return;
      const columns = clamp(Number(columnCount) || 1, 1, 12);
      const safeGap = clamp(Number(gap) || 0, 0, 240);
      const bounds = getBounds(selected);
      if (!bounds) return;
      const columnHeights = new Array(columns).fill(0);
      const columnX = new Array(columns).fill(0).map((_, index) => bounds.left + (index * (Math.max(100, Math.round(bounds.width / columns)) + safeGap)));
      const ordered = balanced
        ? [...selected].sort((a, b) => b.h - a.h)
        : [...selected].sort((a, b) => (a.y - b.y) || (a.x - b.x));
      for (let i = 0; i < ordered.length; i += 1) {
        const item = ordered[i];
        const targetColumn = balanced
          ? columnHeights.indexOf(Math.min(...columnHeights))
          : (i % columns);
        item.x = Math.round(columnX[targetColumn]);
        item.y = Math.round(bounds.top + columnHeights[targetColumn]);
        columnHeights[targetColumn] += item.h + safeGap;
      }
    }

    function applyClumpToSelection(explode = false) {
      const selected = getCreativeSelection();
      if (selected.length < 2) return;
      const bounds = getBounds(selected);
      if (!bounds) return;
      const force = clamp(Number(clumpStrengthInput && clumpStrengthInput.value) || 36, 0, 200);
      const spread = clamp(Number(clumpSpreadInput && clumpSpreadInput.value) || 220, 0, 800);
      const centerX = bounds.left + (bounds.width / 2);
      const centerY = bounds.top + (bounds.height / 2);
      const direction = explode ? 1 : -1;
      for (const item of selected) {
        const angle = randomBetween(0, Math.PI * 2);
        const distance = randomBetween(force * 0.5, Math.max(force, spread * 0.5));
        const targetX = centerX + (Math.cos(angle) * distance * direction);
        const targetY = centerY + (Math.sin(angle) * distance * direction);
        item.x = Math.max(0, Math.round(targetX - (item.w / 2)));
        item.y = Math.max(0, Math.round(targetY - (item.h / 2)));
      }
      persistAll(true);
      renderCanvas();
    }

    function randomizeSelectionLayout() {
      const selected = getCreativeSelection();
      if (!selected.length) return;
      const bounds = getBounds(selected);
      if (!bounds) return;
      const jitter = Math.max(24, Math.round((bounds.width + bounds.height) / 10));
      for (const item of selected) {
        item.x = Math.max(0, Math.round(item.x + randomBetween(-jitter, jitter)));
        item.y = Math.max(0, Math.round(item.y + randomBetween(-jitter, jitter)));
        if (item.type !== "audio") {
          item.rotateDeg = Math.round(clamp((Number(item.rotateDeg) || 0) + randomBetween(-14, 14), -180, 180));
        }
      }
      persistAll(true);
      renderCanvas();
    }

    function inspireSelection() {
      const selected = getCreativeSelection();
      if (!selected.length) return;
      const layouts = ["grid", "columns", "mosaic", "hero-strip"];
      applySmartLayoutToSelection(layouts[Math.floor(Math.random() * layouts.length)], Number(layoutGapInput && layoutGapInput.value) || 26);
      const hoverModes = ["none", "zoom", "tilt", "lift", "gray-pop", "blur-pop"];
      const blendModes = ["normal", "multiply", "screen", "overlay", "soft-light", "difference"];
      for (const item of selected) {
        item.hoverFx = hoverModes[Math.floor(Math.random() * hoverModes.length)];
        item.blendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
        item.depthZ = Math.round(randomBetween(-10, 36));
      }
      persistAll(true);
      renderCanvas();
    }

    function applyHoverFxToSelection(mode) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && !item.locked && (item.type === "image" || item.type === "video"));
      if (!selected.length) return;
      for (const item of selected) item.hoverFx = mode;
      persistAll(true);
      renderCanvas();
    }

    function applyHoverBlurStrengthToSelection(px) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && !item.locked && (item.type === "image" || item.type === "video"));
      if (!selected.length) return;
      const strength = clamp(Number(px) || 2, 0, 40);
      for (const item of selected) item.hoverBlurPx = strength;
      persistAll(true);
      renderCanvas();
    }

    function applyHoverSwapToSelection(dataUrl) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && !item.locked && item.type === "image");
      if (!selected.length) return;
      for (const item of selected) item.hoverSwapSrc = dataUrl;
      persistAll(true);
      renderCanvas();
    }

    function clearHoverSwapFromSelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && !item.locked && item.type === "image");
      if (!selected.length) return;
      for (const item of selected) item.hoverSwapSrc = "";
      persistAll(true);
      renderCanvas();
    }

    function applyBlendModeToSelection(mode) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      for (const item of selected) item.blendMode = mode;
      persistAll(true);
      renderCanvas();
    }

    function applyImageInvertToSelection(enabled) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) =>
        item && !item.locked && item.type === "image");
      if (!selected.length) return;
      for (const item of selected) item.invertMedia = Boolean(enabled);
      persistAll(true);
      renderCanvas();
    }

    function applyDepthToSelection(depth, softness) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      const nextDepth = clamp(Number(depth) || 0, -60, 120);
      const nextSoftness = clamp(Number(softness) || 18, 0, 80);
      for (const item of selected) {
        item.depthZ = nextDepth;
        item.shadowSoftness = nextSoftness;
      }
      persistAll(true);
      renderCanvas();
    }

    function applyScrollRevealToSelection(mode) {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      for (const item of selected) item.scrollReveal = mode;
      persistAll(true);
      renderCanvas();
    }

    function buildMarqueeStrip(axis, gap) {
      const selected = getCreativeSelection();
      if (!selected.length) return;
      const ordered = [...selected].sort((a, b) => (axis === "y" ? a.y - b.y : a.x - b.x));
      const bounds = getBounds(ordered);
      if (!bounds) return;
      const safeGap = clamp(Number(gap) || 0, 0, 420);
      let cursor = axis === "y" ? bounds.top : bounds.left;
      for (const item of ordered) {
        if (axis === "y") {
          item.y = Math.round(cursor);
          item.x = bounds.left;
          cursor += item.h + safeGap;
        } else {
          item.x = Math.round(cursor);
          item.y = bounds.top;
          cursor += item.w + safeGap;
        }
        item.marqueeAxis = axis;
        item.marqueeGap = safeGap;
        if (item.type === "text") {
          item.animation = axis === "x" ? "marquee-left" : "wave";
        } else if (item.type === "image" || item.type === "video" || item.type === "audio") {
          const motionName = axis === "x" ? "drift-x" : "drift-y";
          if (!Array.isArray(item.mediaAnimations)) item.mediaAnimations = [];
          if (!item.mediaAnimations.includes(motionName)) item.mediaAnimations.push(motionName);
          item.animation = motionName;
        }
      }
      persistAll(true);
      renderCanvas();
    }

    function clearMarqueeStripFromSelection() {
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.marqueeAxis = "x";
        item.marqueeGap = 40;
        if (item.type === "text" && (item.animation === "marquee-left" || item.animation === "marquee-right")) {
          item.animation = "none";
        }
        if (Array.isArray(item.mediaAnimations)) {
          item.mediaAnimations = item.mediaAnimations.filter((name) => name !== "drift-x" && name !== "drift-y");
        }
      }
      persistAll(true);
      renderCanvas();
    }

    function saveStylePresetFromSelection() {
      const active = getActiveItem();
      if (!active) return;
      const name = (stylePresetNameInput && stylePresetNameInput.value ? stylePresetNameInput.value.trim() : "") || `Preset ${Date.now().toString(36)}`;
      const list = Array.isArray(settings.stylePresets) ? settings.stylePresets : [];
      list.push({
        id: generateId(),
        name: name.slice(0, 60),
        style: styleSnapshotFromItem(active)
      });
      settings.stylePresets = list.slice(-80);
      if (stylePresetNameInput) stylePresetNameInput.value = "";
      refreshStylePresetSelect();
      persistAll(true);
    }

    function applySelectedStylePreset() {
      if (!stylePresetSelect) return;
      const list = Array.isArray(settings.stylePresets) ? settings.stylePresets : [];
      const selectedPreset = list.find((entry) => entry.id === stylePresetSelect.value);
      if (!selectedPreset || !selectedPreset.style) return;
      const targets = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && !item.locked);
      if (!targets.length) return;
      for (const item of targets) applyStyleSnapshotToItem(item, selectedPreset.style);
      persistAll(true);
      renderCanvas();
    }

    function deleteSelectedStylePreset() {
      if (!stylePresetSelect) return;
      const id = stylePresetSelect.value;
      if (!id) return;
      const list = Array.isArray(settings.stylePresets) ? settings.stylePresets : [];
      settings.stylePresets = list.filter((entry) => entry.id !== id);
      refreshStylePresetSelect();
      persistAll(true);
    }

    function playSceneTransition() {
      const classes = [
        "scene-transition-fade",
        "scene-transition-slide-left",
        "scene-transition-slide-right",
        "scene-transition-zoom"
      ];
      canvasWrap.classList.remove(...classes);
      const mode = settings.sceneTransition || "none";
      if (mode === "none") return;
      const cls = `scene-transition-${mode}`;
      const speed = clamp(Number(settings.sceneTransitionSpeed) || 0.5, 0.1, 4);
      canvasWrap.style.setProperty("--scene-speed", `${speed}s`);
      void canvasWrap.offsetWidth;
      canvasWrap.classList.add(cls);
      window.setTimeout(() => {
        canvasWrap.classList.remove(cls);
      }, Math.ceil((speed * 1000) + 80));
    }

    function refreshRevealObserver() {
      if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
      }
      if (isEditMode) return;
      const targets = Array.from(canvas.querySelectorAll(".canvas-item.reveal-ready"));
      if (!targets.length) return;
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          if (revealObserver) revealObserver.unobserve(entry.target);
        }
      }, {
        root: null,
        threshold: 0.15
      });
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.82) {
          target.classList.add("revealed");
          continue;
        }
        revealObserver.observe(target);
      }
    }

    function isTypingTarget(target) {
      if (!target) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.closest(".content")) return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function exportJson() {
      const payload = {
        version: 2,
        exportedAt: new Date().toISOString(),
        items,
        settings
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vault-scene.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function setPublishButtonState() {
      if (!publishBtn) return;
      publishBtn.disabled = !isEditMode || isPublishingGithub;
      publishBtn.textContent = isPublishingGithub ? "Publishing..." : "Publish";
    }

    async function publishWorkspaceToGithub() {
      if (isPublishingGithub) return;
      const publishPassword = lastVerifiedEditPassword || (prompt("Enter edit password to publish", "") || "").trim();
      if (!publishPassword) return;
      const message = (
        prompt("Commit message", `Publish vault workspace ${new Date().toISOString()}`) ||
        ""
      ).trim() || `Publish vault workspace ${new Date().toISOString()}`;

      syncCurrentCanvasToWorkspace();

      isPublishingGithub = true;
      setPublishButtonState();
      setSaveStatus("Publishing...");
      try {
        const publishPayload = {
          editPassword: publishPassword,
          message,
          workspace
        };
        const payloadBytes = estimateJsonBytes(publishPayload);
        if (payloadBytes > PUBLISH_MAX_BYTES) {
          throw new Error(
            `Workspace payload is too large (${formatBytes(payloadBytes)}). ` +
            `Current publish limit is ${formatBytes(PUBLISH_MAX_BYTES)}; reduce embedded media size and try again.`
          );
        }
        const response = await postJsonWithRetry(apiUrl("/api/publish/github"), publishPayload, {
          attempts: 3,
          timeoutMs: 45000,
          retryDelayMs: 900
        });
        if (!response.ok) {
          const body = await response.text();
          let detail = body || "unknown error";
          try {
            const parsed = body ? JSON.parse(body) : null;
            if (parsed && typeof parsed.error === "string" && parsed.error.trim()) {
              detail = parsed.error.trim();
            }
          } catch {
            // Keep raw body text.
          }
          throw new Error(`GitHub publish failed (${response.status}): ${detail}`);
        }
        const data = await response.json();
        if (!data || !data.ok) {
          throw new Error("GitHub publish failed.");
        }
        lastVerifiedEditPassword = publishPassword;
        setSaveStatus("Published");
        alert(`Published to ${data.owner}/${data.repo}:${data.branch} (${data.path})`);
      } catch (error) {
        console.error(error);
        setSaveStatus("Publish failed");
        const rawMessage = String(error && error.message ? error.message : error || "Unknown error");
        const fetchLikeError = /NetworkError|Failed to fetch|Load failed|fetch resource/i.test(rawMessage);
        const timeoutError = error && error.name === "AbortError";
        const friendlyMessage = (fetchLikeError || timeoutError)
          ? "Network request to publish API failed or timed out. Please retry; if it keeps happening, publish a smaller workspace (especially media)."
          : rawMessage;
        alert(`Publish failed: ${friendlyMessage}`);
      } finally {
        isPublishingGithub = false;
        setPublishButtonState();
      }
    }

    function importJson(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const importedItems = Array.isArray(parsed.items) ? parsed.items : (Array.isArray(parsed) ? parsed : null);
          if (!importedItems) throw new Error("Invalid");
          items = normalizeItems(importedItems);
          if (parsed.settings) settings = normalizeSettings({ ...settings, ...parsed.settings });
          clearSelection();
          applySettings();
          persistAll(true);
          renderCanvas();
        } catch {
          alert("Import failed. Please use a valid JSON scene file.");
        }
      };
      reader.readAsText(file);
    }

    function createNewCanvas() {
      const suggested = `Canvas ${workspace.canvases.length + 1}`;
      const raw = prompt("New canvas name", suggested);
      if (raw === null) return;
      const name = raw.trim() || suggested;
      syncCurrentCanvasToWorkspace();
      const next = {
        id: generateId(),
        name,
        items: normalizeItems(fallbackClone(DEFAULT_ITEMS)),
        settings: normalizeSettings(getDefaultSettings())
      };
      workspace.canvases.push(next);
      workspace.activeCanvasId = next.id;
      workspace.publicCanvasId = next.id;
      const saved = saveWorkspace();
      loadCanvasIntoState(next.id, true);
      playSceneTransition();
      resetHistoryState();
      pushHistory();
      setSaveStatus(saved ? "Saved" : "Save failed");
    }

    function switchActiveCanvas(nextCanvasId) {
      if (!nextCanvasId || nextCanvasId === currentCanvasId) {
        refreshCanvasSelectors();
        return;
      }
      if (!findCanvasById(nextCanvasId)) return;
      syncCurrentCanvasToWorkspace();
      workspace.activeCanvasId = nextCanvasId;
      workspace.publicCanvasId = nextCanvasId;
      const saved = saveWorkspace();
      loadCanvasIntoState(nextCanvasId, true);
      playSceneTransition();
      resetHistoryState();
      pushHistory();
      setSaveStatus(saved ? "Saved" : "Save failed");
    }

    function setPublicCanvas(nextCanvasId) {
      if (!nextCanvasId || !findCanvasById(nextCanvasId)) return;
      workspace.publicCanvasId = nextCanvasId;
      const saved = saveWorkspace();
      refreshCanvasSelectors();
      setSaveStatus(saved ? "Saved" : "Save failed");
      if (!isUnlocked) {
        loadCanvasIntoState(workspace.publicCanvasId, false);
      }
    }

    function getLayerLabel(item, index) {
      if (item.name) return item.name;
      if (item.type === "image") return `Image ${index + 1}`;
      if (item.type === "video") return `Video ${index + 1}`;
      if (item.type === "audio") return `Audio ${index + 1}`;
      const temp = document.createElement("div");
      temp.innerHTML = item.text || "";
      const plain = (temp.textContent || "Text").trim().replace(/\s+/g, " ");
      return plain ? `Text ${index + 1}: ${plain.slice(0, 28)}` : `Text ${index + 1}`;
    }

    function renderLayerList() {
      layerList.innerHTML = "";
      for (let i = items.length - 1; i >= 0; i -= 1) {
        const item = items[i];
        const row = document.createElement("li");
        row.dataset.id = item.id;
        row.draggable = true;
        if (isSelected(item.id)) row.classList.add("active");

        const inner = document.createElement("div");
        inner.className = "layer-row";

        const label = document.createElement("span");
        label.className = "layer-label";
        label.textContent = getLayerLabel(item, i);
        label.title = label.textContent;

        const visBtn = document.createElement("button");
        visBtn.type = "button";
        visBtn.className = "layer-pill";
        visBtn.draggable = false;
        visBtn.textContent = item.hidden ? "Hid" : "Vis";
        visBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          item.hidden = !item.hidden;
          normalizeSelection();
          persistAll(true);
          renderCanvas();
        });

        const lockBtn = document.createElement("button");
        lockBtn.type = "button";
        lockBtn.className = "layer-pill";
        lockBtn.draggable = false;
        lockBtn.textContent = item.locked ? "Lock" : "Open";
        lockBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          item.locked = !item.locked;
          persistAll(true);
          renderCanvas();
        });

        inner.appendChild(label);
        inner.appendChild(visBtn);
        inner.appendChild(lockBtn);
        row.appendChild(inner);

        row.addEventListener("click", (event) => {
          const isToggle = event.ctrlKey || event.metaKey;
          if (event.shiftKey) {
            selectRangeTo(item.id);
          } else if (isToggle) {
            toggleSelection(item.id);
          } else {
            setSingleSelection(item.id);
          }
          renderCanvas();
        });

        label.addEventListener("dblclick", (event) => {
          event.stopPropagation();
          const next = prompt("Layer name", item.name || getLayerLabel(item, i));
          if (next === null) return;
          item.name = next.trim() || item.name;
          persistAll(true);
          renderLayerList();
        });

        row.addEventListener("dragstart", (event) => {
          draggingLayerId = item.id;
          row.classList.add("dragging");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", item.id);
          }
        });
        row.addEventListener("dragover", (event) => {
          event.preventDefault();
          if (!draggingLayerId || draggingLayerId === item.id) return;
          const rect = row.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + (rect.height / 2);
          row.classList.toggle("drop-after", placeAfter);
          row.classList.toggle("drop-before", !placeAfter);
        });
        row.addEventListener("dragleave", () => {
          row.classList.remove("drop-before", "drop-after");
        });
        row.addEventListener("drop", (event) => {
          event.preventDefault();
          row.classList.remove("drop-before", "drop-after");
          if (!draggingLayerId || draggingLayerId === item.id) return;
          const rect = row.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + (rect.height / 2);
          reorderLayersByDrag(draggingLayerId, item.id, placeAfter);
          draggingLayerId = null;
        });
        row.addEventListener("dragend", () => {
          draggingLayerId = null;
          row.classList.remove("dragging", "drop-before", "drop-after");
          const rows = layerList.querySelectorAll("li");
          for (const r of rows) r.classList.remove("dragging", "drop-before", "drop-after");
        });
        layerList.appendChild(row);
      }
    }

    function reorderLayersByDrag(dragId, targetId, placeAfter) {
      if (!dragId || !targetId || dragId === targetId) return;
      const topFirstOrder = [...items].reverse().map((entry) => entry.id);
      const dragIndex = topFirstOrder.indexOf(dragId);
      const targetIndex = topFirstOrder.indexOf(targetId);
      if (dragIndex < 0 || targetIndex < 0) return;

      topFirstOrder.splice(dragIndex, 1);
      const adjustedTargetIndex = topFirstOrder.indexOf(targetId);
      const insertIndex = adjustedTargetIndex + (placeAfter ? 1 : 0);
      topFirstOrder.splice(insertIndex, 0, dragId);

      const byId = new Map(items.map((entry) => [entry.id, entry]));
      items = [...topFirstOrder].reverse().map((id) => byId.get(id)).filter(Boolean);
      persistAll(true);
      renderCanvas();
    }

    function updatePanelState() {
      const active = getActiveItem();
      const hasItem = getSelectionIds().length > 0;
      const movableCount = getSelectedItems({ movableOnly: true }).length;
      const isText = Boolean(active && active.type === "text" && !active.locked);
      const selectedMediaItems = getSelectionIds()
        .map((id) => getItemById(id))
        .filter((item) => item && (item.type === "image" || item.type === "video") && !item.locked);
      const selectedImageItems = selectedMediaItems.filter((item) => item.type === "image");
      const hasTextSelection = getSelectionIds()
        .map((id) => getItemById(id))
        .some((item) => item && item.type === "text" && !item.locked);
      const hasMediaSelection = selectedMediaItems.length > 0;
      const hasImageSelection = selectedImageItems.length > 0;

      boldBtn.disabled = !isText || !isEditMode;
      italicBtn.disabled = !isText || !isEditMode;
      h1Btn.disabled = !isText || !isEditMode;
      h2Btn.disabled = !isText || !isEditMode;
      h3Btn.disabled = !isText || !isEditMode;
      paragraphBtn.disabled = !isText || !isEditMode;
      quoteBtn.disabled = !isText || !isEditMode;
      bulletListBtn.disabled = !isText || !isEditMode;
      numberedListBtn.disabled = !isText || !isEditMode;
      alignLeftTextBtn.disabled = !isText || !isEditMode;
      alignCenterTextBtn.disabled = !isText || !isEditMode;
      alignRightTextBtn.disabled = !isText || !isEditMode;
      selectionFontSizeInput.disabled = !isText || !isEditMode;
      applySelectionSizeBtn.disabled = !isText || !isEditMode;
      boxFontSizeInput.disabled = !hasItem || !isEditMode;
      applyBoxSizeBtn.disabled = !hasItem || !isEditMode;
      selectionColorInput.disabled = !isText || !isEditMode;
      applySelectionColorBtn.disabled = !isText || !isEditMode;
      boxColorInput.disabled = !hasItem || !isEditMode;
      applyBoxColorBtn.disabled = !hasItem || !isEditMode;
      fontFamilySelect.disabled = !hasItem || !isEditMode;
      applySelectionFontBtn.disabled = !isText || !isEditMode;
      applyBoxFontBtn.disabled = !hasItem || !isEditMode;
      linkUrlInput.disabled = !isEditMode;
      linkLabelInput.disabled = !isEditMode;
      linkDisplaySelect.disabled = !isEditMode;
      linkTargetSelect.disabled = !isEditMode;
      applyTextLinkBtn.disabled = !isText || !isEditMode;
      removeTextLinkBtn.disabled = !isText || !isEditMode;
      if (attachTextBoxLinkBtn) attachTextBoxLinkBtn.disabled = !hasTextSelection || !isEditMode;
      attachLayerLinkBtn.disabled = !hasItem || !isEditMode;
      clearLayerLinkBtn.disabled = !hasItem || !isEditMode;
      animationSelect.disabled = !hasItem || !isEditMode;
      animationSpeedInput.disabled = !hasItem || !isEditMode;
      applyAnimationBtn.disabled = !hasItem || !isEditMode;
      stretchXInput.disabled = !hasItem || !isEditMode;
      stretchYInput.disabled = !hasItem || !isEditMode;
      applyStretchBtn.disabled = !hasItem || !isEditMode;
      mediaFitSelect.disabled = !hasMediaSelection || !isEditMode;
      applyMediaFitBtn.disabled = !hasMediaSelection || !isEditMode;
      toggleMediaFitBtn.disabled = !hasMediaSelection || !isEditMode;
      if (invertMediaToggle) invertMediaToggle.disabled = !hasImageSelection || !isEditMode;
      if (applyInvertMediaBtn) applyInvertMediaBtn.disabled = !hasImageSelection || !isEditMode;

      zoomInput.disabled = !isEditMode;
      snapToggle.disabled = !isEditMode;
      gridSizeInput.disabled = !isEditMode;
      guideToggle.disabled = !isEditMode;
      canvasSelect.disabled = !isEditMode;
      if (prevCanvasBtn) prevCanvasBtn.disabled = !isEditMode || workspace.canvases.length < 2;
      if (nextCanvasBtn) nextCanvasBtn.disabled = !isEditMode || workspace.canvases.length < 2;
      if (publicCanvasSelect) publicCanvasSelect.disabled = !isEditMode;
      newCanvasBtn.disabled = !isEditMode;
      if (quickClumpBtn) quickClumpBtn.disabled = !isEditMode || movableCount < 2;
      if (quickRandomizeBtn) quickRandomizeBtn.disabled = !isEditMode || movableCount < 1;
      if (quickInspireBtn) quickInspireBtn.disabled = !isEditMode || movableCount < 1;
      alignLeftBtn.disabled = !isEditMode || movableCount < 2;
      alignCenterBtn.disabled = !isEditMode || movableCount < 2;
      alignRightBtn.disabled = !isEditMode || movableCount < 2;
      alignTopBtn.disabled = !isEditMode || movableCount < 2;
      alignMiddleBtn.disabled = !isEditMode || movableCount < 2;
      alignBottomBtn.disabled = !isEditMode || movableCount < 2;
      distributeHBtn.disabled = !isEditMode || movableCount < 3;
      distributeVBtn.disabled = !isEditMode || movableCount < 3;
      exportJsonBtn.disabled = !isEditMode;
      importJsonBtn.disabled = !isEditMode;
      setPublishButtonState();
      duplicateBtn.disabled = !isEditMode || !hasItem;
      renameLayerBtn.disabled = !isEditMode || !active;
      toggleLockBtn.disabled = !isEditMode || !hasItem;
      toggleVisibleBtn.disabled = !isEditMode || !hasItem;

      layerDeleteBtn.disabled = !hasItem || !isEditMode;
      if (smartLayoutSelect) smartLayoutSelect.disabled = !isEditMode || movableCount < 2;
      if (layoutGapInput) layoutGapInput.disabled = !isEditMode || movableCount < 2;
      if (applySmartLayoutBtn) applySmartLayoutBtn.disabled = !isEditMode || movableCount < 2;
      if (slideColumnsInput) slideColumnsInput.disabled = !isEditMode || movableCount < 2;
      if (applySlideColumnsBtn) applySlideColumnsBtn.disabled = !isEditMode || movableCount < 2;
      if (balanceColumnsBtn) balanceColumnsBtn.disabled = !isEditMode || movableCount < 2;
      if (clumpStrengthInput) clumpStrengthInput.disabled = !isEditMode || movableCount < 2;
      if (clumpSpreadInput) clumpSpreadInput.disabled = !isEditMode || movableCount < 2;
      if (clumpBtn) clumpBtn.disabled = !isEditMode || movableCount < 2;
      if (explodeBtn) explodeBtn.disabled = !isEditMode || movableCount < 2;
      if (randomizeLayoutBtn) randomizeLayoutBtn.disabled = !isEditMode || movableCount < 1;
      if (inspireLayoutBtn) inspireLayoutBtn.disabled = !isEditMode || movableCount < 1;
      if (hoverFxSelect) hoverFxSelect.disabled = !isEditMode || !hasMediaSelection;
      if (applyHoverFxBtn) applyHoverFxBtn.disabled = !isEditMode || !hasMediaSelection;
      if (clearHoverFxBtn) clearHoverFxBtn.disabled = !isEditMode || !hasMediaSelection;
      if (hoverBlurInput) hoverBlurInput.disabled = !isEditMode || !hasMediaSelection;
      if (applyHoverBlurBtn) applyHoverBlurBtn.disabled = !isEditMode || !hasMediaSelection;
      if (hoverSwapInput) hoverSwapInput.disabled = !isEditMode || !hasMediaSelection;
      if (applyHoverSwapBtn) applyHoverSwapBtn.disabled = !isEditMode || !hasMediaSelection;
      if (clearHoverSwapBtn) clearHoverSwapBtn.disabled = !isEditMode || !hasMediaSelection;
      if (blendModeSelect) blendModeSelect.disabled = !isEditMode || !hasItem;
      if (applyBlendModeBtn) applyBlendModeBtn.disabled = !isEditMode || !hasItem;
      if (clearBlendModeBtn) clearBlendModeBtn.disabled = !isEditMode || !hasItem;
      if (depthInput) depthInput.disabled = !isEditMode || !hasItem;
      if (shadowSoftnessInput) shadowSoftnessInput.disabled = !isEditMode || !hasItem;
      if (applyDepthBtn) applyDepthBtn.disabled = !isEditMode || !hasItem;
      if (scrollRevealSelect) scrollRevealSelect.disabled = !isEditMode || !hasItem;
      if (applyScrollRevealBtn) applyScrollRevealBtn.disabled = !isEditMode || !hasItem;
      if (clearScrollRevealBtn) clearScrollRevealBtn.disabled = !isEditMode || !hasItem;
      if (marqueeAxisSelect) marqueeAxisSelect.disabled = !isEditMode || !hasItem;
      if (marqueeGapInput) marqueeGapInput.disabled = !isEditMode || !hasItem;
      if (applyMarqueeStripBtn) applyMarqueeStripBtn.disabled = !isEditMode || movableCount < 1;
      if (clearMarqueeStripBtn) clearMarqueeStripBtn.disabled = !isEditMode || movableCount < 1;
      if (sceneTransitionSelect) sceneTransitionSelect.disabled = !isEditMode;
      if (sceneTransitionSpeedInput) sceneTransitionSpeedInput.disabled = !isEditMode;
      if (applySceneTransitionBtn) applySceneTransitionBtn.disabled = !isEditMode;
      if (stylePresetNameInput) stylePresetNameInput.disabled = !isEditMode || !hasItem;
      if (saveStylePresetBtn) saveStylePresetBtn.disabled = !isEditMode || !hasItem;
      if (stylePresetSelect) stylePresetSelect.disabled = !isEditMode || !Array.isArray(settings.stylePresets) || !settings.stylePresets.length;
      if (applyStylePresetBtn) applyStylePresetBtn.disabled = !isEditMode || !hasItem || !Array.isArray(settings.stylePresets) || !settings.stylePresets.length;
      if (deleteStylePresetBtn) deleteStylePresetBtn.disabled = !isEditMode || !Array.isArray(settings.stylePresets) || !settings.stylePresets.length;

      if (active) {
        if ((active.type === "image" || active.type === "video" || active.type === "audio") && Array.isArray(active.mediaAnimations) && active.mediaAnimations.length) {
          animationSelect.value = active.mediaAnimations[active.mediaAnimations.length - 1];
        } else {
          animationSelect.value = active.animation || "none";
        }
        animationSpeedInput.value = String(active.animationSpeed || 6);
      }
      if (isText) {
        boxFontSizeInput.value = String(active.fontSize || 20);
        boxColorInput.value = active.color || "#f3f3f3";
        fontFamilySelect.value = active.fontFamily || DEFAULT_FONT_FAMILY;
        stretchXInput.value = String(active.textScaleX || 1);
        stretchYInput.value = String(active.textScaleY || 1);
      }
      if (hasMediaSelection) {
        mediaFitSelect.value = selectedMediaItems[0].fitMode === "stretch" ? "stretch" : "contain";
        if (hoverBlurInput) {
          const blurPx = clamp(Number(selectedMediaItems[0].hoverBlurPx) || 2, 0, 40);
          hoverBlurInput.value = String(blurPx);
          if (hoverBlurValue) hoverBlurValue.textContent = `${Math.round(blurPx)}px`;
        }
      }
      if (invertMediaToggle) {
        invertMediaToggle.checked = hasImageSelection ? Boolean(selectedImageItems[0].invertMedia) : false;
      }
      if (active) {
        if (document.activeElement !== linkUrlInput) linkUrlInput.value = active.linkUrl || "";
        linkTargetSelect.value = active.linkTarget === "_self" ? "_self" : "_blank";
        linkDisplaySelect.value = ["default", "plain", "button", "highlight"].includes(active.linkDisplay)
          ? active.linkDisplay
          : "default";
        if (hoverFxSelect) hoverFxSelect.value = active.hoverFx || "none";
        if (hoverBlurInput) {
          const blurPx = clamp(Number(active.hoverBlurPx) || 2, 0, 40);
          hoverBlurInput.value = String(blurPx);
          if (hoverBlurValue) hoverBlurValue.textContent = `${Math.round(blurPx)}px`;
        }
        if (blendModeSelect) blendModeSelect.value = active.blendMode || "normal";
        if (depthInput) depthInput.value = String(active.depthZ || 0);
        if (shadowSoftnessInput) shadowSoftnessInput.value = String(active.shadowSoftness || 18);
        if (scrollRevealSelect) scrollRevealSelect.value = active.scrollReveal || "none";
        if (marqueeAxisSelect) marqueeAxisSelect.value = active.marqueeAxis || "x";
        if (marqueeGapInput) marqueeGapInput.value = String(active.marqueeGap || 40);
      }
      if (sceneTransitionSelect) sceneTransitionSelect.value = settings.sceneTransition || "none";
      if (sceneTransitionSpeedInput) sceneTransitionSpeedInput.value = String(settings.sceneTransitionSpeed || 0.5);
      refreshStylePresetSelect();

      updateHistoryButtons();
    }

    function addTransformHandles(node, item) {
      if (item.locked) return;
      const dirs = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
      for (const dir of dirs) {
        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = `transform-handle ${dir}`;
        handle.setAttribute("aria-label", `Resize ${dir}`);
        handle.dataset.dir = dir;
        handle.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();
          startTransform(event, item, node, "resize", dir);
        });
        node.appendChild(handle);
      }
    }

    function applyTextAnimationStyles(content, item) {
      content.style.animation = "none";
      content.style.whiteSpace = "pre-wrap";
      content.style.overflow = "auto";
      content.style.filter = "none";
      if (item.animation === "marquee-left") {
        content.style.animation = `marqueeLeft ${item.animationSpeed || 6}s linear infinite`;
        content.style.whiteSpace = "nowrap";
        content.style.overflow = "hidden";
      } else if (item.animation === "marquee-right") {
        content.style.animation = `marqueeRight ${item.animationSpeed || 6}s linear infinite`;
        content.style.whiteSpace = "nowrap";
        content.style.overflow = "hidden";
      } else if (item.animation === "pulse") {
        content.style.animation = `pulseText ${item.animationSpeed || 2}s ease-in-out infinite`;
      } else if (item.animation === "blink") {
        content.style.animation = `blinkText ${item.animationSpeed || 1.2}s steps(1, end) infinite`;
      } else if (item.animation === "float") {
        content.style.animation = `floatText ${item.animationSpeed || 3}s ease-in-out infinite`;
      } else if (item.animation === "wave") {
        content.style.animation = `waveText ${item.animationSpeed || 2.2}s ease-in-out infinite`;
      } else if (item.animation === "rainbow") {
        content.style.animation = `rainbowText ${item.animationSpeed || 5}s linear infinite`;
      } else if (item.animation === "glitch") {
        content.style.animation = `glitchText ${item.animationSpeed || 0.7}s steps(1, end) infinite`;
      } else if (item.animation === "spin") {
        content.style.animation = `mediaSpin ${item.animationSpeed || 4}s linear infinite`;
      } else if (item.animation === "zoom") {
        content.style.animation = `mediaZoom ${item.animationSpeed || 2.4}s ease-in-out infinite`;
      } else if (
        item.animation === "bounce" ||
        item.animation === "shake" ||
        item.animation === "sway" ||
        item.animation === "drift-x" ||
        item.animation === "drift-y" ||
        item.animation === "flip-x" ||
        item.animation === "flip-y" ||
        item.animation === "skew" ||
        item.animation === "wobble" ||
        item.animation === "flicker" ||
        item.animation === "jello" ||
        item.animation === "zoom-bounce"
      ) {
        const css = resolveAnimationCss(item.animation, item.animationSpeed || 2);
        if (css) content.style.animation = css;
      }
    }

    function resolveAnimationCss(name, speed) {
      if (name === "pulse") return `pulseText ${speed || 2}s ease-in-out infinite`;
      if (name === "blink") return `blinkText ${speed || 1.2}s steps(1, end) infinite`;
      if (name === "float") return `floatText ${speed || 3}s ease-in-out infinite`;
      if (name === "wave") return `waveText ${speed || 2.2}s ease-in-out infinite`;
      if (name === "rainbow") return `rainbowText ${speed || 5}s linear infinite`;
      if (name === "glitch") return `glitchText ${speed || 0.7}s steps(1, end) infinite`;
      if (name === "spin") return `mediaSpin ${speed || 4}s linear infinite`;
      if (name === "zoom") return `mediaZoom ${speed || 2.4}s ease-in-out infinite`;
      if (name === "bounce") return `mediaBounce ${speed || 1.6}s ease-in-out infinite`;
      if (name === "shake") return `mediaShake ${speed || 0.9}s linear infinite`;
      if (name === "sway") return `mediaSway ${speed || 2.2}s ease-in-out infinite`;
      if (name === "drift-x") return `mediaDriftX ${speed || 4}s ease-in-out infinite`;
      if (name === "drift-y") return `mediaDriftY ${speed || 3.6}s ease-in-out infinite`;
      if (name === "flip-x") return `mediaFlipX ${speed || 2.8}s ease-in-out infinite`;
      if (name === "flip-y") return `mediaFlipY ${speed || 2.8}s ease-in-out infinite`;
      if (name === "skew") return `mediaSkew ${speed || 2.1}s ease-in-out infinite`;
      if (name === "wobble") return `mediaWobble ${speed || 1.7}s ease-in-out infinite`;
      if (name === "flicker") return `mediaFlicker ${speed || 0.5}s steps(1, end) infinite`;
      if (name === "jello") return `mediaJello ${speed || 1.9}s ease-in-out infinite`;
      if (name === "zoom-bounce") return `mediaZoomBounce ${speed || 2.3}s ease-in-out infinite`;
      return "";
    }

    function applyMediaAnimationStyles(node, item) {
      node.style.animation = "none";
      const speed = item.animationSpeed || 2;
      const stack = Array.isArray(item.mediaAnimations)
        ? item.mediaAnimations.filter((name) => typeof name === "string" && name && name !== "none")
        : [];
      const names = stack.length ? stack : (item.animation && item.animation !== "none" ? [item.animation] : []);
      const animationList = names.map((name) => resolveAnimationCss(name, speed)).filter(Boolean);
      if (animationList.length) node.style.animation = animationList.join(", ");
    }


    function renderCanvas() {
      canvas.innerHTML = "";
      normalizeSelection();
      for (const item of items) {
        if (item.hidden) continue;
        const node = document.createElement("article");
        node.className = `canvas-item ${item.type}`;
        node.dataset.id = item.id;
        node.style.left = `${item.x}px`;
        node.style.top = `${item.y}px`;
        node.style.width = `${item.w || 260}px`;
        node.style.zIndex = String(items.findIndex((entry) => entry.id === item.id) + 1);
        if (item.h) node.style.height = `${item.h}px`;
        node.style.transformOrigin = "center center";
        node.style.transform = `rotate(${Number(item.rotateDeg) || 0}deg)`;
        node.dataset.hoverFx = item.hoverFx || "none";
        node.style.setProperty("--hover-blur-pop", `${clamp(Number(item.hoverBlurPx) || 2, 0, 40)}px`);
        node.style.filter = item.type === "image" && item.invertMedia ? "invert(1)" : "none";
        node.style.mixBlendMode = item.blendMode && item.blendMode !== "normal" ? item.blendMode : "normal";
        const depth = Number(item.depthZ) || 0;
        const softness = clamp(Number(item.shadowSoftness) || 18, 0, 80);
        if (depth !== 0) {
          const offsetY = Math.round(depth * 0.55);
          const blur = Math.max(0, Math.round(softness + Math.abs(depth)));
          node.style.boxShadow = `0 ${offsetY}px ${blur}px rgba(0,0,0,0.35)`;
        } else {
          node.style.boxShadow = "";
        }
        if (isEditMode) node.classList.add("editing");
        if (isSelected(item.id)) node.classList.add("selected");
        if (item.locked) node.style.opacity = "0.72";
        if (item.type === "text" && item.blogMode) node.classList.add("blog-window");
        if (!isEditMode && item.scrollReveal && item.scrollReveal !== "none") {
          node.classList.add("reveal-ready");
          if (item.scrollReveal !== "fade-up") node.classList.add(`reveal-${item.scrollReveal}`);
        }

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "X";
        deleteBtn.setAttribute("aria-label", "Delete item");
        deleteBtn.addEventListener("click", () => {
          setSingleSelection(item.id);
          deleteSelection();
        });
        actions.appendChild(deleteBtn);
        node.appendChild(actions);

        if (item.type === "text") {
          const moveHandle = document.createElement("div");
          moveHandle.className = "text-move-handle";
          moveHandle.textContent = "DRAG";
          moveHandle.title = "Drag text box";
          moveHandle.addEventListener("pointerdown", (event) => {
            if (!isEditMode || item.locked) return;
            event.preventDefault();
            event.stopPropagation();
            startTransform(event, item, node, "move");
          });
          node.appendChild(moveHandle);

          const content = document.createElement("div");
          content.className = "content";
          content.innerHTML = item.text || "New text block";
          content.style.fontSize = `${item.fontSize || 20}px`;
          content.style.color = item.color || "#f3f3f3";
          content.style.fontFamily = item.fontFamily || DEFAULT_FONT_FAMILY;
          content.style.transformOrigin = "top left";
          content.style.scale = `${item.textScaleX || 1} ${item.textScaleY || 1}`;
          if (!isEditMode && item.linkUrl) {
            content.style.textDecoration = "underline";
            content.style.cursor = "pointer";
            content.style.userSelect = "none";
          } else {
            content.style.textDecoration = "";
            content.style.cursor = "";
            content.style.userSelect = "";
          }
          applyTextAnimationStyles(content, item);
          content.contentEditable = isEditMode && !item.locked ? "true" : "false";
          content.addEventListener("input", () => {
            item.text = content.innerHTML;
            persistAll(false);
          });
          content.addEventListener("paste", (event) => {
            const plain = event.clipboardData && event.clipboardData.getData("text/plain");
            if (!plain) return;
            const trimmed = plain.trim();
            if (!trimmed || /\s/.test(trimmed)) return;
            const url = normalizeUrl(trimmed);
            if (!url) return;
            event.preventDefault();
            addOrUpdateTextLink(url, trimmed, linkDisplaySelect.value, linkTargetSelect.value);
          });
          content.addEventListener("blur", () => pushHistory());
          content.addEventListener("mouseup", captureActiveTextRange);
          content.addEventListener("keyup", captureActiveTextRange);
          node.appendChild(content);
        }

        if (item.type === "image") {
          autoTrimExistingPngItem(item);
          const image = document.createElement("img");
          image.src = item.src;
          image.alt = "Portfolio image";
          image.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
          if (!isEditMode && document.body.classList.contains("vault-no-toolbar")) {
            image.classList.add("inspectable");
            image.addEventListener("click", (event) => {
              if (item.linkUrl) return;
              event.preventDefault();
              event.stopPropagation();
              openImageInspect(item.src, item.name || "Image");
            });
          }
          if (!isEditMode && item.hoverSwapSrc) {
            const baseSrc = item.src;
            const swapSrc = item.hoverSwapSrc;
            node.addEventListener("pointerenter", () => {
              image.src = swapSrc;
            });
            node.addEventListener("pointerleave", () => {
              image.src = baseSrc;
            });
          }
          node.appendChild(image);
        } else if (item.type === "video") {
          const video = document.createElement("video");
          video.src = item.src;
          video.controls = true;
          video.loop = true;
          video.preload = "metadata";
          video.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
          node.appendChild(video);
        } else if (item.type === "audio") {
          const audio = document.createElement("audio");
          audio.src = item.src;
          audio.controls = true;
          audio.preload = "metadata";
          node.appendChild(audio);
        }
        if (item.type === "image" || item.type === "video" || item.type === "audio") {
          applyMediaAnimationStyles(node, item);
        }

        if (item.linkUrl) {
          const allowFrameStyle = item.type !== "image";
          if (allowFrameStyle && item.linkDisplay === "button") {
            node.style.border = "1px solid rgba(255,255,255,0.35)";
            node.style.borderRadius = "12px";
            node.style.background = "rgba(255,255,255,0.05)";
          } else if (allowFrameStyle && item.linkDisplay === "highlight") {
            node.style.border = "1px dashed rgba(255,255,255,0.5)";
          }
          if (!isEditMode) {
            node.classList.add("cursor-link");
            const openLayerLink = (event) => {
              if (event.target.closest("audio,video")) return;
              if (item.type === "text" && event.target.closest("a")) return;
              const url = normalizeUrl(item.linkUrl);
              if (!url) return;
              if (item.linkTarget === "_self") {
                window.location.href = url;
                return;
              }
              window.open(url, "_blank", "noopener,noreferrer");
            };
            node.style.cursor = "pointer";
            if (item.type === "image") {
              const hitbox = document.createElement("button");
              hitbox.type = "button";
              hitbox.className = "media-link-hitbox";
              hitbox.setAttribute("aria-label", "Open image link");
              hitbox.addEventListener("click", openLayerLink);
              node.appendChild(hitbox);
            } else {
              node.addEventListener("click", openLayerLink);
            }
          }
        }

        addTransformHandles(node, item);

        node.addEventListener("pointermove", (event) => {
          if (!isEditMode || item.locked || transformState) return;
          const cornerDir = getCornerResizeDirection(event, node);
          if (cornerDir) {
            node.style.cursor = getResizeCursorForDirection(cornerDir);
            return;
          }
          if (isPointerNearRotateCorner(event, node)) {
            node.style.cursor = "grab";
            return;
          }
          node.style.cursor = "";
        });

        node.addEventListener("pointerleave", () => {
          if (isEditMode) node.style.cursor = "";
        });

        node.addEventListener("pointerdown", (event) => {
          const isAction = event.target.closest(".item-actions");
          const isHandle = event.target.closest(".transform-handle");
          const isTextTyping = event.target.closest(".content");
          if (!isEditMode || isAction || isHandle) return;
          const isToggle = event.ctrlKey || event.metaKey;
          const isRange = event.shiftKey;
          if (event.shiftKey) {
            selectRangeTo(item.id);
          } else if (isToggle) {
            toggleSelection(item.id);
          } else {
            setSingleSelection(item.id);
          }
          if (isTextTyping && event.altKey && !item.locked) {
            syncSelectionClasses();
            renderLayerList();
            updatePanelState();
            startTransform(event, item, node, "move");
            return;
          }
          if (isTextTyping) {
            syncSelectionClasses();
            renderLayerList();
            updatePanelState();
            return;
          }
          if (isToggle || isRange) {
            syncSelectionClasses();
            renderLayerList();
            updatePanelState();
            return;
          }
          syncSelectionClasses();
          renderLayerList();
          updatePanelState();
          const cornerDir = getCornerResizeDirection(event, node);
          if (!item.locked && cornerDir) {
            startTransform(event, item, node, "resize", cornerDir);
            return;
          }
          if (!item.locked && isPointerNearRotateCorner(event, node)) {
            startTransform(event, item, node, "rotate");
            return;
          }
          if (!item.locked) startTransform(event, item, node, "move");
        });

        canvas.appendChild(node);
      }
      renderLayerList();
      updatePanelState();
      refreshRevealObserver();
      ensureCanvasHeight();
    }

    function getCornerResizeDirection(event, node) {
      const rect = node.getBoundingClientRect();
      const corners = [
        [rect.left, rect.top, "nw"],
        [rect.right, rect.top, "ne"],
        [rect.right, rect.bottom, "se"],
        [rect.left, rect.bottom, "sw"]
      ];
      const threshold = 16;
      const thresholdSq = threshold * threshold;
      let bestDir = "";
      let bestDistanceSq = Number.POSITIVE_INFINITY;
      for (const [x, y, dir] of corners) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        const distanceSq = (dx * dx) + (dy * dy);
        if (distanceSq <= thresholdSq && distanceSq < bestDistanceSq) {
          bestDistanceSq = distanceSq;
          bestDir = dir;
        }
      }
      return bestDir;
    }

    function getResizeCursorForDirection(dir) {
      if (dir === "nw" || dir === "se") return "nwse-resize";
      if (dir === "ne" || dir === "sw") return "nesw-resize";
      if (dir === "n" || dir === "s") return "ns-resize";
      if (dir === "e" || dir === "w") return "ew-resize";
      return "move";
    }

    function isPointerNearRotateCorner(event, node) {
      const rect = node.getBoundingClientRect();
      const corners = [
        [rect.left, rect.top],
        [rect.right, rect.top],
        [rect.right, rect.bottom],
        [rect.left, rect.bottom]
      ];
      const inner = 16;
      const outer = 34;
      const innerSq = inner * inner;
      const outerSq = outer * outer;
      for (const [x, y] of corners) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        const distanceSq = (dx * dx) + (dy * dy);
        if (distanceSq > innerSq && distanceSq <= outerSq) return true;
      }
      return false;
    }

    function startTransform(event, item, node, mode, handle = "") {
      if (mode === "resize" && item.locked) return;
      const isTextScaleMode =
        mode === "resize" &&
        item.type === "text" &&
        (event.altKey || event.shiftKey || settings.textStretchDrag);
      const zoom = getCanvasPointerScale();
      const startItems = new Map();
      if (mode === "move") {
        const moveIds = isSelected(item.id) ? getSelectionIds() : [item.id];
        for (const id of moveIds) {
          const target = getItemById(id);
          if (!target || target.hidden || target.locked) continue;
          const targetNode = canvas.querySelector(`.canvas-item[data-id="${id}"]`);
          if (!targetNode) continue;
          startItems.set(id, {
            x: target.x,
            y: target.y,
            w: target.w,
            h: target.h,
            node: targetNode
          });
        }
        if (!startItems.size) return;
      }
      transformState = {
        id: item.id,
        node,
        mode: isTextScaleMode ? "text-scale" : mode,
        handle,
        startX: event.clientX,
        startY: event.clientY,
        startItem: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          rotateDeg: Number(item.rotateDeg) || 0,
          fontSize: Number(item.fontSize) || 20,
          textScaleX: item.textScaleX || 1,
          textScaleY: item.textScaleY || 1
        },
        startItems,
        zoom
      };
      if (mode === "rotate") {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        transformState.rotateCenterX = centerX;
        transformState.rotateCenterY = centerY;
        transformState.rotateStartAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      }
      node.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
      if (!transformState || !isEditMode) return;
      const item = items.find((entry) => entry.id === transformState.id);
      if (!item) return;
      const zoom = transformState.zoom || 1;
      const dxRaw = (event.clientX - transformState.startX) / zoom;
      const dyRaw = (event.clientY - transformState.startY) / zoom;
      const minW = item.type === "image" ? 24 : 120;
      const minH = item.type === "image" ? 24 : 80;
      hideGuides();

      if (transformState.mode === "text-scale") {
        const dir = transformState.handle;
        let sx = transformState.startItem.textScaleX;
        let sy = transformState.startItem.textScaleY;
        if (dir.includes("e") || dir.includes("w")) {
          sx = clamp(transformState.startItem.textScaleX + (dxRaw / 150), 0.2, 5);
        }
        if (dir.includes("n") || dir.includes("s")) {
          sy = clamp(transformState.startItem.textScaleY + (dyRaw / 150), 0.2, 5);
        }
        if (dir.length === 2) {
          sx = clamp(transformState.startItem.textScaleX + (dxRaw / 150), 0.2, 5);
          sy = clamp(transformState.startItem.textScaleY + (dyRaw / 150), 0.2, 5);
        }
        item.textScaleX = sx;
        item.textScaleY = sy;
        const content = transformState.node.querySelector(".content");
        if (content) content.style.scale = `${sx} ${sy}`;
        return;
      }

      if (transformState.mode === "rotate") {
        const centerX = transformState.rotateCenterX;
        const centerY = transformState.rotateCenterY;
        const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        let nextAngle = transformState.startItem.rotateDeg + (currentAngle - transformState.rotateStartAngle);
        if (event.shiftKey) {
          nextAngle = Math.round(nextAngle / 15) * 15;
        }
        item.rotateDeg = nextAngle;
        transformState.node.style.transform = `rotate(${nextAngle}deg)`;
        return;
      }

      if (transformState.mode === "move") {
        let dx = dxRaw;
        let dy = dyRaw;

        if (transformState.startItems.size) {
          let left = Infinity;
          let top = Infinity;
          let right = -Infinity;
          let bottom = -Infinity;
          for (const [, state] of transformState.startItems.entries()) {
            left = Math.min(left, state.x + dx);
            top = Math.min(top, state.y + dy);
            right = Math.max(right, state.x + state.w + dx);
            bottom = Math.max(bottom, state.y + state.h + dy);
          }
          const centerX = left + ((right - left) / 2);
          const centerY = top + ((bottom - top) / 2);
          const snapThreshold = 10 / zoom;
          const canvasCenterX = canvas.clientWidth / 2;
          const canvasCenterY = canvas.clientHeight / 2;
          if (settings.showGuides && Math.abs(centerX - canvasCenterX) <= snapThreshold) {
            dx += (canvasCenterX - centerX);
            showGuideY(canvasCenterX);
          }
          if (settings.showGuides && Math.abs(centerY - canvasCenterY) <= snapThreshold) {
            dy += (canvasCenterY - centerY);
            showGuideX(canvasCenterY);
          }
        }

        if (settings.snapEnabled) {
          const grid = settings.gridSize;
          dx = Math.round(dx / grid) * grid;
          dy = Math.round(dy / grid) * grid;
        }

        for (const [id, state] of transformState.startItems.entries()) {
          const target = getItemById(id);
          if (!target) continue;
          target.x = Math.max(0, Math.round(state.x + dx));
          target.y = Math.max(0, Math.round(state.y + dy));
          state.node.style.left = `${target.x}px`;
          state.node.style.top = `${target.y}px`;
        }
      } else {
        const dx = dxRaw;
        const dy = dyRaw;
        const dir = transformState.handle;
        let left = transformState.startItem.x;
        let top = transformState.startItem.y;
        let right = transformState.startItem.x + transformState.startItem.w;
        let bottom = transformState.startItem.y + transformState.startItem.h;
        const constrainedImageResize = item.type === "image" && item.fitMode !== "stretch";

        if (dir.includes("e")) right += dx;
        if (dir.includes("s")) bottom += dy;
        if (dir.includes("w")) left += dx;
        if (dir.includes("n")) top += dy;

        if (constrainedImageResize) {
          const baseW = Math.max(1, transformState.startItem.w);
          const baseH = Math.max(1, transformState.startItem.h);
          const aspect = baseW / baseH;
          let width = baseW;
          let height = baseH;

          if (dir.includes("e")) width = baseW + dx;
          if (dir.includes("w")) width = baseW - dx;
          if (dir.includes("s")) height = baseH + dy;
          if (dir.includes("n")) height = baseH - dy;

          if (dir.length === 1) {
            if (dir === "e" || dir === "w") {
              height = width / aspect;
            } else if (dir === "n" || dir === "s") {
              width = height * aspect;
            }
          } else {
            const scaleX = width / baseW;
            const scaleY = height / baseH;
            const scale = Math.abs(scaleX - 1) >= Math.abs(scaleY - 1) ? scaleX : scaleY;
            width = baseW * scale;
            height = baseH * scale;
          }

          width = Math.max(minW, width);
          height = Math.max(minH, height);
          const widthFirstHeight = width / aspect;
          if (widthFirstHeight >= minH) {
            height = widthFirstHeight;
          } else {
            width = minH * aspect;
            height = minH;
          }

          if (dir.includes("w")) left = right - width;
          else right = left + width;
          if (dir.includes("n")) top = bottom - height;
          else bottom = top + height;
        } else {
          if (right - left < minW) {
            if (dir.includes("w")) left = right - minW;
            else right = left + minW;
          }

          if (bottom - top < minH) {
            if (dir.includes("n")) top = bottom - minH;
            else bottom = top + minH;
          }
        }

        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (right < left + minW) right = left + minW;
        if (bottom < top + minH) bottom = top + minH;

        if (settings.snapEnabled) {
          const grid = settings.gridSize;
          left = Math.round(left / grid) * grid;
          top = Math.round(top / grid) * grid;
          right = Math.round(right / grid) * grid;
          bottom = Math.round(bottom / grid) * grid;
        }

        item.x = Math.round(left);
        item.y = Math.round(top);
        item.w = Math.round(right - left);
        item.h = Math.round(bottom - top);

        if (item.type === "text") {
          const baseW = Math.max(1, transformState.startItem.w);
          const baseH = Math.max(1, transformState.startItem.h);
          const scaleX = item.w / baseW;
          const scaleY = item.h / baseH;
          const scale = Math.max(0.2, (scaleX + scaleY) / 2);
          item.fontSize = Math.round(clamp(transformState.startItem.fontSize * scale, 8, 300));
          const content = transformState.node.querySelector(".content");
          if (content) content.style.fontSize = `${item.fontSize}px`;
        }
      }

      if (transformState.mode !== "move") {
        transformState.node.style.left = `${item.x}px`;
        transformState.node.style.top = `${item.y}px`;
        transformState.node.style.width = `${item.w}px`;
        transformState.node.style.height = `${item.h}px`;
        transformState.node.style.transform = `rotate(${Number(item.rotateDeg) || 0}deg)`;
      }
      ensureCanvasHeight();
    }

    function handlePointerUp() {
      if (!transformState) return;
      transformState = null;
      hideGuides();
      persistAll(true);
    }

    function setEditMode(enabled) {
      isEditMode = enabled;
      toggleEditBtn.textContent = enabled ? "DONE EDITING" : "SCENERY ONLY";
      addTextBtn.hidden = !enabled;
      if (addBlogBtn) addBlogBtn.hidden = !enabled;
      addImageBtn.hidden = !enabled;
      if (prevCanvasBtn) prevCanvasBtn.hidden = !enabled;
      canvasSelect.hidden = !enabled;
      if (nextCanvasBtn) nextCanvasBtn.hidden = !enabled;
      if (publicCanvasSelect) publicCanvasSelect.hidden = !enabled;
      newCanvasBtn.hidden = !enabled;
      duplicateBtn.hidden = !enabled;
      undoBtn.hidden = !enabled;
      redoBtn.hidden = !enabled;
      if (quickClumpBtn) quickClumpBtn.hidden = !enabled;
      if (quickRandomizeBtn) quickRandomizeBtn.hidden = !enabled;
      if (quickInspireBtn) quickInspireBtn.hidden = !enabled;
      toggleDockBtn.hidden = !enabled;
      if (toggleTopbarBtn) toggleTopbarBtn.hidden = !enabled;
      saveBtn.hidden = !enabled;
      publishBtn.hidden = !enabled;
      resetBtn.hidden = !enabled;
      if (purgeCacheBtn) purgeCacheBtn.hidden = !enabled;
      saveStatus.hidden = !enabled;
      updateDockVisibility();
      if (!enabled) {
        clearSelection();
        hideGuides();
      }
      applySettings();
      renderCanvas();
    }

    function addTextItem() {
      const newItem = {
        id: generateId(),
        type: "text",
        name: `Text ${items.length + 1}`,
        x: 40 + (items.length * 16),
        y: 40 + (items.length * 16),
        w: 260,
        h: 150,
        fontSize: 20,
        color: "#f3f3f3",
        fontFamily: DEFAULT_FONT_FAMILY,
        animation: "none",
        animationSpeed: 6,
        hoverFx: "none",
        hoverBlurPx: 2,
        hoverSwapSrc: "",
        invertMedia: false,
        blendMode: "normal",
        depthZ: 0,
        shadowSoftness: 18,
        scrollReveal: "none",
        marqueeAxis: "x",
        marqueeGap: 40,
        textScaleX: 1,
        textScaleY: 1,
        linkUrl: "",
        linkTarget: "_blank",
        linkDisplay: "default",
        hidden: false,
        locked: false,
        text: "New text"
      };
      items.push(newItem);
      selectedItemIds = [newItem.id];
      activeItemId = newItem.id;
      boxFontSizeInput.value = String(newItem.fontSize);
      persistAll(true);
      renderCanvas();
    }

    function addBlogItem() {
      const newItem = {
        id: generateId(),
        type: "text",
        blogMode: true,
        name: `Blog ${items.length + 1}`,
        x: 72 + (items.length * 14),
        y: 72 + (items.length * 14),
        w: 620,
        h: 420,
        fontSize: 18,
        color: "#f3f3f3",
        fontFamily: DEFAULT_FONT_FAMILY,
        animation: "none",
        animationSpeed: 6,
        hoverFx: "none",
        hoverBlurPx: 2,
        hoverSwapSrc: "",
        invertMedia: false,
        blendMode: "normal",
        depthZ: 0,
        shadowSoftness: 18,
        scrollReveal: "none",
        marqueeAxis: "x",
        marqueeGap: 40,
        textScaleX: 1,
        textScaleY: 1,
        linkUrl: "",
        linkTarget: "_blank",
        linkDisplay: "default",
        hidden: false,
        locked: false,
        text: "<h1>Blog Title</h1><p>Start writing here. Use H1/H2/H3, lists, and quote tools.</p><h2>Section Heading</h2><p>Add body text for your article.</p>"
      };
      items.push(newItem);
      selectedItemIds = [newItem.id];
      activeItemId = newItem.id;
      boxFontSizeInput.value = String(newItem.fontSize);
      persistAll(true);
      renderCanvas();
    }

    function detectMediaType(file) {
      const mime = (file.type || "").toLowerCase();
      if (mime.startsWith("image/")) return "image";
      if (mime.startsWith("video/")) return "video";
      if (mime.startsWith("audio/")) return "audio";
      const name = (file.name || "").toLowerCase();
      if (name.endsWith(".mp4") || name.endsWith(".webm") || name.endsWith(".mov")) return "video";
      if (name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".ogg") || name.endsWith(".m4a")) return "audio";
      if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".gif") || name.endsWith(".webp") || name.endsWith(".bmp") || name.endsWith(".svg")) return "image";
      return "";
    }

    function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
        reader.readAsDataURL(file);
      });
    }

    function isPngDataUrl(dataUrl) {
      return /^data:image\/png(?:;|,)/i.test(String(dataUrl || ""));
    }

    function fitImportedMediaSize(type, width, height) {
      const w = Number(width);
      const h = Number(height);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
      const maxW = type === "video" ? 640 : 520;
      const maxH = type === "video" ? 420 : 420;
      const scale = Math.min(1, maxW / w, maxH / h);
      return {
        w: Math.max(24, Math.round(w * scale)),
        h: Math.max(24, Math.round(h * scale))
      };
    }

    function loadImageElement(dataUrl) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to decode image."));
        image.src = dataUrl;
      });
    }

    async function trimTransparentPng(dataUrl) {
      const image = await loadImageElement(dataUrl);
      const width = image.naturalWidth || image.width || 0;
      const height = image.naturalHeight || image.height || 0;
      if (!width || !height) {
        return { dataUrl, width, height };
      }
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const ctx = source.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        return { dataUrl, width, height };
      }
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, width, height).data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const alpha = pixels[((y * width) + x) * 4 + 3];
          if (alpha <= 8) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < minX || maxY < minY) {
        return { dataUrl, width, height };
      }
      const trimmedWidth = (maxX - minX) + 1;
      const trimmedHeight = (maxY - minY) + 1;
      if (trimmedWidth === width && trimmedHeight === height) {
        return { dataUrl, width, height };
      }
      const trimmed = document.createElement("canvas");
      trimmed.width = trimmedWidth;
      trimmed.height = trimmedHeight;
      const trimmedCtx = trimmed.getContext("2d");
      if (!trimmedCtx) {
        return { dataUrl, width, height };
      }
      trimmedCtx.drawImage(source, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
      return {
        dataUrl: trimmed.toDataURL("image/png"),
        width: trimmedWidth,
        height: trimmedHeight
      };
    }

    async function prepareImageForImport(dataUrl) {
      try {
        if (isPngDataUrl(dataUrl)) {
          const trimmed = await trimTransparentPng(dataUrl);
          return {
            dataUrl: trimmed.dataUrl,
            sizeHint: fitImportedMediaSize("image", trimmed.width, trimmed.height)
          };
        }
        const image = await loadImageElement(dataUrl);
        return {
          dataUrl,
          sizeHint: fitImportedMediaSize(
            "image",
            image.naturalWidth || image.width,
            image.naturalHeight || image.height
          )
        };
      } catch {
        return { dataUrl, sizeHint: null };
      }
    }

    async function autoTrimExistingPngItem(item) {
      if (!item || item.type !== "image") return;
      if (item.pngTrimStatus === "pending" || item.pngTrimStatus === "done") return;
      if (!isPngDataUrl(item.src)) {
        item.pngTrimStatus = "done";
        return;
      }
      item.pngTrimStatus = "pending";
      try {
        const original = await loadImageElement(item.src);
        const originalWidth = original.naturalWidth || original.width || 0;
        const originalHeight = original.naturalHeight || original.height || 0;
        if (!originalWidth || !originalHeight) {
          item.pngTrimStatus = "done";
          return;
        }
        const trimmed = await trimTransparentPng(item.src);
        if (trimmed.dataUrl === item.src || !trimmed.width || !trimmed.height) {
          item.pngTrimStatus = "done";
          return;
        }
        const widthRatio = trimmed.width / originalWidth;
        const heightRatio = trimmed.height / originalHeight;
        item.src = trimmed.dataUrl;
        item.w = Math.max(24, Math.round((item.w || trimmed.width) * widthRatio));
        item.h = Math.max(24, Math.round((item.h || trimmed.height) * heightRatio));
        item.pngTrimStatus = "done";
        persistAll(false);
        renderCanvas();
      } catch {
        item.pngTrimStatus = "done";
      }
    }

    function pointToCanvas(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const scale = getCanvasPointerScale();
      const x = Math.max(0, Math.round((clientX - rect.left) / scale));
      const y = Math.max(0, Math.round((clientY - rect.top) / scale));
      return { x, y };
    }

    async function importFilesToCanvas(fileList, clientX = 160, clientY = 120) {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const base = pointToCanvas(clientX, clientY);
      const createdIds = [];
      let imported = 0;
      for (const file of files) {
        const mediaType = detectMediaType(file);
        if (!mediaType) continue;
        try {
          const dataUrl = await readFileAsDataUrl(file);
          let src = dataUrl;
          let sizeHint = null;
          if (mediaType === "image") {
            const prepared = await prepareImageForImport(dataUrl);
            src = prepared.dataUrl;
            sizeHint = prepared.sizeHint;
          }
          const next = addMediaItem(
            src,
            mediaType,
            file.name,
            base.x + (imported * 28),
            base.y + (imported * 22),
            true,
            sizeHint
          );
          if (next) {
            createdIds.push(next.id);
            imported += 1;
          }
        } catch {
          // Ignore failed files and continue importing the rest.
        }
      }
      if (!createdIds.length) return;
      selectedItemIds = createdIds;
      activeItemId = createdIds[createdIds.length - 1];
      persistAll(true);
      renderCanvas();
    }

    function addMediaItem(dataUrl, mediaType, nameHint = "", x = null, y = null, skipRender = false, sizeHint = null) {
      const type = mediaType || "image";
      let w = 300;
      let h = 220;
      if (type === "audio") {
        w = 340;
        h = 64;
      } else if (type === "video") {
        w = 360;
        h = 220;
      } else if (sizeHint && Number.isFinite(sizeHint.w) && Number.isFinite(sizeHint.h)) {
        w = Math.max(24, Math.round(sizeHint.w));
        h = Math.max(24, Math.round(sizeHint.h));
      }
      const newItem = {
        id: generateId(),
        type,
        name: nameHint || `${type.charAt(0).toUpperCase() + type.slice(1)} ${items.length + 1}`,
        x: Number.isFinite(x) ? Math.max(0, Math.round(x)) : 60 + (items.length * 14),
        y: Number.isFinite(y) ? Math.max(0, Math.round(y)) : 60 + (items.length * 14),
        w,
        h,
        hidden: false,
        locked: false,
        animation: "none",
        animationSpeed: 6,
        mediaAnimations: [],
        hoverFx: "none",
        hoverBlurPx: 2,
        hoverSwapSrc: "",
        invertMedia: false,
        blendMode: "normal",
        depthZ: 0,
        shadowSoftness: 18,
        scrollReveal: "none",
        marqueeAxis: "x",
        marqueeGap: 40,
        fitMode: "contain",
        pngTrimStatus: type === "image" && isPngDataUrl(dataUrl) ? "done" : "",
        linkUrl: "",
        linkTarget: "_blank",
        linkDisplay: "default",
        src: dataUrl
      };
      items.push(newItem);
      if (!skipRender) {
        selectedItemIds = [newItem.id];
        activeItemId = newItem.id;
        persistAll(true);
        renderCanvas();
      }
      return newItem;
    }

    function unlock() {
      isUnlocked = true;
      if (gate) gate.style.display = "none";
      sidePanel.removeAttribute("hidden");
      portfolio.removeAttribute("hidden");
      portfolio.classList.remove("locked");
      portfolio.removeAttribute("aria-hidden");
      forceHideVaultToolbar();
      sidePanel.style.display = "none";
      loadCanvasIntoState(workspace.activeCanvasId, true);
      resetHistoryState();
      setSaveStatus("Saved");
      pushHistory();
      setEditMode(false);
      forceHideVaultToolbar();
      updateDockVisibility();
    }

    async function initializeGateState() {
      isUnlocked = false;
      const publishedWorkspace = await loadPublishedWorkspace();
      if (publishedWorkspace) {
        workspace = publishedWorkspace;
        currentCanvasId = workspace.activeCanvasId;
      }
      refreshCanvasSelectors();
      forceHideVaultToolbar();
      sidePanel.setAttribute("hidden", "");
      portfolio.setAttribute("hidden", "");
      sidePanel.style.display = "none";
      if (gate) {
        gate.removeAttribute("hidden");
        gate.style.display = "";
      }
      portfolio.classList.add("locked");
      portfolio.setAttribute("aria-hidden", "true");
      updateLayoutClasses();
      passwordInput.focus();
    }

    initializeGateState();

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = passwordInput.value;
      const ok = await verifyVaultPassword(input);
      if (ok) {
        unlock();
        errorMsg.textContent = "";
        passwordInput.value = "";
        return;
      }

      errorMsg.textContent = "REQUEST/./SCENERY. (OR SERVER OFFLINE)";
      passwordInput.select();
    });

    toggleEditBtn.addEventListener("click", async () => {
      const input = prompt("SCENERY ONLY");
      if (input === null) return;
      const ok = await verifyEditPassword(input);
      if (!ok) {
        alert("XD");
        return;
      }
      const target = `/vault/sceneryonly/${window.location.search}${window.location.hash}`;
      window.location.href = target;
    });

    toggleDockBtn.addEventListener("click", () => {
      settings.dockVisible = !settings.dockVisible;
      updateDockVisibility();
      persistAll(true);
    });
    if (toggleTopbarBtn) {
      toggleTopbarBtn.addEventListener("click", () => {
        settings.topbarAutoHide = !settings.topbarAutoHide;
        if (settings.topbarAutoHide) {
          setTopbarPeekActive(true);
        } else {
          setTopbarPeekActive(false);
        }
        updateDockVisibility();
        persistAll(true);
      });
    }

    window.addEventListener("mousemove", (event) => {
      const topbarAutoHideEnabled =
        isUnlocked &&
        isEditMode &&
        Boolean(settings.topbarAutoHide) &&
        !document.body.classList.contains("vault-no-toolbar");
      if (!topbarAutoHideEnabled) return;
      const target = event.target;
      const overToolbar = Boolean(target && target.closest && target.closest("#toolbar"));
      const nearTop = event.clientY <= 18;
      setTopbarPeekActive(nearTop || overToolbar);
    });
    window.addEventListener("blur", () => {
      setTopbarPeekActive(false);
    });

    canvasSelect.addEventListener("change", () => {
      switchActiveCanvas(canvasSelect.value);
    });
    if (publicCanvasSelect) {
      publicCanvasSelect.addEventListener("change", () => {
        setPublicCanvas(publicCanvasSelect.value);
      });
    }
    newCanvasBtn.addEventListener("click", () => {
      createNewCanvas();
    });
    if (prevCanvasBtn) {
      prevCanvasBtn.addEventListener("click", () => {
        const ids = workspace.canvases.map((entry) => entry.id);
        const index = ids.indexOf(currentCanvasId);
        if (index < 0) return;
        const next = ids[(index - 1 + ids.length) % ids.length];
        switchActiveCanvas(next);
      });
    }
    if (nextCanvasBtn) {
      nextCanvasBtn.addEventListener("click", () => {
        const ids = workspace.canvases.map((entry) => entry.id);
        const index = ids.indexOf(currentCanvasId);
        if (index < 0) return;
        const next = ids[(index + 1) % ids.length];
        switchActiveCanvas(next);
      });
    }
    if (quickClumpBtn) quickClumpBtn.addEventListener("click", () => applyClumpToSelection(false));
    if (quickRandomizeBtn) quickRandomizeBtn.addEventListener("click", randomizeSelectionLayout);
    if (quickInspireBtn) quickInspireBtn.addEventListener("click", inspireSelection);

    addTextBtn.addEventListener("click", addTextItem);
    if (addBlogBtn) addBlogBtn.addEventListener("click", addBlogItem);
    duplicateBtn.addEventListener("click", duplicateSelection);
    undoBtn.addEventListener("click", undo);
    redoBtn.addEventListener("click", redo);

    addImageBtn.addEventListener("click", () => {
      imageInput.click();
    });

    imageInput.addEventListener("change", async () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      await importFilesToCanvas([file], window.innerWidth * 0.5, window.innerHeight * 0.3);
      imageInput.value = "";
    });

    saveBtn.addEventListener("click", () => {
      const saved = persistAll(true);
      if (!saved) {
        alert("Save failed. Storage may be full or blocked by browser settings.");
      }
    });

    publishBtn.addEventListener("click", () => {
      publishWorkspaceToGithub();
    });

    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset canvas? You can undo, but this protects against misclicks.")) return;
      items = normalizeItems(fallbackClone(DEFAULT_ITEMS));
      clearSelection();
      settings = normalizeSettings(settings);
      applySettings();
      persistAll(true);
      renderCanvas();
    });

    if (purgeCacheBtn) {
      purgeCacheBtn.addEventListener("click", async () => {
        await purgeLocalWorkspaceCache();
      });
    }

    bgColorInput.addEventListener("input", () => {
      settings.canvasBg = bgColorInput.value;
      applySettings();
      persistAll(false);
    });

    bgColorInput.addEventListener("change", () => {
      pushHistory();
    });

    zoomInput.addEventListener("input", () => {
      settings.zoom = clamp(Number(zoomInput.value) / 100, 0.25, 3);
      applySettings();
      persistAll(false);
    });

    zoomInput.addEventListener("change", () => {
      pushHistory();
    });

    snapToggle.addEventListener("change", () => {
      settings.snapEnabled = snapToggle.checked;
      applySettings();
      persistAll(true);
    });

    gridSizeInput.addEventListener("change", () => {
      settings.gridSize = clamp(Number(gridSizeInput.value) || 24, 4, 256);
      applySettings();
      persistAll(true);
    });

    guideToggle.addEventListener("change", () => {
      settings.showGuides = guideToggle.checked;
      hideGuides();
      persistAll(true);
    });

    stretchDragToggle.addEventListener("change", () => {
      settings.textStretchDrag = stretchDragToggle.checked;
      persistAll(true);
    });

    boldBtn.addEventListener("click", () => {
      applyTextCommand("bold");
    });

    italicBtn.addEventListener("click", () => {
      applyTextCommand("italic");
    });

    h1Btn.addEventListener("click", () => {
      applyFormatBlock("H1");
    });

    h2Btn.addEventListener("click", () => {
      applyFormatBlock("H2");
    });

    h3Btn.addEventListener("click", () => {
      applyFormatBlock("H3");
    });

    paragraphBtn.addEventListener("click", () => {
      applyFormatBlock("P");
    });

    quoteBtn.addEventListener("click", () => {
      applyFormatBlock("BLOCKQUOTE");
    });

    bulletListBtn.addEventListener("click", () => {
      applyTextCommand("insertUnorderedList");
    });

    numberedListBtn.addEventListener("click", () => {
      applyTextCommand("insertOrderedList");
    });

    alignLeftTextBtn.addEventListener("click", () => {
      applyTextJustify("justifyLeft");
    });

    alignCenterTextBtn.addEventListener("click", () => {
      applyTextJustify("justifyCenter");
    });

    alignRightTextBtn.addEventListener("click", () => {
      applyTextJustify("justifyRight");
    });

    applySelectionSizeBtn.addEventListener("click", () => {
      const value = Number(selectionFontSizeInput.value) || 24;
      applyFontSizeToSelection(value);
    });

    applyBoxSizeBtn.addEventListener("click", () => {
      const value = Number(boxFontSizeInput.value) || 20;
      applyFontSizeToBox(value);
    });

    applySelectionColorBtn.addEventListener("click", () => {
      applyColorToSelection(selectionColorInput.value);
    });

    applyBoxColorBtn.addEventListener("click", () => {
      applyColorToBox(boxColorInput.value);
    });

    applySelectionFontBtn.addEventListener("click", () => {
      applyFontFamilyToSelection(fontFamilySelect.value);
    });

    applyBoxFontBtn.addEventListener("click", () => {
      applyFontFamilyToBox(fontFamilySelect.value);
    });

    applyTextLinkBtn.addEventListener("click", () => {
      addOrUpdateTextLink(
        linkUrlInput.value,
        linkLabelInput.value,
        linkDisplaySelect.value,
        linkTargetSelect.value
      );
    });

    removeTextLinkBtn.addEventListener("click", () => {
      removeLinkFromSelection();
    });

    attachLayerLinkBtn.addEventListener("click", () => {
      attachLinkToSelection(linkUrlInput.value, linkTargetSelect.value, linkDisplaySelect.value);
    });

    if (attachTextBoxLinkBtn) {
      attachTextBoxLinkBtn.addEventListener("click", () => {
        attachLinkToTextSelection(linkUrlInput.value, linkTargetSelect.value, linkDisplaySelect.value);
      });
    }

    clearLayerLinkBtn.addEventListener("click", () => {
      clearLinkFromSelection();
    });

    applyAnimationBtn.addEventListener("click", () => {
      const speed = Number(animationSpeedInput.value) || 6;
      applyAnimationToBox(animationSelect.value, speed);
    });

    applyStretchBtn.addEventListener("click", () => {
      applyTextStretchToBox(stretchXInput.value, stretchYInput.value);
    });

    applyMediaFitBtn.addEventListener("click", () => {
      applyMediaFitToSelection(mediaFitSelect.value);
    });

    toggleMediaFitBtn.addEventListener("click", () => {
      toggleMediaFitSelection();
    });
    if (applyInvertMediaBtn) {
      applyInvertMediaBtn.addEventListener("click", () => {
        applyImageInvertToSelection(Boolean(invertMediaToggle && invertMediaToggle.checked));
      });
    }

    if (applySmartLayoutBtn) {
      applySmartLayoutBtn.addEventListener("click", () => {
        applySmartLayoutToSelection(
          (smartLayoutSelect && smartLayoutSelect.value) || "grid",
          Number(layoutGapInput && layoutGapInput.value) || 26
        );
      });
    }
    if (applySlideColumnsBtn) {
      applySlideColumnsBtn.addEventListener("click", () => {
        const selected = getCreativeSelection();
        if (!selected.length) return;
        arrangeSelectionInColumns(
          selected,
          Number(slideColumnsInput && slideColumnsInput.value) || 3,
          Number(layoutGapInput && layoutGapInput.value) || 26,
          false
        );
        persistAll(true);
        renderCanvas();
      });
    }
    if (balanceColumnsBtn) {
      balanceColumnsBtn.addEventListener("click", () => {
        const selected = getCreativeSelection();
        if (!selected.length) return;
        arrangeSelectionInColumns(
          selected,
          Number(slideColumnsInput && slideColumnsInput.value) || 3,
          Number(layoutGapInput && layoutGapInput.value) || 26,
          true
        );
        persistAll(true);
        renderCanvas();
      });
    }
    if (clumpBtn) clumpBtn.addEventListener("click", () => applyClumpToSelection(false));
    if (explodeBtn) explodeBtn.addEventListener("click", () => applyClumpToSelection(true));
    if (randomizeLayoutBtn) randomizeLayoutBtn.addEventListener("click", randomizeSelectionLayout);
    if (inspireLayoutBtn) inspireLayoutBtn.addEventListener("click", inspireSelection);
    if (applyHoverFxBtn) {
      applyHoverFxBtn.addEventListener("click", () => {
        applyHoverFxToSelection((hoverFxSelect && hoverFxSelect.value) || "none");
      });
    }
    if (clearHoverFxBtn) clearHoverFxBtn.addEventListener("click", () => applyHoverFxToSelection("none"));
    if (hoverBlurInput) {
      hoverBlurInput.addEventListener("input", () => {
        if (hoverBlurValue) hoverBlurValue.textContent = `${Math.round(Number(hoverBlurInput.value) || 0)}px`;
      });
    }
    if (applyHoverBlurBtn) {
      applyHoverBlurBtn.addEventListener("click", () => {
        applyHoverBlurStrengthToSelection((hoverBlurInput && hoverBlurInput.value) || 2);
      });
    }
    if (applyHoverSwapBtn) {
      applyHoverSwapBtn.addEventListener("click", async () => {
        const file = hoverSwapInput && hoverSwapInput.files && hoverSwapInput.files[0];
        if (!file) return;
        const dataUrl = await readFileAsDataUrl(file);
        applyHoverSwapToSelection(dataUrl);
        hoverSwapInput.value = "";
      });
    }
    if (clearHoverSwapBtn) clearHoverSwapBtn.addEventListener("click", clearHoverSwapFromSelection);
    if (applyBlendModeBtn) {
      applyBlendModeBtn.addEventListener("click", () => {
        applyBlendModeToSelection((blendModeSelect && blendModeSelect.value) || "normal");
      });
    }
    if (clearBlendModeBtn) clearBlendModeBtn.addEventListener("click", () => applyBlendModeToSelection("normal"));
    if (applyDepthBtn) {
      applyDepthBtn.addEventListener("click", () => {
        applyDepthToSelection(
          Number(depthInput && depthInput.value) || 0,
          Number(shadowSoftnessInput && shadowSoftnessInput.value) || 18
        );
      });
    }
    if (applyScrollRevealBtn) {
      applyScrollRevealBtn.addEventListener("click", () => {
        applyScrollRevealToSelection((scrollRevealSelect && scrollRevealSelect.value) || "none");
      });
    }
    if (clearScrollRevealBtn) clearScrollRevealBtn.addEventListener("click", () => applyScrollRevealToSelection("none"));
    if (applyMarqueeStripBtn) {
      applyMarqueeStripBtn.addEventListener("click", () => {
        buildMarqueeStrip(
          (marqueeAxisSelect && marqueeAxisSelect.value) || "x",
          Number(marqueeGapInput && marqueeGapInput.value) || 40
        );
      });
    }
    if (clearMarqueeStripBtn) clearMarqueeStripBtn.addEventListener("click", clearMarqueeStripFromSelection);
    if (applySceneTransitionBtn) {
      applySceneTransitionBtn.addEventListener("click", () => {
        settings.sceneTransition = (sceneTransitionSelect && sceneTransitionSelect.value) || "none";
        settings.sceneTransitionSpeed = clamp(Number(sceneTransitionSpeedInput && sceneTransitionSpeedInput.value) || 0.5, 0.1, 4);
        applySettings();
        persistAll(true);
      });
    }
    if (saveStylePresetBtn) saveStylePresetBtn.addEventListener("click", saveStylePresetFromSelection);
    if (applyStylePresetBtn) applyStylePresetBtn.addEventListener("click", applySelectedStylePreset);
    if (deleteStylePresetBtn) deleteStylePresetBtn.addEventListener("click", deleteSelectedStylePreset);

    alignLeftBtn.addEventListener("click", () => alignSelection("left"));
    alignCenterBtn.addEventListener("click", () => alignSelection("center"));
    alignRightBtn.addEventListener("click", () => alignSelection("right"));
    alignTopBtn.addEventListener("click", () => alignSelection("top"));
    alignMiddleBtn.addEventListener("click", () => alignSelection("middle"));
    alignBottomBtn.addEventListener("click", () => alignSelection("bottom"));
    distributeHBtn.addEventListener("click", () => distributeSelection("x"));
    distributeVBtn.addEventListener("click", () => distributeSelection("y"));

    exportJsonBtn.addEventListener("click", exportJson);
    importJsonBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", () => {
      const file = importInput.files && importInput.files[0];
      importJson(file);
      importInput.value = "";
    });

    uploadCursorBtn.addEventListener("click", () => cursorInput.click());
    cursorInput.addEventListener("change", () => {
      const file = cursorInput.files && cursorInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        settings.cursorData = String(reader.result);
        applySettings();
        persistAll(true);
      };
      reader.readAsDataURL(file);
      cursorInput.value = "";
    });
    clearCursorBtn.addEventListener("click", () => {
      settings.cursorData = "";
      applySettings();
      persistAll(true);
    });

    renameLayerBtn.addEventListener("click", renameActiveLayer);
    toggleLockBtn.addEventListener("click", toggleLockSelection);
    toggleVisibleBtn.addEventListener("click", toggleVisibilitySelection);

    layerDeleteBtn.addEventListener("click", () => {
      deleteSelection();
    });

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("pointerdown", (event) => {
      if (!isEditMode) return;
      if (event.target === canvas) {
        clearSelection();
        hideGuides();
        renderCanvas();
      }
    });

    function hasDraggedFiles(dataTransfer) {
      if (!dataTransfer) return false;
      const types = Array.from(dataTransfer.types || []);
      return types.includes("Files");
    }

    canvasWrap.addEventListener("dragenter", (event) => {
      if (!isEditMode || !hasDraggedFiles(event.dataTransfer)) return;
      event.preventDefault();
      canvasWrap.classList.add("drop-active");
    });

    canvasWrap.addEventListener("dragover", (event) => {
      if (!isEditMode || !hasDraggedFiles(event.dataTransfer)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      canvasWrap.classList.add("drop-active");
    });

    canvasWrap.addEventListener("dragleave", (event) => {
      const next = event.relatedTarget;
      if (next && canvasWrap.contains(next)) return;
      canvasWrap.classList.remove("drop-active");
    });

    canvasWrap.addEventListener("drop", async (event) => {
      if (!isEditMode) return;
      event.preventDefault();
      canvasWrap.classList.remove("drop-active");
      const files = event.dataTransfer && event.dataTransfer.files;
      if (!files || !files.length) return;
      await importFilesToCanvas(files, event.clientX, event.clientY);
    });

    document.addEventListener("dragend", () => {
      canvasWrap.classList.remove("drop-active");
    });

    document.addEventListener("paste", async (event) => {
      if (!isEditMode || gate.style.display !== "none") return;
      const clipboard = event.clipboardData;
      if (!clipboard) return;
      const files = Array.from(clipboard.items || [])
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter(Boolean);
      if (!files.length) return;
      const typing = isTypingTarget(event.target);
      const plain = clipboard.getData("text/plain");
      if (typing && plain && plain.trim()) return;
      event.preventDefault();
      await importFilesToCanvas(files, window.innerWidth * 0.46, window.innerHeight * 0.32);
    });

    document.addEventListener("selectionchange", captureActiveTextRange);
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        imageInspectOverlay &&
        imageInspectOverlay.getAttribute("aria-hidden") === "false"
      ) {
        event.preventDefault();
        closeImageInspect();
        return;
      }
      if (!isEditMode || gate.style.display !== "none") return;
      const isMeta = event.ctrlKey || event.metaKey;
      const typing = isTypingTarget(event.target);

      if (isMeta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (isMeta && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }
      if (isMeta && event.key.toLowerCase() === "d") {
        event.preventDefault();
        duplicateSelection();
        return;
      }
      if (!typing && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        deleteSelection();
        return;
      }
      if (!typing && event.key.toLowerCase() === "t") {
        event.preventDefault();
        addTextItem();
        return;
      }
      if (!typing && event.key.toLowerCase() === "i") {
        event.preventDefault();
        imageInput.click();
        return;
      }
      if (!typing && event.key === "Tab") {
        event.preventDefault();
        settings.dockVisible = !settings.dockVisible;
        updateDockVisibility();
        persistAll(true);
        return;
      }
      if (event.key === "Escape") {
        clearSelection();
        renderCanvas();
        return;
      }
      if (!typing && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft") nudgeSelection(-step, 0);
        if (event.key === "ArrowRight") nudgeSelection(step, 0);
        if (event.key === "ArrowUp") nudgeSelection(0, -step);
        if (event.key === "ArrowDown") nudgeSelection(0, step);
      }
    });
    initPanelToggles();
    window.addEventListener("resize", ensureCanvasHeight);
