class AudioManager {
  constructor() {
    // Initialize audio system
    
    // Start muted by default
    this.isMuted = true;
    // Start with audio muted

    // Initialize Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create gain node (start with 0 gain since we're muted)
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0;
    // Initialize gain node with zero volume

    // Create click sound
    this.clickSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAP8=');
    
    // Create background music source
    this.musicSource = null;
    this.musicBuffer = null;

    // Resume audio context on user interaction
    document.addEventListener('click', async () => {
      try {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
          // Audio context is now active
          // Start music after context is resumed
          if (this.musicBuffer && !this.isMuted) {
            await this.startBackgroundMusic();
          }
        }
      } catch (error) {
        // Failed to resume audio context
      }
    });
  }

  async playSound() {
    try {
      if (this.isMuted) {
        // Skip playing sound while muted
        return Promise.resolve();
      }

      const source = this.audioContext.createBufferSource();
      const response = await fetch('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAP8=');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      source.buffer = audioBuffer;
      source.connect(this.gainNode);
      source.start();
    } catch (error) {
      // Failed to play sound effect
    }
  }

  async startBackgroundMusic() {
    try {
      // Attempt to start background music
      
      // Check if context is ready
      if (this.audioContext.state === 'suspended') {
        // Wait for user interaction to start audio
        return;
      }

      if (!this.musicBuffer) {
        // No music loaded yet
        return;
      }

      // Stop any existing music
      if (this.musicSource) {
        try {
          this.musicSource.stop();
          this.musicSource.disconnect();
        } catch (e) {
          // Ignore errors from already stopped sources
        }
      }

      // Create and setup new source
      this.musicSource = this.audioContext.createBufferSource();
      this.musicSource.buffer = this.musicBuffer;
      this.musicSource.loop = true;
      this.musicSource.connect(this.gainNode);
      
      // Start playing
      if (!this.isMuted) {
        this.musicSource.start(0);
        // Music is now playing
      } else {
        // Music loaded but muted
      }
    } catch (error) {
      // Failed to start background music
    }
  }

  async toggleMute() {
    this.isMuted = !this.isMuted;
    // Update mute state

    try {
      // If unmuting and context is suspended, resume it
      if (!this.isMuted && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        // Audio context is now active
      }

      // Update gain (use linear ramp for smooth transition)
      const targetGain = this.isMuted ? 0 : 1;
      const currentTime = this.audioContext.currentTime;
      
      // Use linear ramp for smoother transition
      this.gainNode.gain.cancelScheduledValues(currentTime);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
      this.gainNode.gain.linearRampToValueAtTime(targetGain, currentTime + 0.1);
      // Smoothly transition volume

      // Start music if unmuting and context is running
      if (!this.isMuted && 
          this.audioContext.state === 'running' && 
          this.musicBuffer && 
          (!this.musicSource || !this.musicSource.playbackState)) {
        await this.startBackgroundMusic();
      }
    } catch (error) {
      console.error('Error in toggleMute:', error);
    }

    return this.isMuted;
  }
}

export default AudioManager;
