(() => {
  if (window.__SCENERY_CURSOR_TRAIL__) return;
  window.__SCENERY_CURSOR_TRAIL__ = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !finePointer) return;

  const body = document.body;
  if (!body) return;

  const TRAIL_LIMIT = 25;
  const PARTICLE_SPAWN_COUNT = 2;
  const PARTICLE_LIFE = 40;
  const layer = document.createElement("canvas");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  layer.style.overflow = "hidden";

  const ctx = layer.getContext("2d");
  if (!ctx) {
    window.__SCENERY_CURSOR_TRAIL__ = false;
    return;
  }

  body.appendChild(layer);

  let width = layer.width = window.innerWidth;
  let height = layer.height = window.innerHeight;
  const mouse = { x: width / 2, y: height / 2 };
  const trail = [];
  const particles = [];
  let rafId = 0;
  let visible = false;

  function show() {
    visible = true;
  }

  function hide() {
    visible = false;
    trail.length = 0;
    particles.length = 0;
    ctx.clearRect(0, 0, width, height);
  }

  function onEnter(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    show();
  }

  function onMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    trail.push({ x: mouse.x, y: mouse.y });
    if (trail.length > TRAIL_LIMIT) trail.shift();

    for (let i = 0; i < PARTICLE_SPAWN_COUNT; i += 1) {
      particles.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: PARTICLE_LIFE
      });
    }

    if (!visible) show();
  }

  function onResize() {
    width = layer.width = window.innerWidth;
    height = layer.height = window.innerHeight;
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    if (!visible) return;

    ctx.clearRect(0, 0, width, height);

    // 1) White glow line trail
    if (trail.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < trail.length; i += 1) {
        const point = trail[i];
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "white";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 2) White particles
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${particle.life / PARTICLE_LIFE})`;
      ctx.fill();

      if (particle.life <= 0) particles.splice(i, 1);
    }

    // 3) White cursor dot
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
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
