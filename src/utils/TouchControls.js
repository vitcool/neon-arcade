export class TouchControls {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            buttonSize: options.buttonSize || 80,
            buttonPadding: options.buttonPadding || 20,
            buttonColor: options.buttonColor || '#00ff00',
            buttonOpacity: options.buttonOpacity || 0.5,
            ...options
        };
        
        this.buttons = {};
        this.touchState = {};
        this.controlsContainer = null;  // Add this line
        this.createControls();
    }

    createControls() {
        const controlsContainer = document.createElement('div');
        this.controlsContainer = controlsContainer;  // Store reference
        controlsContainer.className = 'touch-controls mobile-only';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            pointer-events: none;
            z-index: 1000;
        `;

        // Movement controls (left side)
        const moveControls = document.createElement('div');
        moveControls.style.cssText = 'display: flex; gap: 10px; pointer-events: auto;';
        
        // Action controls (right side)
        const actionControls = document.createElement('div');
        actionControls.style.cssText = 'display: flex; gap: 10px; pointer-events: auto;';

        // Create movement buttons
        this.createButton('left', '←', moveControls);
        this.createButton('right', '→', moveControls);
        
        // Create action button
        this.createButton('jump', '↑', actionControls);

        controlsContainer.appendChild(moveControls);
        controlsContainer.appendChild(actionControls);
        this.container.appendChild(controlsContainer);

        this.bindEvents();
    }

    createButton(id, symbol, parent) {
        const button = document.createElement('div');
        button.id = `touch-${id}`;
        button.className = 'touch-button';
        button.innerHTML = symbol;
        button.style.cssText = `
            width: ${this.options.buttonSize}px;
            height: ${this.options.buttonSize}px;
            background: ${this.options.buttonColor};
            opacity: ${this.options.buttonOpacity};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${this.options.buttonSize / 2}px;
            color: white;
            text-shadow: 0 0 5px rgba(0,0,0,0.5);
            user-select: none;
            -webkit-user-select: none;
            transition: opacity 0.2s;
        `;
        
        this.buttons[id] = button;
        parent.appendChild(button);
    }

    bindEvents() {
        const handleStart = (e) => {
            e.preventDefault();
            const touches = e.type === 'touchstart' ? e.touches : [e];
            
            for (let touch of touches) {
                const button = this.findTouchedButton(touch.clientX, touch.clientY);
                if (button) {
                    const id = button.id.replace('touch-', '');
                    this.touchState[id] = true;
                    button.style.opacity = '1';
                    
                    if (this.options.onButtonPress) {
                        this.options.onButtonPress(id);
                    }
                }
            }
        };

        const handleEnd = (e) => {
            e.preventDefault();
            const touches = e.type === 'touchend' ? e.changedTouches : [e];
            
            for (let touch of touches) {
                const button = this.findTouchedButton(touch.clientX, touch.clientY);
                if (button) {
                    const id = button.id.replace('touch-', '');
                    this.touchState[id] = false;
                    button.style.opacity = String(this.options.buttonOpacity);
                    
                    if (this.options.onButtonRelease) {
                        this.options.onButtonRelease(id);
                    }
                }
            }
        };

        Object.values(this.buttons).forEach(button => {
            button.addEventListener('touchstart', handleStart, { passive: false });
            button.addEventListener('touchend', handleEnd, { passive: false });
            button.addEventListener('touchcancel', handleEnd, { passive: false });
        });
    }

    findTouchedButton(x, y) {
        return Object.values(this.buttons).find(button => {
            const rect = button.getBoundingClientRect();
            return x >= rect.left && x <= rect.right && 
                   y >= rect.top && y <= rect.bottom;
        });
    }

    isPressed(buttonId) {
        return this.touchState[buttonId] || false;
    }

    showControls() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'flex';
        }
    }

    hideControls() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'none';
        }
    }

    destroy() {
        const controls = this.container.querySelector('.touch-controls');
        if (controls) {
            controls.remove();
        }
    }
}