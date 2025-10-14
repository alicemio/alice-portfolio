# Alice's Portfolio

A modern portfolio website featuring a liquid glass design and interactive MeshGradient component.

## Features

- Liquid glass hero section with animated effects
- Interactive MeshGradient component from Paper Design
- Responsive design
- Japanese text with Noto Serif JP font
- Modern glassmorphism UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- React 18
- Vite
- @paper-design/shaders-react
- CSS3 with advanced animations
- Google Fonts (Roboto Serif, Inter, Noto Serif JP)

## Project Structure

```
src/
├── components/
│   └── MeshGradient.jsx    # MeshGradient component
├── App.jsx                 # Main app component
├── App.css                 # All styles
└── main.jsx               # React entry point
```

## MeshGradient Component

The MeshGradient component is imported from `@paper-design/shaders-react` and configured with:
- Colors: `['#C89DC0', '#EAEAEA']`
- Speed: `0.6`
- Distortion: `1`
- Swirl: `1`
- Size: `320px × 480px`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.