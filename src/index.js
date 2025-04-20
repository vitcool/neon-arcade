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
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Calculate scale to maintain aspect ratio and fill screen
      const scaleX = window.innerWidth / 1280;
      const scaleY = window.innerHeight / 720;
      const scale = Math.max(scaleX, scaleY);
      
      // Clear any previous transforms
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      // Center the game area
      const offsetX = (window.innerWidth - (1280 * scale)) / 2;
      const offsetY = (window.innerHeight - (720 * scale)) / 2;
      
      this.ctx.translate(offsetX, offsetY);
      this.ctx.scale(scale, scale);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
  }

  bindEvents() {
    const soundToggle = document.getElementById('soundToggle');
    
    // Update initial icon state
    const updateIcon = (isMuted) => {
      soundToggle.textContent = isMuted ? '🔇' : '🔊';
      // Update mute/unmute icon
    };
    
    updateIcon(this.audioManager.isMuted);
    
    // Add click handler
    soundToggle.addEventListener('click', async () => {
      const isMuted = await this.audioManager.toggleMute();
      updateIcon(isMuted);
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
