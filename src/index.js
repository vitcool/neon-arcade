import AudioManager from './utils/AudioManager';
import { MainMenu } from './scenes/MainMenu';
import { GameState } from './utils/GameState';

class NeonArcade {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set initial canvas dimensions
    this.canvas.width = 1280;
    this.canvas.height = 720;
    
    // Setup canvas and styles first
    this.setupCanvas();
    
    // Initialize managers after canvas setup
    this.audioManager = new AudioManager();
    this.gameState = new GameState();
    
    // Bind events after managers are ready
    this.bindEvents();
    
    // Initialize main menu last, when everything is ready
    this.initMainMenu();
  }

  setupCanvas() {
    const updateCanvasSize = () => {
      // Calculate scale to maintain aspect ratio and fill screen
      const scaleX = window.innerWidth / 1280;
      const scaleY = window.innerHeight / 720;
      const scale = Math.min(scaleX, scaleY);
      
      // Set canvas display size while maintaining internal dimensions
      this.canvas.style.width = `${1280 * scale}px`;
      this.canvas.style.height = `${720 * scale}px`;
      
      // Center the canvas
      this.canvas.style.position = 'absolute';
      this.canvas.style.left = '50%';
      this.canvas.style.top = '50%';
      this.canvas.style.transform = 'translate(-50%, -50%)';
    };

    // Apply initial size
    updateCanvasSize();
    
    // Handle resize events
    window.addEventListener('resize', updateCanvasSize);
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
