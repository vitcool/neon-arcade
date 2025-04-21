import { drawGameOverScreen } from '../../utils/gameOver.js';
import { Background } from '../../utils/Background.js';

export class RacerGame {
    constructor(canvas, returnToMenu) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.returnToMenu = returnToMenu;

        // Game state setup
        this.score = 0;
        this.gameSpeed = 7;
        this.gameOver = false;
        this.gameOverOpacity = 0;
        this.textScale = 0;
        this.isRunning = true;  // Initialize isRunning flag

        // Set fixed canvas size
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        // Add CSS scaling
        const ratio = Math.min(
            window.innerWidth / this.canvas.width,
            window.innerHeight / this.canvas.height
        );
        this.canvas.style.width = `${this.canvas.width * ratio}px`;
        this.canvas.style.height = `${this.canvas.height * ratio}px`;

        // Player car setup
        this.player = {
            width: 80,
            height: 120,
            speed: 8,
            x: (1280 - 80) / 2,  // Center horizontally
            y: 720 - 120 - 20    // Position from bottom with 20px margin
        };

        // Controls setup
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false
        };

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        
        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.resizeCanvas);
        
        this.obstacles = [];
        this.background = new Background(this.canvas, {
            scrollDirection: 'vertical',
            speed: this.gameSpeed,
            gridSize: 80,  // Larger grid for better racing feel
            lineColor: '#1a1a1a',
            glowColor: '#0f0',
            glowStrength: 15
        });
        this.gameLoop();
    }

    handleKeyDown(e) {
        // Always handle ESC key first, regardless of game state
        if (e.key === 'Escape') {
            this.isRunning = false;  // Stop the game loop
            this.cleanup();
            this.returnToMenu();
            return;
        }

        // Handle game restart (space key or F1)
        if (this.gameOver && (e.key === ' ' || e.code === 'Space' || e.key === 'F1')) {
            this.restartGame();
            return;
        }

        // Handle movement keys
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = true;
        }
    }

    handleKeyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = false;
        }
    }

    createObstacle() {
        const width = Math.random() * 100 + 60; // Random width between 60 and 160
        const height = Math.random() * 100 + 80; // Random height between 80 and 180
        return {
            x: Math.random() * (1280 - width),
            y: -height,
            width: width,
            height: height,
            speed: this.gameSpeed
        };
    }

    endGame() {
        this.gameOver = true;
        // Don't immediately return to menu, show game over screen first
    }

    cleanup() {
        this.isRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('resize', this.resizeCanvas);
    }

    restartGame() {
        this.score = 0;
        this.gameSpeed = 7;
        this.gameOver = false;
        this.obstacles = [];
        this.player.x = this.canvas.width / 2;
        this.gameOverOpacity = 0;
        this.textScale = 0;
        // Reset speed of existing obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.speed = this.gameSpeed;
        });
        this.isRunning = true;
        this.gameLoop();
    }

    resizeCanvas() {
        const ratio = Math.min(
            window.innerWidth / this.canvas.width,
            window.innerHeight / this.canvas.height
        );
        this.canvas.style.width = `${this.canvas.width * ratio}px`;
        this.canvas.style.height = `${this.canvas.height * ratio}px`;
    }

    gameLoop() {
        // Check isRunning first before doing anything
        if (!this.isRunning) {
            return;  // Exit immediately if game should stop
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOver) {
            this.gameOverOpacity = Math.min(this.gameOverOpacity + 0.03, 0.8);
            this.textScale = Math.min(this.textScale + 0.1, 1);
            drawGameOverScreen(this.ctx, this.canvas, this.score, this.gameOverOpacity, this.textScale);
            requestAnimationFrame(() => this.gameLoop());
            return;
        }

        // Update background with positive speed for downward movement
        this.background.update(Math.abs(this.gameSpeed));
        this.background.draw(this.ctx);

        // Remove this since background handles it
        // this.ctx.fillStyle = '#000';
        // this.ctx.fillRect(0, 0, 1280, 720);

        // Draw debug boundary
        this.ctx.strokeStyle = '#333';
        this.ctx.strokeRect(0, 0, 1280, 720);

        // Move player with boundary checks
        if (this.keys.ArrowLeft && this.player.x > 0) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys.ArrowRight && this.player.x < 1280 - this.player.width) {
            this.player.x = Math.min(1280 - this.player.width, this.player.x + this.player.speed);
        }

        // Draw player car with glow effect
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#0f0';
        this.ctx.strokeStyle = '#0f0';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#0f0';
        
        // Draw player car
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        this.ctx.restore();

        // Handle obstacles
        if (Math.random() < 0.02) {
            this.obstacles.push(this.createObstacle());
        }

        // Update and draw obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.y += obstacle.speed;
            this.ctx.fillStyle = '#f00';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Check collision
            if (
                this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            ) {
                this.endGame();
                return false;
            }

            // Remove obstacles that are off screen
            if (obstacle.y > this.canvas.height) {
                this.score += 10;
                return false;
            }

            return true;
        });

        // Increase game speed
        if (this.score > 0 && this.score % 100 === 0) {
            this.gameSpeed += 0.5;
        }

        // Draw score with background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 50);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 45);

        // Only continue loop if game is still running
        if (this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}