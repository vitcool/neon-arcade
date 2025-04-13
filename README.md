# Neon Arcade 🕹️

A browser-based multi-game arcade platform featuring retro-style games with a modern neon aesthetic.

## Disclaimer

This project is intended for non-commercial, educational purposes only. All audio assets used in this project are royalty-free and are used solely for learning and demonstration purposes. This is a learning project to demonstrate web game development techniques and practices.

## Features

- Multiple retro-style games (Platformer, Racer, Puzzle)
- Neon/cyberpunk visual style
- Mobile-responsive with touch controls
- High score system
- Background music and sound effects
- Modern ES6+ JavaScript
- Canvas-based rendering

## Games

1. **Platformer**: Jump & run game with neon platforms
2. **Racer**: Top-down neon car dodging game
3. **Puzzle**: Drag & match mechanic game

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

### Project Structure

```
/neon-arcade/
├── public/
│   └── assets/        # Shared sprites, sounds, fonts
├── src/
│   ├── games/        # Individual game implementations
│   ├── styles/       # CSS styles
│   ├── index.html    # Main HTML file
│   └── index.js      # Main app launcher
└── package.json      # Project configuration
```

## Technologies

- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- Parcel (bundler)
- ESLint & Prettier

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
