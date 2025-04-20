export class Coin {
    constructor(x, y) {
        this.position = { x, y };
        this.width = 24;
        this.height = 24;
        this.angle = 0;
        this.rotationSpeed = 0.1;
        this.coinColor = '#ffd700';
        this.outlineColor = '#daa520';
    }

    update() {
        // Rotate the coin
        this.angle += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        
        // Move to coin's center for rotation
        ctx.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        ctx.rotate(this.angle);
        
        // Draw coin as an ellipse (to simulate perspective)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2, (this.height/2) * Math.abs(Math.cos(this.angle)), 0, 0, Math.PI * 2);
        ctx.fillStyle = this.coinColor;
        ctx.fill();
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}
