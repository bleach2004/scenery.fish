    const AUTH_API_BASE = window.SCENERY_AUTH_BASE || "https://marisu.bleach-542.workers.dev";
    const AUTH_ENDPOINT_LOGIN = `${AUTH_API_BASE}/api/auth/login`;
    const AUTH_ENDPOINT_EDIT = `${AUTH_API_BASE}/api/auth/edit`;
    const AUTH_ENDPOINT_PUBLISH = `${AUTH_API_BASE}/api/publish/github`;
    const PUBLISHED_WORKSPACE_URL = "../workspace.json";
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
      dockVisible: true
    };

    const gate = document.getElementById("gate");
    const portfolio = document.getElementById("portfolio");
    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("passwordInput");
    const errorMsg = document.getElementById("errorMsg");
    const toolbar = document.getElementById("toolbar");
    const toggleEditBtn = document.getElementById("toggleEdit");
    const addTextBtn = document.getElementById("addTextBtn");
    const addImageBtn = document.getElementById("addImageBtn");
    const duplicateBtn = document.getElementById("duplicateBtn");
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const toggleDockBtn = document.getElementById("toggleDockBtn");
    const saveBtn = document.getElementById("saveBtn");
    const publishBtn = document.getElementById("publishBtn");
    const resetBtn = document.getElementById("resetBtn");
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
    const zoomInput = document.getElementById("zoomInput");
    const zoomValue = document.getElementById("zoomValue");
    const snapToggle = document.getElementById("snapToggle");
    const gridSizeInput = document.getElementById("gridSizeInput");
    const guideToggle = document.getElementById("guideToggle");
    const canvasSelect = document.getElementById("canvasSelect");
    const newCanvasBtn = document.getElementById("newCanvasBtn");
    const publicCanvasSelect = document.getElementById("publicCanvasSelect");
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

    async function postJson(url, payload) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      return response;
    }

    async function verifyVaultPassword(password) {
      try {
        const response = await postJson(AUTH_ENDPOINT_LOGIN, { password });
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
        const response = await postJson(AUTH_ENDPOINT_EDIT, { password });
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
        dockVisible: typeof next.dockVisible === "boolean" ? next.dockVisible : true
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
          dockVisible: typeof parsed.dockVisible === "boolean" ? parsed.dockVisible : fallback.dockVisible
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
      try {
        const response = await fetch(PUBLISHED_WORKSPACE_URL, { cache: "no-store" });
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

    function formatSaveTime() {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
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

    function updateDockVisibility() {
      const dockVisible = Boolean(settings.dockVisible);
      sidePanel.style.display = isEditMode && dockVisible ? "flex" : "none";
      toggleDockBtn.textContent = dockVisible ? "Hide Dock" : "Show Dock";
      toggleDockBtn.hidden = !isEditMode;
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
        if (next.type === "text") {
          if (!next.fontSize) next.fontSize = 20;
          if (!next.color) next.color = "#f3f3f3";
          if (!next.fontFamily) next.fontFamily = DEFAULT_FONT_FAMILY;
          if (!next.animation) next.animation = "none";
          if (!next.animationSpeed) next.animationSpeed = 6;
          if (!next.textScaleX) next.textScaleX = 1;
          if (!next.textScaleY) next.textScaleY = 1;
        } else if (next.type === "image" || next.type === "video" || next.type === "audio") {
          if (typeof next.src !== "string") next.src = "";
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

      if (isEditMode) {
        let editMinHeight = window.innerHeight * 1.8;
        editMinHeight = Math.max(editMinHeight, 1600);
        canvas.style.transform = "none";
        canvas.style.width = `${Math.max(boundsWidth, window.innerWidth)}px`;
        canvas.style.height = `${Math.max(boundsHeight, editMinHeight)}px`;
        canvasWrap.style.minHeight = "100vh";
        return;
      }

      const viewportWidth = Math.max(320, window.innerWidth);
      const viewportHeight = Math.max(260, window.innerHeight - 16);
      let fitScale = Math.min(viewportWidth / boundsWidth, viewportHeight / boundsHeight);
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
      const selected = getSelectionIds().map((id) => getItemById(id)).filter((item) => item && item.type === "text" && !item.locked);
      if (!selected.length) return;
      for (const item of selected) {
        item.animation = animationName;
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
        const response = await postJson(AUTH_ENDPOINT_PUBLISH, {
          editPassword: publishPassword,
          message,
          workspace
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`GitHub publish failed (${response.status}): ${body || "unknown error"}`);
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
        alert(`Publish failed: ${error.message}`);
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
      const hasMediaSelection = selectedMediaItems.length > 0;

      boldBtn.disabled = !isText || !isEditMode;
      italicBtn.disabled = !isText || !isEditMode;
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

      zoomInput.disabled = !isEditMode;
      snapToggle.disabled = !isEditMode;
      gridSizeInput.disabled = !isEditMode;
      guideToggle.disabled = !isEditMode;
      canvasSelect.disabled = !isEditMode;
      if (publicCanvasSelect) publicCanvasSelect.disabled = !isEditMode;
      newCanvasBtn.disabled = !isEditMode;
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

      if (isText) {
        boxFontSizeInput.value = String(active.fontSize || 20);
        boxColorInput.value = active.color || "#f3f3f3";
        fontFamilySelect.value = active.fontFamily || DEFAULT_FONT_FAMILY;
        animationSelect.value = active.animation || "none";
        animationSpeedInput.value = String(active.animationSpeed || 6);
        stretchXInput.value = String(active.textScaleX || 1);
        stretchYInput.value = String(active.textScaleY || 1);
      }
      if (hasMediaSelection) {
        mediaFitSelect.value = selectedMediaItems[0].fitMode === "stretch" ? "stretch" : "contain";
      }
      if (active) {
        if (document.activeElement !== linkUrlInput) linkUrlInput.value = active.linkUrl || "";
        linkTargetSelect.value = active.linkTarget === "_self" ? "_self" : "_blank";
        linkDisplaySelect.value = ["default", "plain", "button", "highlight"].includes(active.linkDisplay)
          ? active.linkDisplay
          : "default";
      }

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
        if (isEditMode) node.classList.add("editing");
        if (isSelected(item.id)) node.classList.add("selected");
        if (item.locked) node.style.opacity = "0.72";

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
          content.style.animation = "none";
          content.style.whiteSpace = "pre-wrap";
          content.style.overflow = "auto";
          content.style.transformOrigin = "top left";
          content.style.scale = `${item.textScaleX || 1} ${item.textScaleY || 1}`;
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
          }
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
          const image = document.createElement("img");
          image.src = item.src;
          image.alt = "Portfolio image";
          image.style.objectFit = item.fitMode === "stretch" ? "fill" : "contain";
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

        if (item.linkUrl) {
          if (item.linkDisplay === "button") {
            node.style.border = "1px solid rgba(255,255,255,0.35)";
            node.style.borderRadius = "12px";
            node.style.background = "rgba(255,255,255,0.05)";
          } else if (item.linkDisplay === "highlight") {
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
          if (!item.locked) startTransform(event, item, node, "move");
        });

        canvas.appendChild(node);
      }
      renderLayerList();
      updatePanelState();
      ensureCanvasHeight();
    }

    function startTransform(event, item, node, mode, handle = "") {
      if (mode === "resize" && item.locked) return;
      const isTextScaleMode =
        mode === "resize" &&
        item.type === "text" &&
        (event.altKey || event.shiftKey || settings.textStretchDrag);
      const zoom = settings.zoom || 1;
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
          textScaleX: item.textScaleX || 1,
          textScaleY: item.textScaleY || 1
        },
        startItems,
        zoom
      };
      node.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
      if (!transformState || !isEditMode) return;
      const item = items.find((entry) => entry.id === transformState.id);
      if (!item) return;
      const zoom = transformState.zoom || 1;
      const dxRaw = (event.clientX - transformState.startX) / zoom;
      const dyRaw = (event.clientY - transformState.startY) / zoom;
      const minW = 120;
      const minH = 80;
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

        if (dir.includes("e")) right += dx;
        if (dir.includes("s")) bottom += dy;
        if (dir.includes("w")) left += dx;
        if (dir.includes("n")) top += dy;

        if (right - left < minW) {
          if (dir.includes("w")) left = right - minW;
          else right = left + minW;
        }

        if (bottom - top < minH) {
          if (dir.includes("n")) top = bottom - minH;
          else bottom = top + minH;
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
      }

      if (transformState.mode !== "move") {
        transformState.node.style.left = `${item.x}px`;
        transformState.node.style.top = `${item.y}px`;
        transformState.node.style.width = `${item.w}px`;
        transformState.node.style.height = `${item.h}px`;
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
      addImageBtn.hidden = !enabled;
      canvasSelect.hidden = !enabled;
      if (publicCanvasSelect) publicCanvasSelect.hidden = !enabled;
      newCanvasBtn.hidden = !enabled;
      duplicateBtn.hidden = !enabled;
      undoBtn.hidden = !enabled;
      redoBtn.hidden = !enabled;
      toggleDockBtn.hidden = !enabled;
      saveBtn.hidden = !enabled;
      publishBtn.hidden = !enabled;
      resetBtn.hidden = !enabled;
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

    function pointToCanvas(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const zoom = settings.zoom || 1;
      const x = Math.max(0, Math.round((clientX - rect.left) / zoom));
      const y = Math.max(0, Math.round((clientY - rect.top) / zoom));
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
          const next = addMediaItem(
            dataUrl,
            mediaType,
            file.name,
            base.x + (imported * 28),
            base.y + (imported * 22),
            true
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

    function addMediaItem(dataUrl, mediaType, nameHint = "", x = null, y = null, skipRender = false) {
      const type = mediaType || "image";
      let w = 300;
      let h = 220;
      if (type === "audio") {
        w = 340;
        h = 64;
      } else if (type === "video") {
        w = 360;
        h = 220;
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
        fitMode: "contain",
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
      gate.style.display = "none";
      toolbar.removeAttribute("hidden");
      sidePanel.removeAttribute("hidden");
      portfolio.removeAttribute("hidden");
      portfolio.classList.remove("locked");
      portfolio.removeAttribute("aria-hidden");
      toolbar.style.display = "flex";
      sidePanel.style.display = "none";
      loadCanvasIntoState(workspace.activeCanvasId, true);
      resetHistoryState();
      setSaveStatus("Saved");
      pushHistory();
      updateDockVisibility();
    }

    async function initializeGateState() {
      const publishedWorkspace = await loadPublishedWorkspace();
      if (publishedWorkspace) {
        workspace = publishedWorkspace;
        currentCanvasId = workspace.activeCanvasId;
      }
      refreshCanvasSelectors();
      portfolio.classList.add("locked");
      portfolio.setAttribute("aria-hidden", "true");
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

      // Compatibility fallback: allow edit password to unlock the editor route too.
      const editOk = await verifyEditPassword(input);
      if (editOk) {
        unlock();
        errorMsg.textContent = "";
        passwordInput.value = "";
        return;
      }

      errorMsg.textContent = "REQUEST/./SCENERY. (OR SERVER OFFLINE)";
      passwordInput.select();
    });

    toggleEditBtn.addEventListener("click", async () => {
      if (!isEditMode) {
        const input = prompt("SCENERY ONLY");
        if (input === null) return;
        const ok = await verifyEditPassword(input);
        if (!ok) {
          alert("XD");
          return;
        }
      }
      setEditMode(!isEditMode);
    });

    toggleDockBtn.addEventListener("click", () => {
      settings.dockVisible = !settings.dockVisible;
      updateDockVisibility();
      persistAll(true);
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

    addTextBtn.addEventListener("click", addTextItem);
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
      if (saved) {
        setSaveStatus(`Saved ${formatSaveTime()}`);
      } else {
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
