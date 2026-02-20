export const GRID_SIZE = 20;
export const TICK_MS = 120;
export const INPUT_QUEUE_LIMIT = 3;

const DIR = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function getDirection(name) {
  return DIR[name] || null;
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function cellKey(cell) {
  return `${cell.x},${cell.y}`;
}

export function randomFreeCell(snake, gridSize = GRID_SIZE, rng = Math.random) {
  const occupied = new Set(snake.map(cellKey));
  const total = gridSize * gridSize;
  if (occupied.size >= total) {
    return null;
  }

  const fillRate = occupied.size / total;
  const maxAttempts = fillRate < 0.7 ? 24 : 8;

  for (let i = 0; i < maxAttempts; i += 1) {
    const x = Math.floor(rng() * gridSize);
    const y = Math.floor(rng() * gridSize);
    const key = `${x},${y}`;
    if (!occupied.has(key)) {
      return { x, y };
    }
  }

  const free = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        free.push({ x, y });
      }
    }
  }

  if (free.length === 0) {
    return null;
  }

  const idx = Math.floor(rng() * free.length);
  return free[idx];
}

export function createInitialState(gridSize = GRID_SIZE, rng = Math.random) {
  const mid = Math.floor(gridSize / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];

  return {
    gridSize,
    snake,
    direction: DIR.right,
    inputQueue: [],
    food: randomFreeCell(snake, gridSize, rng),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function setDirection(state, dirName) {
  const next = getDirection(dirName);
  if (!next || state.isGameOver) {
    return state;
  }

  const queue = state.inputQueue;
  const baseDirection = queue.length > 0 ? queue[queue.length - 1] : state.direction;
  if (isOpposite(baseDirection, next)) {
    return state;
  }

  if (baseDirection.x === next.x && baseDirection.y === next.y) {
    return state;
  }

  if (queue.length >= INPUT_QUEUE_LIMIT) {
    return state;
  }

  return {
    ...state,
    inputQueue: [...queue, next],
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function restart(state, rng = Math.random) {
  const next = createInitialState(state.gridSize, rng);
  return {
    ...next,
    isPaused: false,
  };
}

export function tick(state, rng = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const hasQueuedInput = state.inputQueue.length > 0;
  const dir = hasQueuedInput ? state.inputQueue[0] : state.direction;
  const remainingQueue = hasQueuedInput ? state.inputQueue.slice(1) : state.inputQueue;
  const head = state.snake[0];
  const newHead = {
    x: head.x + dir.x,
    y: head.y + dir.y,
  };

  if (
    newHead.x < 0 ||
    newHead.x >= state.gridSize ||
    newHead.y < 0 ||
    newHead.y >= state.gridSize
  ) {
    return {
      ...state,
      direction: dir,
      inputQueue: remainingQueue,
      isGameOver: true,
    };
  }

  const willEat =
    state.food && newHead.x === state.food.x && newHead.y === state.food.y;

  const collisionBody = willEat ? state.snake : state.snake.slice(0, -1);
  for (let i = 0; i < collisionBody.length; i += 1) {
    if (collisionBody[i].x === newHead.x && collisionBody[i].y === newHead.y) {
      return {
        ...state,
        direction: dir,
        inputQueue: remainingQueue,
        isGameOver: true,
      };
    }
  }

  const nextSnake = [newHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  const nextFood = willEat
    ? randomFreeCell(nextSnake, state.gridSize, rng)
    : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: dir,
    inputQueue: remainingQueue,
    food: nextFood,
    score: state.score + (willEat ? 1 : 0),
    isGameOver: !nextFood && willEat,
  };
}
