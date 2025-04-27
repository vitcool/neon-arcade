import { Background } from '../../utils/Background.js';
import { drawGameOverScreen } from '../../utils/gameOver.js';

export class SnakeGame {
    constructor(canvas, returnToMenu) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.returnToMenu = returnToMenu;

        // Set fixed canvas size (same as other games)
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        // Setup proper canvas scaling
        this.resizeCanvas = this.resizeCanvas.bind(this);
        window.addEventListener('resize', this.resizeCanvas);
        this.resizeCanvas();
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.isRunning = true;
        this.gameOverOpacity = 0;
        this.textScale = 0;
        
        // Grid settings
        this.gridSize = 40; // Size of each grid cell
        this.cols = Math.floor(this.canvas.width / this.gridSize);
        this.rows = Math.floor(this.canvas.height / this.gridSize);

        // Snake initialization
        this.snake = [
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }
        ];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        
        // Food initialization
        this.food = this.spawnFood();

        // Game speed (update interval in milliseconds)
        this.updateInterval = 150;
        this.lastUpdate = 0;

        // Initialize background
        this.background = new Background(this.canvas, {
            scrollDirection: 'vertical',
            speed: 0.5,
            gridSize: this.gridSize,
            lineColor: '#1a1a1a',
            glowColor: '#0f0',
            glowStrength: 15
        });

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.handleKeyDown);

        // Add touch event listener for game over buttons
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));

        // Start game loop
        this.gameLoop();
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.isRunning = false;
            this.cleanup();
            this.returnToMenu();
            return;
        }

        // Handle game restart
        if (this.gameOver && (e.code === 'Space' || e.key === 'F1')) {
            this.restartGame();
            return;
        }

        // Handle direction changes
        const newDirection = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }
        }[e.key];

        if (newDirection) {
            // Prevent 180-degree turns
            if (!(this.direction.x + newDirection.x === 0 && 
                  this.direction.y + newDirection.y === 0)) {
                this.nextDirection = newDirection;
            }
        }
    }

    handleTouch(e) {
        if (!this.gameOver) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scale = rect.width / this.canvas.width;
        
        const x = (touch.clientX - rect.left) / scale;
        const y = (touch.clientY - rect.top) / scale;
        
        // Button dimensions from gameOver.js
        const buttonY = this.canvas.height * 0.7;
        const buttonHeight = 80;
        const buttonWidth = 300;
        const buttonSpacing = 40;
        
        // Check if touch is within button area
        if (y >= buttonY && y <= buttonY + buttonHeight) {
            // Restart button (left)
            if (x >= this.canvas.width/2 - buttonWidth - buttonSpacing/2 && 
                x <= this.canvas.width/2 - buttonSpacing/2) {
                this.restartGame();
            }
            // Main menu button (right)
            else if (x >= this.canvas.width/2 + buttonSpacing/2 && 
                     x <= this.canvas.width/2 + buttonWidth + buttonSpacing/2) {
                this.cleanup();
                this.returnToMenu();
            }
        }
    }

    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        ));
        return newFood;
    }

    update(timestamp) {
        if (this.gameOver) return;

        // Update only at fixed intervals
        if (timestamp - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = timestamp;

        // Update snake position
        const head = { ...this.snake[0] };
        
        // Apply next direction
        this.direction = this.nextDirection;
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check for collisions with walls
        if (head.x < 0 || head.x >= this.cols || 
            head.y < 0 || head.y >= this.rows) {
            this.endGame();
            return;
        }

        // Check for collisions with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check for food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.spawnFood();
            // Speed up the game slightly
            this.updateInterval = Math.max(50, this.updateInterval - 2);
        } else {
            // Remove tail if no food was eaten
            this.snake.pop();
        }

        // Update background
        this.background.update();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.background.draw(this.ctx);

        // Draw food with glow effect
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        this.ctx.restore();

        // Draw snake with glow effect
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#0f0';
        this.ctx.fillStyle = '#0f0';
        this.ctx.strokeStyle = '#008800';
        this.ctx.lineWidth = 2;

        this.snake.forEach((segment, index) => {
            // Draw segment
            this.ctx.fillRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
            this.ctx.strokeRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );

            // Draw eyes on head
            if (index === 0) {
                this.ctx.fillStyle = '#fff';
                const eyeSize = 6;
                const eyeOffset = 10;
                const x = segment.x * this.gridSize;
                const y = segment.y * this.gridSize;

                // Position eyes based on direction
                if (this.direction.x !== 0) {
                    // Horizontal movement
                    this.ctx.fillRect(
                        x + (this.direction.x > 0 ? this.gridSize - eyeOffset - eyeSize : eyeOffset),
                        y + eyeOffset,
                        eyeSize,
                        eyeSize
                    );
                    this.ctx.fillRect(
                        x + (this.direction.x > 0 ? this.gridSize - eyeOffset - eyeSize : eyeOffset),
                        y + this.gridSize - eyeOffset - eyeSize,
                        eyeSize,
                        eyeSize
                    );
                } else {
                    // Vertical movement
                    this.ctx.fillRect(
                        x + eyeOffset,
                        y + (this.direction.y > 0 ? this.gridSize - eyeOffset - eyeSize : eyeOffset),
                        eyeSize,
                        eyeSize
                    );
                    this.ctx.fillRect(
                        x + this.gridSize - eyeOffset - eyeSize,
                        y + (this.direction.y > 0 ? this.gridSize - eyeOffset - eyeSize : eyeOffset),
                        eyeSize,
                        eyeSize
                    );
                }
            }
        });
        this.ctx.restore();

        // Draw score
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 50);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 45);

        // Draw game over screen if game is over
        if (this.gameOver) {
            this.gameOverOpacity = Math.min(this.gameOverOpacity + 0.03, 0.8);
            this.textScale = Math.min(this.textScale + 0.1, 1);
            drawGameOverScreen(this.ctx, this.canvas, this.score, this.gameOverOpacity, this.textScale);
        }
    }

    endGame() {
        this.gameOver = true;
    }

    restartGame() {
        this.score = 0;
        this.gameOver = false;
        this.gameOverOpacity = 0;
        this.textScale = 0;
        this.updateInterval = 150;
        this.snake = [
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.spawnFood();
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('touchstart', this.handleTouch.bind(this));
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        this.update(timestamp);
        this.draw();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    resizeCanvas() {
        const windowRatio = window.innerWidth / window.innerHeight;
        const gameRatio = this.canvas.width / this.canvas.height;
        let scale;

        if (windowRatio < gameRatio) {
            // Window is narrower than game ratio - fit to width
            scale = (window.innerWidth * 0.95) / this.canvas.width;
        } else {
            // Window is wider than game ratio - fit to height
            scale = (window.innerHeight * 0.95) / this.canvas.height;
        }
        
        // Add small margin by scaling down slightly
        this.canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}