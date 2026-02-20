# Snake Game Refactoring and Performance Improvement Plan

This document outlines the technical improvement plan to enhance the user experience and code quality of the current Snake game project.

## 1. Introduction of Input Buffering System

### Current Status and Issues
- Currently, `setDirection` only stores the last input key as `nextDirection`.
- **Problem**: If two keys are pressed quickly within one tick (e.g., `Up` -> `Left`), the first input is ignored, causing unintended collisions or unresponsive controls.

### Improvement Plan
- **State Structure Change**: Introduce an `inputQueue` array instead of the single `nextDirection` value.
- **Logic Change**:
  - `setDirection`: When valid input is received, add the direction to the queue (recommend limiting buffer size, e.g., 2-3 items).
  - `tick`: Dequeue (`shift`) the oldest input from the queue to set the movement direction for the current tick. If the queue is empty, maintain the last movement direction.

---

## 2. Advanced Game Loop (requestAnimationFrame)

### Current Status and Issues
- The game loop uses `setInterval`.
- **Problem**: It is not synchronized with the browser's repaint cycle, which may cause stuttering animations. It also consumes unnecessary resources in inactive tabs.

### Improvement Plan
- **Loop Method Change**: Remove `setInterval` and switch to the `requestAnimationFrame` pattern.
- **Delta Time Handling**:
  - Record the `lastTime` timestamp and execute the `tick()` function only when the elapsed time (`elapsed`) exceeds `TICK_MS`.
  - This ensures consistent game speed even if frame drops occur.

---

## 3. Rendering Optimization (Virtual DOM Style)

### Current Status and Issues
- The `render()` function resets and re-sets the `className` of all cells (`GRID_SIZE * GRID_SIZE`) every time it is called.
- **Problem**: Unnecessary DOM manipulation costs arise as the grid grows.

### Improvement Plan
- **Diffing Algorithm Application (Optional)**:
  - Remember the snake and food positions from the previous frame.
  - Instead of clearing everything, toggle classes only for the **tail part to be removed** and the **head part to be drawn**.
- **Alternatively**: Since the current grid size (20x20) renders quickly, this part can be applied later if performance issues arise after applying steps 1 and 2, to keep code complexity low.

---

## 4. Algorithm Efficiency

### Current Status and Issues
- The `randomFreeCell` function iterates through the entire grid ($O(N^2)$) every time to find an empty space.

### Improvement Plan
- **Retry Method Introduction**:
  - Instead of scanning the entire grid, generate random coordinates and check if they overlap with the snake.
  - This method is much faster until the snake occupies more than 70% of the screen.
  - Fallback to the existing full scan method after a certain number of failed attempts.

---

## Execution Guide (For Codex)

1. **Modify `src/gameLogic.js`**: Add `inputQueue` to `createInitialState` and change logic in `setDirection` and `tick` functions.
2. **Modify `src/app.js`**: Remove `setInterval` and rewrite the `step` function based on `requestAnimationFrame`.
3. **Test**: Verify that rapid direction changes (e.g., U-turn moves) are smooth.