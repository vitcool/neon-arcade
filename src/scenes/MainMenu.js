export class MainMenu {
  constructor(canvas, ctx, audioManager, gameState) {
    // Initialize MainMenu scene
    this.canvas = canvas;
    this.ctx = ctx;
    this.audioManager = audioManager;
    this.gameState = gameState;
    
    this.buttons = [
      { text: 'Platformer', game: 'platformer', active: true },
      { text: 'Racer', game: 'racer', active: true },
      { text: 'Snake', game: 'snake', active: true }
    ];
    
    this.showingScores = false;
    this.active = true;
    
    // Set initial canvas dimensions
    this.canvas.width = 1280;
    this.canvas.height = 720;
    
    this.setupEventListeners();
    this.resizeCanvas();
    
    // Load and start background music
    this.loadBackgroundMusic();
    
    // Handle window resizing
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Start the game loop immediately
    this.gameLoop();
  }

  async loadBackgroundMusic() {
    try {
      const mp3Url = new URL('../assets/audio/background.mp3', import.meta.url);
      const response = await fetch(mp3Url);
      if (!response.ok) {
        throw new Error(`Failed to load MP3: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioManager.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioManager.musicBuffer = audioBuffer;
      await this.audioManager.startBackgroundMusic();
    } catch {
      // Failed to load background music - silent fail
    }
  }

  resizeCanvas() {
    const ratio = Math.min(
      window.innerWidth / 1280,
      window.innerHeight / 720
    );
    
    this.canvas.style.width = `${1280 * ratio}px`;
    this.canvas.style.height = `${720 * ratio}px`;

    // Center the canvas
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '50%';
    this.canvas.style.top = '50%';
    this.canvas.style.transform = 'translate(-50%, -50%)';
  }

  setupEventListeners() {
    const handleInteraction = (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      let x, y;
      
      if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      this.handleClick(x, y);
    };

    const handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleMouseMove(x, y);
    };

    // Mouse events
    this.canvas.addEventListener('click', handleInteraction);
    this.canvas.addEventListener('mousemove', handleMouseMove);
    
    // Touch events
    this.canvas.addEventListener('touchstart', handleInteraction, { passive: false });
    
    // Prevent default touch behaviors
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
  }

  handleClick(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (this.showingScores) {
      if (scaledX > 50 && scaledX < 150 && 
          scaledY > 50 && scaledY < 90) {
        this.showingScores = false;
        this.audioManager.playSound();
        return;
      }
    }

    this.buttons.forEach((button, index) => {
      const buttonY = 250 + index * 80;
      if (scaledX > 490 && scaledX < 790 && 
          scaledY > buttonY && scaledY < buttonY + 60 &&
          button.active) {
        
        this.audioManager.playSound()
          .then(() => {
            if (button.action === 'scores') {
              this.showingScores = true;
            } else {
              if (button.game === 'platformer') {
                this.active = false;
                
                import('../games/platformer/Game.js')
                  .then(module => {
                    new module.PlatformerGame(this.canvas, () => {
                      this.active = true;
                      this.gameLoop();
                    });
                  })
                  .catch(() => {
                    this.active = true;
                    this.gameLoop();
                  });
              } else if (button.game === 'racer') {
                this.active = false;
                
                import('../games/racer/Game.js')
                  .then(module => {
                    new module.RacerGame(this.canvas, () => {
                      this.active = true;
                      this.gameLoop();
                    });
                  })
                  .catch(() => {
                    this.active = true;
                    this.gameLoop();
                  });
              } else if (button.game === 'snake') {
                this.active = false;
                
                import('../games/snake/Game.js')
                  .then(module => {
                    new module.SnakeGame(this.canvas, () => {
                      this.active = true;
                      this.gameLoop();
                    });
                  })
                  .catch(() => {
                    this.active = true;
                    this.gameLoop();
                  });
              }
            }
          })
          .catch(() => {
            // Silent fail on audio/click handling errors
          });
      }
    });
  }

  update() {
    // Reset canvas transform when entering menu
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Calculate proper scale for menu
    const scaleX = this.canvas.width / 1280;
    const scaleY = this.canvas.height / 720;
    const scale = Math.max(scaleX, scaleY);
    
    const offsetX = (this.canvas.width - (1280 * scale)) / 2;
    const offsetY = (this.canvas.height - (720 * scale)) / 2;
    
    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(scale, scale);

    // Add any animation updates here
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 1280, 720);

    // Draw title with adjusted size for mobile
    const isMobile = window.innerWidth <= 768;
    this.ctx.font = isMobile ? 'bold 56px Arial' : 'bold 72px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    
    // Adjust title position for mobile
    const titleY = isMobile ? 180 : 150;
    this.ctx.fillText('NEON ARCADE', 640, titleY);
    this.ctx.strokeText('NEON ARCADE', 640, titleY);

    if (this.showingScores) {
      this.drawScores();
    } else {
      this.drawButtons();
    }
  }

  handleMouseMove(x, y) {
    // Scale coordinates to match canvas size
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Check if mouse is over any button
    let isOverButton = false;
    this.buttons.forEach((button, index) => {
      const buttonY = 250 + index * 80;
      if (scaledX > 490 && scaledX < 790 && 
          scaledY > buttonY && scaledY < buttonY + 60 &&
          button.active) {
        isOverButton = true;
      }
    });

    // Update cursor style
    this.canvas.style.cursor = isOverButton ? 'pointer' : 'default';
  }

  drawButtons() {
    // Determine if we're on mobile based on screen width
    const isMobile = window.innerWidth <= 768;
    
    this.buttons.forEach((button, index) => {
      // Adjust button dimensions for mobile
      const buttonWidth = isMobile ? 280 : 300;
      const buttonSpacing = isMobile ? 60 : 80;
      const y = isMobile ? 280 + index * buttonSpacing : 250 + index * buttonSpacing;
      const buttonHeight = 60;
      const buttonX = (1280 - buttonWidth) / 2;
      
      // Button background
      this.ctx.fillStyle = button.active ? '#1a1a1a' : '#0a0a0a';
      this.ctx.strokeStyle = button.active ? '#ff00ff' : '#444444';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(buttonX, y, buttonWidth, buttonHeight, 10);
      this.ctx.fill();
      this.ctx.stroke();

      // Button text - adjust font size for mobile
      this.ctx.font = isMobile ? '24px Arial' : 'bold 24px Arial';
      this.ctx.fillStyle = button.active ? '#fff' : '#666666';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(button.text, 640, y + buttonHeight/2 + 8);
      
      if (!button.active && button.game) {
        this.ctx.font = 'italic 16px Arial';
        this.ctx.fillStyle = '#666666';
        this.ctx.fillText('Coming Soon', 640, y + buttonHeight - 15);
      }
    });
  }

  gameLoop() {
    if (!this.active) return;
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  drawScores() {
    this.ctx.font = 'bold 36px Arial';
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('TOP SCORES', 640, 100);

    const scores = this.gameState.getAllScores();
    let yOffset = 150;

    for (const [game, gameScores] of Object.entries(scores)) {
      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillText(game.toUpperCase(), 640, yOffset);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '20px Arial';
      gameScores.forEach((score, index) => {
        this.ctx.fillText(`${index + 1}. ${score}`, 640, yOffset + 30 + index * 25);
      });
      
      yOffset += 180;
    }

    // Back button
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.strokeStyle = '#ff00ff';
    this.ctx.beginPath();
    this.ctx.roundRect(540, 600, 200, 50, 10);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText('Back', 640, 635);
  }

  cleanup() {
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
