# Space Snake Game
Neon arcade Snake with a cinematic space backdrop, built with plain web technologies.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=111)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Preview
![Gameplay Screenshot](./assets/images/screenshot.png)

## Features
- Space-themed animated background using Canvas (stars, nebula, meteor effects)
- Responsive game board with neon-style HUD and overlays
- Keyboard controls (Arrow keys + WASD) and on-screen D-pad for mobile
- Pause/Resume and Restart actions via both keyboard and UI buttons
- Input queue support for smoother fast direction changes

## How to Play (Controls)
- Move: `Arrow Keys` or `W`, `A`, `S`, `D`
- Pause/Resume: `Space`
- Restart: `R`
- Mobile/Touch: use the on-screen D-pad and action buttons
- Goal: eat food, grow longer, and avoid walls/self-collision

## Installation & Running Locally
1. Clone the repository:
   `git clone https://github.com/HeesangJin/SnakeGame.git`
2. Enter the project directory:
   `cd SnakeGame`
3. Start a local static server:
   `python3 -m http.server 4173`
4. Open the game:
   `http://localhost:4173/src/index.html`

## Deployment
This project can be hosted on GitHub Pages.  
Since the app entry is in `src/index.html`, deploy using a GitHub Actions Pages workflow (or publish a built copy with `index.html` at the publish root).

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Canvas API

## License
This project is licensed under the MIT License. See `LICENSE` for details.

