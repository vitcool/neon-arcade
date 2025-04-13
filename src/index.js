import AudioManager from './utils/AudioManager';
import { MainMenu } from './scenes/MainMenu';
import { GameState } from './utils/GameState';

class NeonArcade {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.audioManager = new AudioManager();
    this.gameState = new GameState();
    
    this.setupCanvas();
    this.bindEvents();
    this.initMainMenu();
  }

  setupCanvas() {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = Math.min(width / 1280, height / 720);
      
      this.canvas.width = 1280 * ratio;
      this.canvas.height = 720 * ratio;
      this.ctx.scale(ratio, ratio);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
  }

  bindEvents() {
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.addEventListener('click', () => {
      const isMuted = this.audioManager.toggleMute();
      soundToggle.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  initMainMenu() {
    this.currentScene = new MainMenu(this.canvas, this.ctx, this.audioManager, this.gameState);
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene.update();
    this.currentScene.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NeonArcade();
});
