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

    // Draw game over text with glow
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/3);
    ctx.scale(textScale, textScale);
    
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('Game Over!', 0, 0);
    ctx.fillText('Game Over!', 0, 0);
    ctx.restore();

    // Draw score with glow
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.restore();

    // Draw buttons
    const buttonWidth = 300;
    const buttonHeight = 80;
    const buttonSpacing = 40;
    const buttonsY = canvas.height * 0.7;

    // Helper function to draw a button
    const drawButton = (x, y, width, height, text, isHovered = false) => {
        ctx.save();
        // Button glow
        ctx.shadowColor = isHovered ? '#00ff00' : '#003300';
        ctx.shadowBlur = 20;
        
        // Button background
        ctx.fillStyle = isHovered ? '#003300' : '#001100';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        
        // Draw rounded rectangle
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 10);
        ctx.fill();
        ctx.stroke();
        
        // Button text
        ctx.fillStyle = '#00ff00';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width/2, y + height/2);
        ctx.restore();
    };

    // Draw Restart button
    drawButton(
        canvas.width/2 - buttonWidth - buttonSpacing/2,
        buttonsY,
        buttonWidth,
        buttonHeight,
        'Restart Game'
    );

    // Draw Main Menu button
    drawButton(
        canvas.width/2 + buttonSpacing/2,
        buttonsY,
        buttonWidth,
        buttonHeight,
        'Back to Main Menu'
    );
}