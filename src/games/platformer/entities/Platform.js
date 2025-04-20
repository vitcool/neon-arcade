export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.platformColor = '#4444ff';
        this.outlineColor = '#2222aa';
    }

    draw(ctx) {
        // Draw platform as a simple rectangle with outline
        ctx.fillStyle = this.platformColor;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = 2;
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
