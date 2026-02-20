import {
  GRID_SIZE,
  TICK_MS,
  createInitialState,
  restart,
  setDirection,
  tick,
  togglePause,
} from './gameLogic.js';

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const statusEl = document.getElementById('status');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const pauseOverlayEl = document.getElementById('pauseOverlay');
const overlayResumeBtn = document.getElementById('overlayResumeBtn');
const gameOverOverlayEl = document.getElementById('gameOverOverlay');
const overlayRestartBtn = document.getElementById('overlayRestartBtn');

let state = createInitialState();
let best = 0;

const cells = [];
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  boardEl.appendChild(cell);
  cells.push(cell);
}

function cellIndex(x, y) {
  return y * GRID_SIZE + x;
}

function setPauseButton(isPaused) {
  if (isPaused) {
    pauseBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-label">Resume</span>';
    return;
  }
  pauseBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-label">Pause</span>';
}

function render() {
  for (const cell of cells) {
    cell.classList.remove('snake', 'snake-head', 'food');
  }

  for (const part of state.snake) {
    const snakeCell = cells[cellIndex(part.x, part.y)];
    if (snakeCell) {
      snakeCell.classList.add('snake');
    }
  }

  const head = state.snake[0];
  if (head) {
    const headCell = cells[cellIndex(head.x, head.y)];
    if (headCell) {
      headCell.classList.add('snake-head');
    }
  }

  if (state.food) {
    const foodCell = cells[cellIndex(state.food.x, state.food.y)];
    if (foodCell) {
      foodCell.classList.add('food');
    }
  }

  scoreEl.textContent = String(state.score);
  best = Math.max(best, state.score);
  bestEl.textContent = String(best);

  if (state.isGameOver) {
    statusEl.textContent = '';
    setPauseButton(false);
    pauseOverlayEl.classList.remove('active');
    pauseOverlayEl.setAttribute('aria-hidden', 'true');
    gameOverOverlayEl.classList.add('active');
    gameOverOverlayEl.setAttribute('aria-hidden', 'false');
    return;
  }

  gameOverOverlayEl.classList.remove('active');
  gameOverOverlayEl.setAttribute('aria-hidden', 'true');
  if (state.isPaused) {
    pauseOverlayEl.classList.add('active');
    pauseOverlayEl.setAttribute('aria-hidden', 'false');
  } else {
    pauseOverlayEl.classList.remove('active');
    pauseOverlayEl.setAttribute('aria-hidden', 'true');
  }
  statusEl.textContent = '';
  setPauseButton(state.isPaused);
}

function step() {
  const nextState = tick(state);
  if (nextState === state) {
    return false;
  }

  state = nextState;
  return true;
}

let lastTime = 0;
let accumulatedMs = 0;

function animationFrame(now) {
  if (lastTime === 0) {
    lastTime = now;
  }

  const elapsed = now - lastTime;
  lastTime = now;
  accumulatedMs += Math.min(elapsed, TICK_MS * 5);
  let shouldRender = false;

  while (accumulatedMs >= TICK_MS) {
    if (step()) {
      shouldRender = true;
    }
    accumulatedMs -= TICK_MS;
  }

  if (shouldRender) {
    render();
  }

  requestAnimationFrame(animationFrame);
}

requestAnimationFrame(animationFrame);

function applyDirection(dirName) {
  state = setDirection(state, dirName);
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === 'arrowup' || key === 'w') {
    event.preventDefault();
    applyDirection('up');
  } else if (key === 'arrowdown' || key === 's') {
    event.preventDefault();
    applyDirection('down');
  } else if (key === 'arrowleft' || key === 'a') {
    event.preventDefault();
    applyDirection('left');
  } else if (key === 'arrowright' || key === 'd') {
    event.preventDefault();
    applyDirection('right');
  } else if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
  } else if (key === 'r') {
    state = restart(state);
    accumulatedMs = 0;
    render();
  }
});

for (const button of document.querySelectorAll('[data-dir]')) {
  button.addEventListener('click', () => {
    const dir = button.getAttribute('data-dir');
    applyDirection(dir);
  });
}

pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

restartBtn.addEventListener('click', () => {
  state = restart(state);
  accumulatedMs = 0;
  render();
});

overlayResumeBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

overlayRestartBtn.addEventListener('click', () => {
  state = restart(state);
  accumulatedMs = 0;
  render();
});

render();
