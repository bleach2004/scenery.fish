(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !finePointer) return;

  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  layer.style.overflow = "hidden";

  const TRAIL_COUNT = 12;
  const trail = [];
  for (let i = 0; i < TRAIL_COUNT; i += 1) {
    const dot = document.createElement("div");
    const size = 12 - (i * 0.6);
    dot.style.position = "absolute";
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = "999px";
    dot.style.background = "rgba(255,255,255,0.22)";
    dot.style.boxShadow = "0 0 12px rgba(255,255,255,0.35)";
    dot.style.opacity = String(Math.max(0.05, 0.7 - (i * 0.05)));
    dot.style.transform = "translate(-50%, -50%)";
    dot.style.willChange = "transform, opacity";
    layer.appendChild(dot);
    trail.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      el: dot
    });
  }

  const ring = document.createElement("div");
  ring.style.position = "absolute";
  ring.style.width = "26px";
  ring.style.height = "26px";
  ring.style.borderRadius = "999px";
  ring.style.border = "1px solid rgba(255,255,255,0.45)";
  ring.style.transform = "translate(-50%, -50%)";
  ring.style.opacity = "0";
  ring.style.transition = "opacity 120ms ease";
  ring.style.willChange = "transform, opacity";
  layer.appendChild(ring);

  body.appendChild(layer);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let visible = false;
  let rafId = 0;

  function setVisible(next) {
    visible = next;
    const opacity = next ? "1" : "0";
    ring.style.opacity = next ? "0.85" : "0";
    for (const node of trail) {
      node.el.style.opacity = next ? node.el.style.opacity : "0";
    }
    if (next) return;
    // Reset dots quickly so next entry doesn't drag from stale points.
    for (const node of trail) {
      node.x = targetX;
      node.y = targetY;
      node.el.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
      node.el.style.opacity = opacity;
    }
  }

  function spawnBurst(x, y) {
    const count = 8;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("div");
      const angle = (Math.PI * 2 * i) / count;
      const distance = 10 + (Math.random() * 14);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      p.style.position = "absolute";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.width = "4px";
      p.style.height = "4px";
      p.style.borderRadius = "999px";
      p.style.background = "rgba(255,255,255,0.85)";
      p.style.boxShadow = "0 0 8px rgba(255,255,255,0.8)";
      p.style.transform = "translate(-50%, -50%)";
      p.style.pointerEvents = "none";
      p.style.transition = "transform 320ms ease-out, opacity 320ms ease-out";
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 360);
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    currentX += (targetX - currentX) * 0.28;
    currentY += (targetY - currentY) * 0.28;

    ring.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

    let px = currentX;
    let py = currentY;
    for (let i = 0; i < trail.length; i += 1) {
      const node = trail[i];
      node.x += (px - node.x) * 0.35;
      node.y += (py - node.y) * 0.35;
      node.el.style.transform = `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`;
      if (visible) node.el.style.opacity = String(Math.max(0.05, 0.7 - (i * 0.05)));
      px = node.x;
      py = node.y;
    }
  }

  function onMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      visible = true;
      ring.style.opacity = "0.85";
    }
  }

  function onLeave() {
    visible = false;
    ring.style.opacity = "0";
    for (const node of trail) node.el.style.opacity = "0";
  }

  function onEnter(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      visible = true;
      ring.style.opacity = "0.85";
    }
  }

  function onDown(event) {
    ring.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%) scale(0.72)`;
    spawnBurst(event.clientX, event.clientY);
  }

  function onUp() {
    ring.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
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
