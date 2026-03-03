(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !finePointer) return;

  const body = document.body;
  if (!body) return;

  const cursorUrl = "/assets/cursors/cursor.png";
  const HOTSPOT_X = 8;
  const HOTSPOT_Y = 8;
  const CURSOR_SIZE = 28;
  const ECHO_COUNT = 14;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  layer.style.overflow = "hidden";

  const echoes = [];
  for (let i = 0; i < ECHO_COUNT; i += 1) {
    const el = document.createElement("div");
    const alpha = 0.38 - (i * 0.023);
    const scale = 1 - (i * 0.02);

    el.style.position = "absolute";
    el.style.width = `${CURSOR_SIZE}px`;
    el.style.height = `${CURSOR_SIZE}px`;
    el.style.backgroundImage = `url("${cursorUrl}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";
    el.style.opacity = "0";
    el.style.filter = `drop-shadow(0 0 ${4 + (i * 0.35)}px rgba(255,255,255,${Math.max(0.08, alpha)}))`;
    el.style.willChange = "transform, opacity";

    layer.appendChild(el);

    echoes.push({
      el,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      baseAlpha: Math.max(0.03, alpha),
      scale: Math.max(0.64, scale)
    });
  }

  const head = document.createElement("div");
  head.style.position = "absolute";
  head.style.width = `${CURSOR_SIZE}px`;
  head.style.height = `${CURSOR_SIZE}px`;
  head.style.backgroundImage = `url("${cursorUrl}")`;
  head.style.backgroundSize = "contain";
  head.style.backgroundRepeat = "no-repeat";
  head.style.backgroundPosition = "center";
  head.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.95)) drop-shadow(0 0 14px rgba(255,255,255,0.45)) brightness(1.1)";
  head.style.opacity = "0";
  head.style.willChange = "transform, opacity";
  layer.appendChild(head);

  body.appendChild(layer);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = 0;
  let visible = false;

  function show() {
    visible = true;
    head.style.opacity = "1";
  }

  function hide() {
    visible = false;
    head.style.opacity = "0";
    for (const e of echoes) e.el.style.opacity = "0";
  }

  function tick() {
    rafId = requestAnimationFrame(tick);

    // Head follows quickly, trail follows progressively slower.
    currentX += (targetX - currentX) * 0.34;
    currentY += (targetY - currentY) * 0.34;

    head.style.transform = `translate(${currentX - HOTSPOT_X}px, ${currentY - HOTSPOT_Y}px)`;

    let leaderX = currentX;
    let leaderY = currentY;

    for (let i = 0; i < echoes.length; i += 1) {
      const e = echoes[i];
      const drag = 0.26 - (i * 0.01);
      e.x += (leaderX - e.x) * Math.max(0.07, drag);
      e.y += (leaderY - e.y) * Math.max(0.07, drag);

      e.el.style.transform = `translate(${e.x - HOTSPOT_X}px, ${e.y - HOTSPOT_Y}px) scale(${e.scale})`;
      e.el.style.opacity = visible ? String(e.baseAlpha) : "0";

      leaderX = e.x;
      leaderY = e.y;
    }
  }

  function onMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) show();
  }

  function onEnter(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) show();
  }

  function onResize() {
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseenter", onEnter, { passive: true });
  window.addEventListener("mouseleave", hide, { passive: true });
  window.addEventListener("blur", hide, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  tick();

  window.__SCENERY_CURSOR_TRAIL_DESTROY__ = () => {
    cancelAnimationFrame(rafId);
    layer.remove();
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseenter", onEnter);
    window.removeEventListener("mouseleave", hide);
    window.removeEventListener("blur", hide);
    window.removeEventListener("resize", onResize);
    window.__SCENERY_CURSOR_TRAIL__ = false;
  };
})();
