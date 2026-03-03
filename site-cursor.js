(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !finePointer) return;

  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  function readCursorUrl() {
    const raw = getComputedStyle(root).getPropertyValue("--site-cursor").trim();
    const match = raw.match(/url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) return match[2];
    return "/assets/cursors/cursor.png";
  }

  const cursorUrl = readCursorUrl();
  const HOTSPOT_X = 8;
  const HOTSPOT_Y = 8;
  const CURSOR_SIZE = 28;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  layer.style.overflow = "hidden";

  const TRAIL_COUNT = 10;
  const trail = [];
  for (let i = 0; i < TRAIL_COUNT; i += 1) {
    const ghost = document.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.width = `${CURSOR_SIZE}px`;
    ghost.style.height = `${CURSOR_SIZE}px`;
    ghost.style.backgroundImage = `url("${cursorUrl}")`;
    ghost.style.backgroundSize = "contain";
    ghost.style.backgroundRepeat = "no-repeat";
    ghost.style.backgroundPosition = "center";
    ghost.style.opacity = String(Math.max(0.03, 0.55 - (i * 0.05)));
    ghost.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.45))";
    ghost.style.willChange = "transform, opacity";
    layer.appendChild(ghost);
    trail.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      el: ghost
    });
  }

  const glow = document.createElement("div");
  glow.style.position = "absolute";
  glow.style.width = "36px";
  glow.style.height = "36px";
  glow.style.borderRadius = "999px";
  glow.style.background = "radial-gradient(circle, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0) 74%)";
  glow.style.filter = "blur(1.5px)";
  glow.style.opacity = "0";
  glow.style.willChange = "transform, opacity";
  layer.appendChild(glow);

  const head = document.createElement("div");
  head.style.position = "absolute";
  head.style.width = `${CURSOR_SIZE}px`;
  head.style.height = `${CURSOR_SIZE}px`;
  head.style.backgroundImage = `url("${cursorUrl}")`;
  head.style.backgroundSize = "contain";
  head.style.backgroundRepeat = "no-repeat";
  head.style.backgroundPosition = "center";
  head.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.95))";
  head.style.opacity = "0";
  head.style.willChange = "transform, opacity";
  layer.appendChild(head);

  const ring = document.createElement("div");
  ring.style.position = "absolute";
  ring.style.width = "28px";
  ring.style.height = "28px";
  ring.style.borderRadius = "999px";
  ring.style.border = "1px solid rgba(255,255,255,0.7)";
  ring.style.opacity = "0";
  ring.style.transition = "opacity 120ms ease, transform 120ms ease";
  ring.style.willChange = "transform, opacity";
  layer.appendChild(ring);

  body.appendChild(layer);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let visible = false;
  let rafId = 0;
  let pulseT = 0;

  function spawnBurst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("div");
      const angle = (Math.PI * 2 * i) / count;
      const distance = 16 + (Math.random() * 20);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      p.style.position = "absolute";
      p.style.left = `${x - HOTSPOT_X}px`;
      p.style.top = `${y - HOTSPOT_Y}px`;
      p.style.width = "10px";
      p.style.height = "10px";
      p.style.backgroundImage = `url("${cursorUrl}")`;
      p.style.backgroundSize = "contain";
      p.style.backgroundRepeat = "no-repeat";
      p.style.backgroundPosition = "center";
      p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.9))";
      p.style.pointerEvents = "none";
      p.style.transition = "transform 360ms ease-out, opacity 360ms ease-out";
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(0.35)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 420);
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    pulseT += 0.08;
    currentX += (targetX - currentX) * 0.28;
    currentY += (targetY - currentY) * 0.28;
    const pulse = 1 + (Math.sin(pulseT) * 0.08);

    head.style.transform = `translate(${currentX - HOTSPOT_X}px, ${currentY - HOTSPOT_Y}px)`;
    glow.style.transform = `translate(${currentX - 18}px, ${currentY - 18}px) scale(${pulse})`;
    ring.style.transform = `translate(${currentX - 14}px, ${currentY - 14}px) scale(${pulse})`;

    let px = currentX;
    let py = currentY;
    for (let i = 0; i < trail.length; i += 1) {
      const node = trail[i];
      node.x += (px - node.x) * 0.35;
      node.y += (py - node.y) * 0.35;
      const s = Math.max(0.55, 1 - (i * 0.06));
      node.el.style.transform = `translate(${node.x - HOTSPOT_X}px, ${node.y - HOTSPOT_Y}px) scale(${s})`;
      node.el.style.opacity = visible ? String(Math.max(0.03, 0.55 - (i * 0.05))) : "0";
      px = node.x;
      py = node.y;
    }
  }

  function onMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      visible = true;
      ring.style.opacity = "0.95";
      head.style.opacity = "1";
      glow.style.opacity = "0.95";
    }
  }

  function onLeave() {
    visible = false;
    ring.style.opacity = "0";
    head.style.opacity = "0";
    glow.style.opacity = "0";
    for (const node of trail) node.el.style.opacity = "0";
  }

  function onEnter(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      visible = true;
      ring.style.opacity = "0.95";
      head.style.opacity = "1";
      glow.style.opacity = "0.95";
    }
  }

  function onDown(event) {
    ring.style.transform = `translate(${event.clientX - 14}px, ${event.clientY - 14}px) scale(0.72)`;
    spawnBurst(event.clientX, event.clientY);
  }

  function onUp() {
    ring.style.transform = `translate(${currentX - 14}px, ${currentY - 14}px)`;
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseenter", onEnter, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("mousedown", onDown, { passive: true });
  window.addEventListener("mouseup", onUp, { passive: true });
  window.addEventListener("blur", onLeave, { passive: true });
  window.addEventListener("resize", () => {
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
  }, { passive: true });

  tick();

  // Cleanup hook if ever needed.
  window.__SCENERY_CURSOR_TRAIL_DESTROY__ = () => {
    cancelAnimationFrame(rafId);
    layer.remove();
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseenter", onEnter);
    window.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("blur", onLeave);
    window.__SCENERY_CURSOR_TRAIL__ = false;
  };
})();
