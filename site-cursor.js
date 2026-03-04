(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const body = document.body;
  if (!body) return;

  const cursorUrl = "/assets/cursors/cursor.png";
  const hotspotX = 8;
  const hotspotY = 8;
  const cursorImageWidth = 55;
  const cursorImageHeight = 55;

  const ghostSize = 62;
  const spawnIntervalMs = 72;
  const fadeDurationMs = 1200;
  const maxGhosts = 120;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.overflow = "hidden";
  layer.style.zIndex = "2147483646";
  body.appendChild(layer);

  const ghosts = [];
  let rafId = 0;
  let lastSpawnAt = 0;
  let visible = false;

  function spawnGhost(x, y, now) {
    const scaleX = ghostSize / cursorImageWidth;
    const scaleY = ghostSize / cursorImageHeight;

    const ghost = document.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.width = `${ghostSize}px`;
    ghost.style.height = `${ghostSize}px`;
    ghost.style.left = `${Math.round(x - (hotspotX * scaleX))}px`;
    ghost.style.top = `${Math.round(y - (hotspotY * scaleY))}px`;
    ghost.style.backgroundImage = `url("${cursorUrl}")`;
    ghost.style.backgroundSize = "contain";
    ghost.style.backgroundRepeat = "no-repeat";
    ghost.style.backgroundPosition = "center";
    ghost.style.opacity = "0.5";
    ghost.style.filter = "brightness(1.2)";
    ghost.style.willChange = "opacity";
    layer.appendChild(ghost);

    ghosts.push({ el: ghost, bornAt: now });
    if (ghosts.length > maxGhosts) {
      const removed = ghosts.shift();
      if (removed) removed.el.remove();
    }
  }

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (!visible && ghosts.length === 0) return;

    for (let i = ghosts.length - 1; i >= 0; i -= 1) {
      const ghost = ghosts[i];
      const age = now - ghost.bornAt;
      const t = Math.min(1, age / fadeDurationMs);
      ghost.el.style.opacity = String(0.5 * (1 - t));
      if (t >= 1) {
        ghost.el.remove();
        ghosts.splice(i, 1);
      }
    }
  }

  function onPointerMove(event) {
    const point = event.touches && event.touches.length
      ? { x: event.touches[0].pageX, y: event.touches[0].pageY }
      : { x: event.clientX, y: event.clientY };
    if (event.cancelable && event.touches) event.preventDefault();

    visible = true;
    const now = performance.now();
    if (now - lastSpawnAt >= spawnIntervalMs) {
      lastSpawnAt = now;
      spawnGhost(point.x, point.y, now);
    }
  }

  function onLeave() {
    visible = false;
  }

  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: false });
  window.addEventListener("touchstart", onPointerMove, { passive: false });
  window.addEventListener("mouseenter", onPointerMove, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("blur", onLeave, { passive: true });

  rafId = requestAnimationFrame(tick);

  window.__SCENERY_CURSOR_TRAIL_DESTROY__ = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchstart", onPointerMove);
    window.removeEventListener("mouseenter", onPointerMove);
    window.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onLeave);
    for (const ghost of ghosts) ghost.el.remove();
    layer.remove();
    window.__SCENERY_CURSOR_TRAIL__ = false;
  };
})();
