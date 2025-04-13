export class MainMenu {
  constructor(canvas, ctx, audioManager, gameState) {
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
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleClick(e.touches[0]);
    });
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scale = this.canvas.width / 1280;
    const scaledX = x / scale;
    const scaledY = y / scale;

    if (this.showingScores) {
      if (scaledY > 600) {
        this.showingScores = false;
        this.audioManager.playSound('click');
      }
      return;
    }

    this.buttons.forEach((button, index) => {
      const buttonY = 250 + index * 80;
      if (scaledX > 490 && scaledX < 790 && 
          scaledY > buttonY && scaledY < buttonY + 60) {
        this.audioManager.playSound('click');
        if (button.action === 'scores') {
          this.showingScores = true;
        } else {
          // TODO: Start the selected game
          console.log(`Starting ${button.game}`);
        }
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
