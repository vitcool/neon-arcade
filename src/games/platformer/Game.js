import { Player } from './entities/Player';
import { Platform } from './entities/Platform';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Background } from '../../utils/Background.js';
import { drawGameOverScreen } from '../../utils/gameOver.js';
import { TouchControls } from '../../utils/TouchControls.js';

export class PlatformerGame {
    constructor(canvas, onGameEnd) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.score = 0;
        this.gameOver = false;
        this.onGameEnd = onGameEnd;
        this.isRunning = true;
        this.currentLevel = 1;
        this.levelTransition = false;
        this.transitionTimer = 0;
        this.levels = this.defineLevels();
        this.init();
        
        // Add touch event listener for game over buttons
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
    }

    defineLevels() {
        return {
            1: {
                platforms: [
                    [0, 500, 300, 20],
                    [400, 400, 200, 20],
                    [700, 300, 200, 20],
                    [300, 200, 200, 20]
                ],
                enemies: [
                    [450, 370, 100],
                    [750, 270, 100]
                ],
                coins: [
                    [500, 350],
                    [800, 250],
                    [350, 150]
                ],
                playerStart: [100, 300]
            },
            2: {
                platforms: [
                    [0, 600, 200, 20],
                    [300, 500, 200, 20],
                    [600, 400, 200, 20],
                    [900, 300, 200, 20],
                    [600, 200, 200, 20],
                    [300, 100, 200, 20]
                ],
                enemies: [
                    [350, 470, 100],
                    [650, 370, 100],
                    [650, 170, 100]
                ],
                coins: [
                    [400, 450],
                    [700, 350],
                    [950, 250],
                    [700, 150],
                    [400, 50]
                ],
                playerStart: [50, 500]
            }
        };
    }

    init() {
        // Set canvas size to match main game dimensions
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        // Scale the game to maintain aspect ratio
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.background = new Background(this.canvas, {
            scrollDirection: 'horizontal',
            speed: 0,  // Will be controlled by player movement
            gridSize: 60,
            lineColor: '#1a1a1a',
            glowColor: '#00ff00',
            glowStrength: 10
        });

        // Initialize touch controls
        this.initTouchControls();

        this.loadLevel(this.currentLevel);

        this.bindControls();
        this.gameLoop();

        // Add mouse event listener for game over buttons
        this.canvas.addEventListener('mousedown', this.handleMouse.bind(this));
    }

    resizeCanvas() {
        const ratio = Math.min(
            window.innerWidth / this.canvas.width,
            window.innerHeight / this.canvas.height
        );
        
        this.canvas.style.width = `${this.canvas.width * ratio}px`;
        this.canvas.style.height = `${this.canvas.height * ratio}px`;

        // Center the canvas
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
    }

    initTouchControls() {
        const container = this.canvas.parentElement;
        
        this.touchControls = new TouchControls(container, {
            buttonSize: 70,
            buttonColor: '#00ff00',
            buttonOpacity: 0.6,
            onButtonPress: (buttonId) => {
                switch (buttonId) {
                    case 'left':
                        this.player.velocity.x = -this.player.speed;
                        this.player.direction = -1;
                        break;
                    case 'right':
                        this.player.velocity.x = this.player.speed;
                        this.player.direction = 1;
                        break;
                    case 'jump':
                        if (!this.player.isJumping) {
                            this.player.velocity.y = this.player.jumpForce;
                            this.player.isJumping = true;
                        }
                        break;
                }
            },
            onButtonRelease: (buttonId) => {
                switch (buttonId) {
                    case 'left':
                        if (this.player.velocity.x < 0) this.player.velocity.x = 0;
                        break;
                    case 'right':
                        if (this.player.velocity.x > 0) this.player.velocity.x = 0;
                        break;
                }
            }
        });
    }

    bindControls() {
        // Add touch event for game over screen
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.gameOver) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // Check if touch is in the restart or menu area
                if (y > this.canvas.height * 0.6) {
                    if (x < this.canvas.width * 0.5) {
                        this.restart();
                    } else {
                        this.returnToMainMenu();
                    }
                }
            }
        });

        // Keep existing keyboard controls
        window.addEventListener('keydown', (e) => {
            if (this.gameOver) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.restart();
                    return;
                } else if (e.code === 'Escape') {
                    this.returnToMainMenu();
                    return;
                }
            }
            this.player.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.player.handleKeyUp(e);
        });
    }

    restart() {
        this.score = 0;
        this.gameOver = false;
        this.playerWon = false;
        this.currentLevel = 1;
        this.levelTransition = false;
        this.transitionTimer = 0;
        this.loadLevel(this.currentLevel);
        
        // Reinitialize touch controls
        if (this.touchControls) {
            this.touchControls.destroy();
        }
        this.initTouchControls();
    }

    returnToMainMenu() {
        this.isRunning = false;
        if (this.onGameEnd) {
            this.onGameEnd();
        }
    }

    loadLevel(level) {
        const levelData = this.levels[level];
        if (!levelData) return false;

        // Create platforms
        this.platforms = levelData.platforms.map(([x, y, width, height]) => 
            new Platform(x, y, width, height)
        );

        // Create enemies
        this.enemies = levelData.enemies.map(([x, y, patrolDistance]) => 
            new Enemy(x, y, patrolDistance)
        );

        // Create coins
        this.coins = levelData.coins.map(([x, y]) => 
            new Coin(x, y)
        );

        // Set player position
        const [playerX, playerY] = levelData.playerStart;
        this.player = new Player(playerX, playerY);

        return true;
    }

    update() {
        if (this.gameOver) {
            if (this.touchControls) {
                this.touchControls.hideControls();
            }
            return;
        }

        if (this.levelTransition) {
            if (this.touchControls) {
                this.touchControls.hideControls();
            }
            this.transitionTimer++;
            if (this.transitionTimer > 60) { // 1 second at 60 FPS
                this.levelTransition = false;
                this.transitionTimer = 0;
                if (!this.loadLevel(this.currentLevel)) {
                    // No more levels, player won the game
                    this.gameOver = true;
                    this.playerWon = true;
                }
            }
            return;
        }

        if (this.touchControls) {
            this.touchControls.showControls();
        }

        this.player.update(this.platforms);
        this.enemies.forEach(enemy => enemy.update());
        this.background.update(-this.player.velocity.x * 0.5); // Scroll based on player movement

        // Check coin collisions
        this.coins = this.coins.filter(coin => {
            if (this.player.collidesWith(coin)) {
                this.score += 10;
                return false;
            }
            return true;
        });

        // Check if all coins are collected
        if (this.coins.length === 0) {
            this.currentLevel++;
            this.levelTransition = true;
        }

        // Check enemy collisions
        if (this.enemies.some(enemy => this.player.collidesWith(enemy))) {
            this.gameOver = true;
        }

        // Check if player fell off screen
        if (this.player.position.y > this.canvas.height) {
            this.gameOver = true;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.background.draw(this.ctx);
        this.platforms.forEach(platform => platform.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.coins.forEach(coin => coin.draw(this.ctx));
        this.player.draw(this.ctx);

        // Draw score
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);

        if (this.gameOver) {
            drawGameOverScreen(this.ctx, this.canvas, this.score);
        } else if (this.levelTransition) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Level ${this.currentLevel}`, this.canvas.width/2, this.canvas.height/2);
        }
    }

    gameLoop() {
        if (!this.isRunning) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
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
                this.restart();
            }
            // Main menu button (right)
            else if (x >= this.canvas.width/2 + buttonSpacing/2 && 
                     x <= this.canvas.width/2 + buttonWidth + buttonSpacing/2) {
                this.returnToMainMenu();
            }
        }
    }

    handleMouse(e) {
        if (!this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const scale = rect.width / this.canvas.width;

        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        // Button dimensions from gameOver.js
        const buttonY = this.canvas.height * 0.7;
        const buttonHeight = 80;
        const buttonWidth = 300;
        const buttonSpacing = 40;

        // Check if mouse is within button area
        if (y >= buttonY && y <= buttonY + buttonHeight) {
            // Restart button (left)
            if (x >= this.canvas.width/2 - buttonWidth - buttonSpacing/2 && 
                x <= this.canvas.width/2 - buttonSpacing/2) {
                this.restart();
            }
            // Main menu button (right)
            else if (x >= this.canvas.width/2 + buttonSpacing/2 && 
                     x <= this.canvas.width/2 + buttonWidth + buttonSpacing/2) {
                this.returnToMainMenu();
            }
        }
    }

    cleanup() {
        this.isRunning = false;
        if (this.touchControls) {
            this.touchControls.destroy();
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
        this.canvas.removeEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.removeEventListener('mousedown', this.handleMouse.bind(this));
    }
}
