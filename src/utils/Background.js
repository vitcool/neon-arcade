export class Background {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            scrollDirection: options.scrollDirection || 'vertical', // 'vertical' or 'horizontal'
            speed: options.speed || 2,
            gridSize: options.gridSize || 40,
            lineColor: options.lineColor || '#1a1a1a',
            backgroundColor: options.backgroundColor || '#000000',
            glowColor: options.glowColor || '#0f0',
            glowStrength: options.glowStrength || 10
        };

        this.offset = 0;
    }

    update(speed = null) {
        if (speed !== null) {
            this.offset += speed;
        } else {
            this.offset += this.options.speed;
        }

        // Reset offset when it exceeds grid size
        if (Math.abs(this.offset) >= this.options.gridSize) {
            this.offset = 0;
        }
    }

    draw(ctx) {
        // Fill background
        ctx.fillStyle = this.options.backgroundColor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set up line style
        ctx.strokeStyle = this.options.lineColor;
        ctx.lineWidth = 1;
        ctx.shadowColor = this.options.glowColor;
        ctx.shadowBlur = this.options.glowStrength;

        // Draw grid
        const drawLine = (x1, y1, x2, y2) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };

        if (this.options.scrollDirection === 'vertical') {
            // Draw vertical lines (no offset - fixed position)
            for (let x = 0; x <= this.canvas.width; x += this.options.gridSize) {
                drawLine(x, 0, x, this.canvas.height);
            }
            // Draw horizontal lines (with offset for scrolling)
            for (let y = -this.options.gridSize + this.offset; y <= this.canvas.height + this.options.gridSize; y += this.options.gridSize) {
                drawLine(0, y, this.canvas.width, y);
            }
        } else {
            // Vertical lines with offset
            for (let x = this.offset; x <= this.canvas.width; x += this.options.gridSize) {
                drawLine(x, 0, x, this.canvas.height);
            }
            // Horizontal lines
            for (let y = 0; y <= this.canvas.height; y += this.options.gridSize) {
                drawLine(0, y, this.canvas.width, y);
            }
        }
    }
}
