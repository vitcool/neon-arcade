export class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.speed = 0.5;
        this.colors = {
            top: '#000033',
            middle: '#000066',
            bottom: '#000044'
        };
        this.stars = this.generateStars(100);
    }

    update(playerVelocityX) {
        // Parallax scrolling effect
        if (playerVelocityX !== 0) {
            this.x -= playerVelocityX * this.speed;
        }

        // Loop the background
        if (this.x <= -this.width) this.x = 0;
        if (this.x > 0) this.x = -this.width;
    }

    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                brightness: Math.random()
            });
        }
        return stars;
    }

    draw(ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, this.colors.top);
        gradient.addColorStop(0.5, this.colors.middle);
        gradient.addColorStop(1, this.colors.bottom);
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw stars with parallax effect
        ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            const x = ((star.x + this.x * star.brightness) % this.width + this.width) % this.width;
            ctx.globalAlpha = 0.3 + star.brightness * 0.7;
            ctx.beginPath();
            ctx.arc(x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;
    }
}
