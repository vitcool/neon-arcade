class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = new Map();
    this.isMuted = localStorage.getItem('neonArcade.isMuted') === 'true';
    this.currentMusic = null;
  }

  loadSound(key, url) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    this.sounds.set(key, audio);
  }

  loadMusic(key, url) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.3;
    this.music.set(key, audio);
  }

  playSound(key) {
    if (this.isMuted) return;
    const sound = this.sounds.get(key);
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  playMusic(key) {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    const music = this.music.get(key);
    if (music && !this.isMuted) {
      music.play();
      this.currentMusic = music;
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('neonArcade.isMuted', this.isMuted);

    if (this.isMuted) {
      this.stopMusic();
    } else if (this.currentMusic) {
      this.currentMusic.play();
    }

    return this.isMuted;
  }
}

export default AudioManager;
