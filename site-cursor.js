(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !finePointer) return;

  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  // Always use the exact sprite file requested by user.
  const cursorUrl = "/assets/cursors/cursor.png";
  const HOTSPOT_X = 8;
  const HOTSPOT_Y = 8;
  const CURSOR_SIZE = 28;
  const GHOST_COUNT = 24;
  const GHOST_LIFE_MS = 250;
  const GHOST_EMIT_MS = 12;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  layer.style.overflow = "hidden";

  const ghosts = [];
  for (let i = 0; i < GHOST_COUNT; i += 1) {
    const ghost = document.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.width = `${CURSOR_SIZE}px`;
    ghost.style.height = `${CURSOR_SIZE}px`;
    ghost.style.backgroundImage = `url("${cursorUrl}")`;
    ghost.style.backgroundSize = "contain";
    ghost.style.backgroundRepeat = "no-repeat";
    ghost.style.backgroundPosition = "center";
    ghost.style.opacity = "0";
    ghost.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.66))";
    ghost.style.willChange = "transform, opacity";
    layer.appendChild(ghost);
    ghosts.push({
      el: ghost,
      active: false,
      x: 0,
      y: 0,
      born: 0,
      angle: 0,
      spin: 0,
      drift: 0,
      twist: 0
    });
  }

  const orbiters = [];
  for (let i = 0; i < 9; i += 1) {
    const orb = document.createElement("div");
    orb.style.position = "absolute";
    orb.style.width = "6px";
    orb.style.height = "6px";
    orb.style.borderRadius = "999px";
    orb.style.background = "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.42) 55%, rgba(255,255,255,0) 100%)";
    orb.style.filter = "blur(0.35px)";
    orb.style.opacity = "0";
    orb.style.willChange = "transform, opacity";
    layer.appendChild(orb);
    orbiters.push({
      el: orb,
      phase: (Math.PI * 2 * i) / 9,
      radius: 10 + (i * 1.25)
    });
  }

  const glow = document.createElement("div");
  glow.style.position = "absolute";
  glow.style.width = "38px";
  glow.style.height = "38px";
  glow.style.borderRadius = "999px";
  glow.style.background = "radial-gradient(circle, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.2) 36%, rgba(255,255,255,0) 74%)";
  glow.style.filter = "blur(1.4px)";
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
  head.style.filter = "drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 18px rgba(255,255,255,0.72)) brightness(1.24)";
  head.style.opacity = "0";
  head.style.willChange = "transform, opacity";
  layer.appendChild(head);

  const ring = document.createElement("div");
  ring.style.position = "absolute";
  ring.style.width = "28px";
  ring.style.height = "28px";
  ring.style.borderRadius = "999px";
  ring.style.border = "1px solid rgba(255,255,255,0.72)";
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
  let lastEmit = 0;

  function easeOutCubic(t) {
    const k = 1 - t;
    return 1 - (k * k * k);
  }

  function emitGhost(x, y, now) {
    let g = null;
    for (let i = 0; i < ghosts.length; i += 1) {
      if (!ghosts[i].active) {
        g = ghosts[i];
        break;
      }
    }
    if (!g) g = ghosts[0];
    g.active = true;
    g.x = x;
    g.y = y;
    g.born = now;
    g.angle = Math.random() * Math.PI * 2;
    g.spin = (Math.random() * 2.8) - 1.4;
    g.drift = 2.5 + (Math.random() * 6.5);
    g.twist = (Math.random() * 24) - 12;
    g.el.style.opacity = "0.98";
  }

  function spawnBurst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("div");
      const angle = (Math.PI * 2 * i) / count;
      const distance = 18 + (Math.random() * 22);
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
      p.style.filter = "drop-shadow(0 0 7px rgba(255,255,255,1))";
      p.style.pointerEvents = "none";
      p.style.transition = "transform 340ms ease-out, opacity 340ms ease-out";
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(0.24)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 400);
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    pulseT += 0.085;
    currentX += (targetX - currentX) * 0.3;
    currentY += (targetY - currentY) * 0.3;

    const pulse = 1 + (Math.sin(pulseT) * 0.1);
    head.style.transform = `translate(${currentX - HOTSPOT_X}px, ${currentY - HOTSPOT_Y}px)`;
    glow.style.transform = `translate(${currentX - 19}px, ${currentY - 19}px) scale(${pulse})`;
    ring.style.transform = `translate(${currentX - 14}px, ${currentY - 14}px) scale(${pulse})`;

    if (visible && (now - lastEmit) >= GHOST_EMIT_MS) {
      emitGhost(currentX, currentY, now);
      lastEmit = now;
    }

    for (let i = 0; i < ghosts.length; i += 1) {
      const g = ghosts[i];
      if (!g.active) continue;
      const life = (now - g.born) / GHOST_LIFE_MS;
      if (!visible || life >= 1) {
        g.active = false;
        g.el.style.opacity = "0";
        continue;
      }
      const e = easeOutCubic(Math.min(1, life));
      const swirl = g.angle + (g.spin * e * 8.5);
      const drift = g.drift * (2.8 + (e * 13));
      const x = g.x + (Math.cos(swirl) * drift);
      const y = g.y + (Math.sin(swirl) * drift);
      const scale = Math.max(0.16, 1 - (e * 0.84));
      const rot = g.twist * e;
      const alpha = Math.pow(1 - life, 1.6);
      g.el.style.transform = `translate(${x - HOTSPOT_X}px, ${y - HOTSPOT_Y}px) rotate(${rot}deg) scale(${scale})`;
      g.el.style.opacity = String(alpha);
    }

    for (let i = 0; i < orbiters.length; i += 1) {
      const o = orbiters[i];
      const a = (pulseT * 0.9) + o.phase;
      const r = o.radius + (Math.sin((pulseT * 1.55) + i) * 2.3);
      const x = currentX + (Math.cos(a) * r);
      const y = currentY + (Math.sin(a) * r);
      o.el.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      o.el.style.opacity = visible ? "0.78" : "0";
    }
  }

  function show() {
    visible = true;
    ring.style.opacity = "0.96";
    head.style.opacity = "1";
    glow.style.opacity = "0.96";
  }

  function onMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) show();
  }

  function onLeave() {
    visible = false;
    ring.style.opacity = "0";
    head.style.opacity = "0";
    glow.style.opacity = "0";
    for (const g of ghosts) {
      g.active = false;
      g.el.style.opacity = "0";
    }
    for (const o of orbiters) o.el.style.opacity = "0";
  }

  function onEnter(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) show();
  }

  function onDown(event) {
    ring.style.transform = `translate(${event.clientX - 14}px, ${event.clientY - 14}px) scale(0.72)`;
    spawnBurst(event.clientX, event.clientY);
  }

  function onUp() {
    ring.style.transform = `translate(${currentX - 14}px, ${currentY - 14}px)`;
  }

  const onResize = () => {
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseenter", onEnter, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("mousedown", onDown, { passive: true });
  window.addEventListener("mouseup", onUp, { passive: true });
  window.addEventListener("blur", onLeave, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  tick();

  window.__SCENERY_CURSOR_TRAIL_DESTROY__ = () => {
    cancelAnimationFrame(rafId);
    layer.remove();
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseenter", onEnter);
    window.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("blur", onLeave);
    window.removeEventListener("resize", onResize);
    window.__SCENERY_CURSOR_TRAIL__ = false;
  };
})();
