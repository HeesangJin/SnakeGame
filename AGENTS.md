# Repository Guidelines

## Project Structure & Module Organization
This repository is a browser-based Snake game with a static entry page.

- `src/index.html`: Main app entry point.
- `src/style.css`: Centralized styling for UI, layout, and effects.
- `src/script.js`: Module bootstrap that loads runtime scripts.
- `src/app.js`: UI wiring, input handling, render loop, and overlays.
- `src/gameLogic.js`: Core game state and pure game mechanics.
- `src/spaceBackground.js`: Canvas-based animated background.
- `docs/TEST_PLAN.md`: Manual UI/interaction checklist.
- `docs/UI_DESIGN.md`, `docs/IMPROVEMENT_PLAN.md`: Design and technical reference docs.
- `assets/images/`: Reference screenshots for visual regression checks.

## Build, Test, and Development Commands
No build step is required; run a local static server for ES modules.

- `python3 -m http.server 4173`
  - Serves the repo at `http://localhost:4173`.
- `open http://localhost:4173/src/index.html` (macOS)
  - Opens the game in your default browser.
- `rg --files`
  - Quick file inventory during review/refactor work.

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons (match existing JS/HTML).
- Use ES modules with named exports/imports.
- Naming:
  - `camelCase` for functions/variables (`setDirection`, `randomFreeCell`)
  - `UPPER_SNAKE_CASE` for constants (`GRID_SIZE`, `TICK_MS`)
- Keep game logic in `src/gameLogic.js`; avoid mixing DOM operations into logic functions.
- Prefer small, single-purpose functions; keep render-path updates explicit.

## Testing Guidelines
Current testing is manual (no automated test runner configured).

- Use `docs/TEST_PLAN.md` as the baseline regression checklist.
- Verify at minimum:
  - Keyboard input (Arrow/WASD), pause (`Space`), restart (`R`)
  - Collision/game-over behavior and score updates
  - Mobile and desktop layout stability (e.g., ~375px and ~1280px widths)
- When UI changes are made, compare against `assets/images/` screenshots.

## Commit & Pull Request Guidelines
There is no established commit history on `main` yet. Use this convention going forward:

- Commit format: `type: short imperative summary`
  - Examples: `feat: add input queue cap`, `fix: prevent reverse-direction enqueue`
- Keep commits focused and logically grouped.
- PRs should include:
  - What changed and why
  - Manual test notes (checklist items run)
  - Before/after screenshots for visible UI changes
