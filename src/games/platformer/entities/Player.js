export class Player {
    constructor(x, y) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = 32;
        this.height = 48;
        this.speed = 5;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.isJumping = false;
        this.direction = 1; // 1 for right, -1 for left
        // Colors for the player
        this.bodyColor = '#00ff00';
        this.outlineColor = '#008800';
    }

    reset(x, y) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
    }

    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.velocity.x = -this.speed;
                this.direction = -1;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.velocity.x = this.speed;
                this.direction = 1;
                break;
            case 'ArrowUp':
            case 'KeyW':
            case 'Space':
                if (!this.isJumping) {
                    this.velocity.y = this.jumpForce;
                    this.isJumping = true;
                }
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                if (this.velocity.x < 0) this.velocity.x = 0;
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (this.velocity.x > 0) this.velocity.x = 0;
                break;
        }
    }

    update(platforms) {
        // Horizontal movement
        this.position.x += this.velocity.x;

        // Vertical movement
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;

        // Platform collision
        platforms.forEach(platform => {
            if (this.position.y + this.height > platform.y &&
                this.position.y < platform.y + platform.height &&
                this.position.x + this.width > platform.x &&
                this.position.x < platform.x + platform.width) {
                
                if (this.velocity.y > 0) {
                    this.position.y = platform.y - this.height;
                    this.velocity.y = 0;
                    this.isJumping = false;
                }
            }
        });

        // No animation updates needed for simple shapes
    }

    collidesWith(entity) {
        return this.position.x < entity.position.x + entity.width &&
               this.position.x + this.width > entity.position.x &&
               this.position.y < entity.position.y + entity.height &&
               this.position.y + this.height > entity.position.y;
    }

    draw(ctx) {
        ctx.save();
        
        // Draw body
        ctx.fillStyle = this.bodyColor;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = 2;
        
        // Draw the main body (rectangle)
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        const eyeSize = 6;
        const eyeY = this.position.y + 12;
        let leftEyeX = this.position.x + 8;
        let rightEyeX = this.position.x + 20;
        
        if (this.direction === -1) {
            // Swap eyes when facing left
            [leftEyeX, rightEyeX] = [rightEyeX, leftEyeX];
        }
        
        ctx.fillRect(leftEyeX, eyeY, eyeSize, eyeSize);
        ctx.fillRect(rightEyeX, eyeY, eyeSize, eyeSize);
        
        ctx.restore();
    }
}
