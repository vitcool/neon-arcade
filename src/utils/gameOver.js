export function drawGameOverScreen(ctx, canvas, score, gameOverOpacity = 0.8, textScale = 1) {
    // Draw gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.height
    );
    gradient.addColorStop(0, `rgba(255, 0, 100, ${gameOverOpacity})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${gameOverOpacity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw glowing "Game Over" text with stronger glow
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 - 50);
    ctx.scale(textScale, textScale);
    
    // Add stronger glow effect
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText('Game Over!', 0, 0);
    ctx.fillText('Game Over!', 0, 0);
    ctx.restore();

    // Enhance score display
    ctx.shadowBlur = 15;
    ctx.font = '48px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
    
    // Make instruction text larger and more visible
    ctx.shadowBlur = 10;
    ctx.font = '32px Arial';
    ctx.fillStyle = '#0f0';
    ctx.fillText('Press SPACE to restart', canvas.width/2, canvas.height/2 + 100);
    ctx.fillStyle = '#ff0';
    ctx.fillText('Press ESC to return to menu', canvas.width/2, canvas.height/2 + 150);
}