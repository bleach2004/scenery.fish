(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const body = document.body;
  if (!body) return;

  // Ghost cursor copies (existing behavior).
  const cursorUrl = "/assets/cursors/cursor.png";
  const hotspotX = 8;
  const hotspotY = 8;
  const cursorImageWidth = 55;
  const cursorImageHeight = 55;
  const ghostSize = 62;
  const spawnIntervalMs = 72;
  const fadeDurationMs = 1200;
  const maxGhosts = 120;

  // Canvas line-trail behavior (ported from provided hook).
  const E = {
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98
  };

  function Oscillator(options = {}) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
    this.current = this.offset;
  }
  Oscillator.prototype.update = function update() {
    this.phase += this.frequency;
    this.current = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.current;
  };

  function Node() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
  }

  function Line(posRef) {
    this.spring = 0.45;
    this.friction = E.friction;
    this.nodes = [];
    this.posRef = posRef;
  }
  Line.prototype.init = function init(options = {}) {
    this.spring = (options.spring || 0.45) + (0.1 * Math.random()) - 0.02;
    this.friction = E.friction + (0.01 * Math.random()) - 0.002;
    this.nodes.length = 0;
    for (let i = 0; i < E.size; i += 1) {
      const node = new Node();
      node.x = this.posRef.x;
      node.y = this.posRef.y;
      this.nodes.push(node);
    }
  };
  Line.prototype.update = function update() {
    let spring = this.spring;
    let node = this.nodes[0];
    node.vx += (this.posRef.x - node.x) * spring;
    node.vy += (this.posRef.y - node.y) * spring;
    for (let i = 0; i < this.nodes.length; i += 1) {
      node = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * E.dampening;
        node.vy += prev.vy * E.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= E.tension;
    }
  };
  Line.prototype.draw = function draw(ctx) {
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 1; i < this.nodes.length - 2; i += 1) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      x = 0.5 * (a.x + b.x);
      y = 0.5 * (a.y + b.y);
      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }
    const penultimate = this.nodes[this.nodes.length - 2];
    const last = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
    ctx.stroke();
    ctx.closePath();
  };

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "2147483645";
  body.appendChild(canvas);

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.overflow = "hidden";
  layer.style.zIndex = "2147483646";
  body.appendChild(layer);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    layer.remove();
    window.__SCENERY_CURSOR_TRAIL__ = false;
    return;
  }

  const pos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  const ghosts = [];
  let lines = [];
  let oscillator = null;
  let rafId = 0;
  let lastSpawnAt = 0;
  let visible = false;
  let canvasRunning = true;
  let initializedTrails = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i += 1) {
      const line = new Line(pos);
      line.init({ spring: 0.4 + ((i / E.trails) * 0.025) });
      lines.push(line);
    }
  }

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

  function updatePointerFromEvent(event) {
    if (event.touches && event.touches.length) {
      pos.x = event.touches[0].pageX;
      pos.y = event.touches[0].pageY;
    } else {
      pos.x = event.clientX;
      pos.y = event.clientY;
    }
  }

  function onPointerMove(event) {
    updatePointerFromEvent(event);
    if (event.cancelable && event.touches) event.preventDefault();
    visible = true;

    if (!initializedTrails) {
      initLines();
      initializedTrails = true;
    }

    const now = performance.now();
    if (now - lastSpawnAt >= spawnIntervalMs) {
      lastSpawnAt = now;
      spawnGhost(pos.x, pos.y, now);
    }
  }

  function onTouchStart(event) {
    if (event.touches.length === 1) onPointerMove(event);
  }

  function onLeave() {
    visible = false;
  }

  function onFocus() {
    if (!canvasRunning) {
      canvasRunning = true;
      rafId = requestAnimationFrame(render);
    }
  }

  function onBlur() {
    canvasRunning = false;
  }

  function render(now) {
    if (!canvasRunning) return;
    rafId = requestAnimationFrame(render);

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    if (visible && lines.length) {
      ctx.strokeStyle = `hsla(${Math.round(oscillator.update())},50%,50%,0.2)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < lines.length; i += 1) {
        lines[i].update();
        lines[i].draw(ctx);
      }
    }

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

  resizeCanvas();
  oscillator = new Oscillator({
    phase: Math.random() * Math.PI * 2,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285
  });

  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("mouseenter", onPointerMove, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("blur", onBlur, { passive: true });
  window.addEventListener("focus", onFocus, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("orientationchange", resizeCanvas, { passive: true });

  rafId = requestAnimationFrame(render);

  window.__SCENERY_CURSOR_TRAIL_DESTROY__ = () => {
    cancelAnimationFrame(rafId);
    canvasRunning = false;
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("mouseenter", onPointerMove);
    window.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("orientationchange", resizeCanvas);
    for (const ghost of ghosts) ghost.el.remove();
    canvas.remove();
    layer.remove();
    window.__SCENERY_CURSOR_TRAIL__ = false;
  };
})();
