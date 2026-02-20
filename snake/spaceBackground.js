const canvas = document.getElementById('space-background');

if (!canvas) {
  throw new Error('Missing #space-background canvas');
}

const ctx = canvas.getContext('2d', { alpha: true });

if (!ctx) {
  throw new Error('2D canvas context is unavailable');
}

const MAX_PIXEL_RATIO = 2;
const MAX_METEORS = 1;

let width = 0;
let height = 0;
let pixelRatio = 1;
let lastTime = 0;
let nextMeteorAt = 0;

let starsFar = [];
let starsMid = [];
let starsNear = [];
let meteors = [];

let nebulaCanvas = null;
let nebulaCtx = null;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createStarLayer(count, sizeMin, sizeMax, alphaMin, alphaMax, driftXMin, driftXMax, twinkle) {
  const stars = new Array(count);
  for (let i = 0; i < count; i += 1) {
    stars[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      size: randomRange(sizeMin, sizeMax),
      alphaBase: randomRange(alphaMin, alphaMax),
      driftX: randomRange(driftXMin, driftXMax),
      twinkleSpeed: twinkle ? randomRange(0.35, 0.95) : 0,
      twinklePhase: Math.random() * Math.PI * 2,
      // Mostly white, rare color tint for near stars.
      tint: null,
    };
  }
  return stars;
}

function tintNearStars() {
  const tintedCount = Math.min(6, starsNear.length);
  for (let i = 0; i < tintedCount; i += 1) {
    const idx = Math.floor(Math.random() * starsNear.length);
    starsNear[idx].tint = Math.random() < 0.5 ? 'rgba(137, 189, 255, ALPHA)' : 'rgba(255, 183, 120, ALPHA)';
  }
}

function createMeteor() {
  const angle = randomRange(Math.PI * 0.14, Math.PI * 0.28);
  const fromTopLeft = Math.random() < 0.7;
  const x = fromTopLeft ? randomRange(-220, width * 0.35) : randomRange(width * 0.45, width + 80);
  const y = randomRange(-150, height * 0.25);
  return {
    x,
    y,
    angle: fromTopLeft ? angle : Math.PI - angle,
    speed: randomRange(1900, 2800),
    length: randomRange(210, 360),
    age: 0,
    ttl: randomRange(0.3, 0.55),
  };
}

function scheduleNextMeteor(now) {
  nextMeteorAt = now + randomRange(7000, 16000);
}

function createNebulaTexture() {
  nebulaCanvas = document.createElement('canvas');
  nebulaCanvas.width = canvas.width;
  nebulaCanvas.height = canvas.height;
  nebulaCtx = nebulaCanvas.getContext('2d');
  if (!nebulaCtx) {
    return;
  }

  nebulaCtx.clearRect(0, 0, width, height);

  const blobs = [
    {
      x: width * 0.22,
      y: height * 0.2,
      r: Math.max(width, height) * 0.5,
      inner: 'rgba(77, 58, 138, 0.035)',
      outer: 'rgba(77, 58, 138, 0)',
    },
    {
      x: width * 0.78,
      y: height * 0.35,
      r: Math.max(width, height) * 0.58,
      inner: 'rgba(34, 66, 120, 0.03)',
      outer: 'rgba(34, 66, 120, 0)',
    },
    {
      x: width * 0.52,
      y: height * 0.78,
      r: Math.max(width, height) * 0.6,
      inner: 'rgba(45, 42, 92, 0.028)',
      outer: 'rgba(45, 42, 92, 0)',
    },
  ];

  for (let i = 0; i < blobs.length; i += 1) {
    const blob = blobs[i];
    const gradient = nebulaCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
    gradient.addColorStop(0, blob.inner);
    gradient.addColorStop(1, blob.outer);
    nebulaCtx.fillStyle = gradient;
    nebulaCtx.fillRect(0, 0, width, height);
  }
}

function resize() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  // Reduced star counts to avoid "dust" look.
  const area = width * height;
  const farCount = Math.max(55, Math.floor(area * 0.000045));
  const midCount = Math.max(35, Math.floor(area * 0.000028));
  const nearCount = Math.max(8, Math.floor(area * 0.000006));

  starsFar = createStarLayer(farCount, 0.5, 1, 0.1, 0.4, -0.0015, -0.0004, false);
  starsMid = createStarLayer(midCount, 1, 1.5, 0.24, 0.62, -0.012, -0.004, true);
  starsNear = createStarLayer(nearCount, 1.5, 2.5, 0.4, 0.8, -0.024, -0.012, true);
  tintNearStars();

  createNebulaTexture();
}

function drawBackground() {
  ctx.fillStyle = '#030308';
  ctx.fillRect(0, 0, width, height);
  if (nebulaCanvas) {
    ctx.drawImage(nebulaCanvas, 0, 0, width, height);
  }
}

function updateAndDrawStars(stars, dt, now, useTint) {
  for (let i = 0; i < stars.length; i += 1) {
    const star = stars[i];
    star.x += star.driftX * dt;
    if (star.x < -4) {
      star.x = width + 2;
      star.y = Math.random() * height;
    }

    let alpha = star.alphaBase;
    if (star.twinkleSpeed > 0) {
      const t = now * 0.001 * star.twinkleSpeed + star.twinklePhase;
      alpha *= 0.68 + ((Math.sin(t) + 1) * 0.16);
    }

    if (useTint && star.tint) {
      ctx.fillStyle = star.tint.replace('ALPHA', String(alpha));
    } else {
      ctx.fillStyle = `rgba(236, 242, 255, ${alpha})`;
    }
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
}

function updateMeteors(now, dt) {
  if (now >= nextMeteorAt && meteors.length < MAX_METEORS) {
    meteors.push(createMeteor());
    scheduleNextMeteor(now);
  }

  for (let i = meteors.length - 1; i >= 0; i -= 1) {
    const m = meteors[i];
    m.age += dt / 1000;
    const distance = m.speed * (dt / 1000);
    const cos = Math.cos(m.angle);
    const sin = Math.sin(m.angle);
    m.x += cos * distance;
    m.y += sin * distance;

    const life = m.age / m.ttl;
    if (life >= 1) {
      meteors.splice(i, 1);
      continue;
    }

    const alpha = 1 - life;
    const tailX = m.x - cos * m.length;
    const tailY = m.y - sin * m.length;
    const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(0.18, `rgba(210, 234, 255, ${alpha * 0.82})`);
    grad.addColorStop(1, 'rgba(210, 234, 255, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 1.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate(now) {
  if (lastTime === 0) {
    lastTime = now;
    scheduleNextMeteor(now);
  }

  const dt = Math.min(34, now - lastTime);
  lastTime = now;

  drawBackground();
  updateAndDrawStars(starsFar, dt, now, false);
  updateAndDrawStars(starsMid, dt, now, false);
  updateAndDrawStars(starsNear, dt, now, true);
  updateMeteors(now, dt);

  requestAnimationFrame(animate);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(animate);
