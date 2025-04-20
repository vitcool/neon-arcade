export class Enemy {
    constructor(x, y, patrolDistance) {
        this.position = { x, y };
        this.width = 32;
        this.height = 32;
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.speed = 2;
        this.direction = 1;
        // Colors for the enemy
        this.bodyColor = '#ff0000';
        this.outlineColor = '#880000';
    }

    update() {
        this.position.x += this.speed * this.direction;

        // Change direction when reaching patrol limits
        if (Math.abs(this.position.x - this.startX) >= this.patrolDistance) {
            this.direction *= -1;
        }

        // No animation needed for simple shapes
    }

    draw(ctx) {
        ctx.save();
        
        // Draw body
        ctx.fillStyle = this.bodyColor;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = 2;
        
        // Draw the main body (circle)
        ctx.beginPath();
        ctx.arc(
            this.position.x + this.width/2,
            this.position.y + this.height/2,
            this.width/2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
        
        // Draw eyes
        ctx.fillStyle = 'white';
        const eyeSize = 6;
        const eyeY = this.position.y + this.height/2 - eyeSize/2;
        let leftEyeX = this.position.x + this.width/3 - eyeSize/2;
        let rightEyeX = this.position.x + (this.width * 2/3) - eyeSize/2;
        
        if (this.direction === -1) {
            // Swap eyes when moving left
            [leftEyeX, rightEyeX] = [rightEyeX, leftEyeX];
        }
        
        ctx.fillRect(leftEyeX, eyeY, eyeSize, eyeSize);
        ctx.fillRect(rightEyeX, eyeY, eyeSize, eyeSize);
        
        ctx.restore();
    }
}
