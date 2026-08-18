# CineVR Seats

Build a sleek, high-end Dark/Red Themed Cinema Ticketing & Concession Web Application with a 3D VR/Sensory Seat Preview.

### Aesthetic & UI System:

- **Palette**: Pitch Obsidian Black (`#0A0A0A`), Deep Charcoal (`#141414`), Premium Cinema Red (`#E50914`), and Crimson Neon Highlights (`#FF2E3B`).

- **Style**: Futuristic Dark Glassmorphism, subtle red glow borders, clean typography, high contrast, smooth transition animations.

### Key Sections & Layout:

1. **Header**: Logo ("CINE-VR"), Movie Title ("Interstellar: Special Edition"), Format Selector (Standard, IMAX Curved, ScreenX 270°).

2. **Interactive 2D/3D Seat Selector**:

   - 2D Grid map for selecting rows (A-G) and seats (1-10).

   - Seat status states: Available (Gray), Selected (Glowing Red), Occupied (Dark Muted).

3. **3D Sensory Room Preview (Three.js)**:

   - A real-time 3D canvas showing the theater interior.

   - Includes curved main screen (IMAX format) and side-projection walls that activate when "ScreenX 270°" mode is enabled.

   - Dynamic Camera Angle: When a user clicks a seat in the 2D grid, the 3D camera smoothly animates and positions itself directly at that seat's exact coordinate, looking towards the screen.

4. **Snacks & Concessions Store**:

   - Menu cards for Popcorns, Drinks, Combos, and Candy.

   - Quantity counter with instant price updating.

5. **Checkout Summary Sidebar / Sticky Footer**:

   - Real-time breakdown of selected seats, format, snacks, and grand total.

   - "Finalize Purchase" action button with confirmation modal.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f4d632f-f51a-4cd6-a28c-d57b22168da2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
