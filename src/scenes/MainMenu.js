export class MainMenu {
  constructor(canvas, ctx, audioManager, gameState) {
    // Initialize MainMenu scene
    this.canvas = canvas;
    this.ctx = ctx;
    this.audioManager = audioManager;
    this.gameState = gameState;
    
    this.buttons = [
      { text: 'Start Platformer', game: 'platformer' },
      { text: 'Start Racer', game: 'racer' },
      { text: 'Start Puzzle', game: 'puzzle' },
      { text: 'Top Scores', action: 'scores' }
    ];
    
    this.showingScores = false;
    this.setupEventListeners();
    
    // Load and start background music
    this.loadBackgroundMusic();
  }

  async loadBackgroundMusic() {
    try {
      // Use URL module to get the MP3 path
      const mp3Url = new URL('../assets/audio/background.mp3', import.meta.url);
      // Load audio from MP3 URL
      
      // Load the audio data
      const response = await fetch(mp3Url);
      if (!response.ok) {
        throw new Error(`Failed to load MP3: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      // MP3 data loaded successfully
      
      // Decode the audio data
      const audioBuffer = await this.audioManager.audioContext.decodeAudioData(
        arrayBuffer,
        (decoded) => {
          // Audio decoded successfully
        },
        (error) => {
          // Failed to decode audio
        }
      );
      
      this.audioManager.musicBuffer = audioBuffer;
      // Background music ready to play
      
      // Start playing if not muted
      await this.audioManager.startBackgroundMusic();
    } catch (error) {
      // Failed to load background music
    }
  }



  setupEventListeners() {
    const handleInteraction = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleClick(x, y);
    };

    this.canvas.addEventListener('click', handleInteraction);
    
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const touch = e.touches[0];
      handleInteraction(touch);
    });
  }

  handleClick(x, y) {
    // Handle click event
    
    // Scale coordinates to match canvas size
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    
    // Convert to scaled canvas coordinates

    // Handle back button in scores view
    if (this.showingScores) {
      if (scaledX > 50 && scaledX < 150 && 
          scaledY > 50 && scaledY < 90) {
        console.log('Back button clicked');
        this.showingScores = false;
        this.audioManager.playSound();
        return;
      }
    }

    // Check button clicks
    this.buttons.forEach((button, index) => {
      const buttonY = 250 + index * 80;
      if (scaledX > 490 && scaledX < 790 && 
          scaledY > buttonY && scaledY < buttonY + 60) {
        console.log('Button clicked:', button.text);
        
        // Play sound first
        this.audioManager.playSound()
          .then(() => {
            console.log('Sound played, handling action for:', button.text);
            if (button.action === 'scores') {
              this.showingScores = true;
            } else {
              console.log(`Starting game: ${button.game}`);
            }
          })
          .catch(error => {
            console.error('Error in click handling:', error);
          });
      }
    });
  }

  update() {
    // Add any animation updates here
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 1280, 720);

    // Draw title
    this.ctx.font = 'bold 72px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.fillText('NEON ARCADE', 640, 150);
    this.ctx.strokeText('NEON ARCADE', 640, 150);

    if (this.showingScores) {
      this.drawScores();
    } else {
      this.drawButtons();
    }
  }

  drawButtons() {
    this.buttons.forEach((button, index) => {
      const y = 250 + index * 80;
      
      // Button background
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.strokeStyle = '#ff00ff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(490, y, 300, 60, 10);
      this.ctx.fill();
      this.ctx.stroke();

      // Button text
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(button.text, 640, y + 38);
    });
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
}
