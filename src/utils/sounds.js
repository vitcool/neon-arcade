// Simple audio synthesizer for generating sound effects
class SoundSynthesizer {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  createClickSound() {
    const duration = 0.08;
    const audioBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < audioBuffer.length; i++) {
      const t = i / audioBuffer.length;
      // Higher frequency with faster decay for a crisp click
      const click = Math.sin(2 * Math.PI * 2000 * t) * Math.exp(-30 * t);
      // Add a bit of lower frequency for body
      const thump = Math.sin(2 * Math.PI * 300 * t) * Math.exp(-50 * t) * 0.5;
      channelData[i] = (click + thump) * 0.7; // Reduce overall volume
    }
    
    return audioBuffer;
  }

  createSimpleSynth(frequency, duration) {
    const audioBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Create a pleasant chord
    const frequencies = [
      frequency,           // root
      frequency * 5/4,     // major third
      frequency * 3/2,     // perfect fifth
      frequency * 2        // octave
    ];
    
    for (let i = 0; i < audioBuffer.length; i++) {
      const t = i / this.audioContext.sampleRate;
      let sample = 0;
      
      // Combine frequencies with different amplitudes
      frequencies.forEach((freq, index) => {
        const amplitude = 0.25 / (index + 1); // Decrease amplitude for higher harmonics
        sample += Math.sin(2 * Math.PI * freq * t) * amplitude;
      });
      
      // Apply envelope
      const attackTime = 0.1;
      const releaseTime = duration - 0.2;
      const envelope = t < attackTime ? t / attackTime :
                      t > releaseTime ? 1 - (t - releaseTime) / (duration - releaseTime) :
                      1;
      
      channelData[i] = sample * envelope * 0.3; // Reduce overall volume
    }
    
    return audioBuffer;
  }
}

export { SoundSynthesizer };
