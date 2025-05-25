class AudioManager {
  constructor() {
    this.currentMusic = null;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isMuted = false;
    this.currentScene = null;
    this.nativeAudio = null;
    this.pendingMusic = null;
    this.userHasInteracted = false;
    
    this.setupUserInteractionListener();
  }

  setupUserInteractionListener() {
    const handleFirstInteraction = () => {
      this.userHasInteracted = true;
      
      if (this.pendingMusic) {
        this.playMusic(this.pendingMusic.audioKey, this.pendingMusic.loop, this.pendingMusic.volume);
        this.pendingMusic = null;
      }
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
  }

  init(scene) {
    this.currentScene = scene;
  }

  stopAllMusic() {
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }

    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
        if (this.currentMusic.destroy) {
          this.currentMusic.destroy();
        }
      } catch (e) {
        console.warn('Error al destruir música Phaser:', e);
      }
      this.currentMusic = null;
    }

    if (this.nativeAudio) {
      try {
        this.nativeAudio.pause();
        this.nativeAudio.loop = false;
        this.nativeAudio.currentTime = 0;
        this.nativeAudio.src = '';
        this.nativeAudio.load();
      } catch (e) {
        console.warn('Error al limpiar audio nativo:', e);
      }
      this.nativeAudio = null;
    }
  }

  playMusic(audioKey, loop = true, volume = null) {
    // Si el usuario no ha interactuado aún, guardar la música para reproducir después
    if (!this.userHasInteracted) {
      this.pendingMusic = { audioKey, loop, volume };
      console.log(`Música ${audioKey} programada para reproducir después de la interacción del usuario`);
      return;
    }
    // Detener música actual primero
    this.stopAllMusic();

    // Si es un menú, reproducir solo 10 segundos con fade out
    const isMenuMusic = ['menuPrincipal', 'menuDeath'].includes(audioKey); // menuVictory eliminado
    if (isMenuMusic) {
      loop = false; // Forzar no repetir música de menú
      let fadeDuration = 1500;
      let playDuration = 19500;
      let fadeStep = 100;
      let fadeSteps = Math.floor(fadeDuration / fadeStep);
      let originalVolume = volume || this.musicVolume;
      let fadeOutFn = null;

      if (this.currentScene && this.currentScene.sound && this.currentScene.cache && this.currentScene.cache.audio && this.currentScene.cache.audio.exists(audioKey)) {
        try {
          this.currentMusic = this.currentScene.sound.add(audioKey, {
            volume: originalVolume,
            loop: loop
          });
          if (!this.isMuted) {
            this.currentMusic.play();
          }
          this.musicTimeout = setTimeout(() => {
            let step = 0;
            fadeOutFn = setInterval(() => {
              if (this.currentMusic && step < fadeSteps) {
                let v = originalVolume * (1 - step / fadeSteps);
                this.currentMusic.setVolume(Math.max(0, v));
                step++;
              } else {
                clearInterval(fadeOutFn);
                this.stopAllMusic();
              }
            }, fadeStep);
          }, playDuration);
        } catch (error) {
          console.error(`Error reproduciendo música con Phaser ${audioKey}:`, error);
        }
        return;
      }

      this.playNativeAudio(audioKey, loop, originalVolume);
      if (this.nativeAudio) {
        this.musicTimeout = setTimeout(() => {
          let step = 0;
          fadeOutFn = setInterval(() => {
            if (this.nativeAudio && step < fadeSteps) {
              let v = originalVolume * (1 - step / fadeSteps);
              this.nativeAudio.volume = Math.max(0, v);
              step++;
            } else {
              clearInterval(fadeOutFn);
              this.stopAllMusic();
            }
          }, fadeStep);
        }, playDuration);
      }
      return;
    }

    if (this.currentScene && this.currentScene.sound && this.currentScene.cache && this.currentScene.cache.audio && this.currentScene.cache.audio.exists(audioKey)) {
      try {
        this.currentMusic = this.currentScene.sound.add(audioKey, {
          volume: volume || this.musicVolume,
          loop: loop
        });
        
        if (!this.isMuted) {
          this.currentMusic.play();
        }
        return;
      } catch (error) {
        console.error(`Error reproduciendo música con Phaser ${audioKey}:`, error);
      }
    }
    
    this.playNativeAudio(audioKey, loop, volume);
  }

  playNativeAudio(audioKey, loop = true, volume = null) {
    // Mapear las claves de audio a rutas de archivos
    const audioFiles = {
      'menuPrincipal': '/assets/sounds/menu principal.mp3',
      'menuGame': '/assets/sounds/menu1.mp3',
      'menuDeath': '/assets/sounds/menu2.mp3',
      'attackBasic': '/assets/sounds/111.mp3',
      'attackSpecial': '/assets/sounds/222.mp3',
      'attackPowerful': '/assets/sounds/333.mp3'
    };

    const audioPath = audioFiles[audioKey];
    if (!audioPath) {
      console.warn(`Audio key "${audioKey}" no encontrado en el mapa de archivos`);
      return;
    }

    try {
      this.nativeAudio = new Audio(audioPath);
      this.nativeAudio.volume = volume || this.musicVolume;
      this.nativeAudio.loop = loop;
      
      if (!this.isMuted) {
        this.nativeAudio.play().catch(error => {
          console.warn(`Error reproduciendo audio nativo ${audioKey}:`, error);
        });
      }
    } catch (error) {
      console.error(`Error creando audio nativo ${audioKey}:`, error);
    }
  }

  playSFX(audioKey, volume = null) {
    if (this.currentScene && this.currentScene.sound && this.currentScene.cache && this.currentScene.cache.audio && this.currentScene.cache.audio.exists(audioKey)) {
      try {
        const sfx = this.currentScene.sound.add(audioKey, {
          volume: volume || this.sfxVolume
        });
        
        if (!this.isMuted) {
          sfx.play();
        }
        return;
      } catch (error) {
        console.error(`Error reproduciendo SFX con Phaser ${audioKey}:`, error);
      }
    }
    
    this.playNativeAudio(audioKey, false, volume || this.sfxVolume);
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.musicVolume);
    }
    
    if (this.nativeAudio) {
      this.nativeAudio.volume = this.musicVolume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.currentMusic) {
      if (this.isMuted) {
        this.currentMusic.pause();
      } else {
        this.currentMusic.resume();
      }
    }
    
    if (this.nativeAudio) {
      if (this.isMuted) {
        this.nativeAudio.pause();
      } else {
        this.nativeAudio.play().catch(error => {
          console.warn('Error reanudando audio nativo:', error);
        });
      }
    }
  }

  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
    if (this.nativeAudio) {
      this.nativeAudio.pause();
    }
  }

  resumeMusic() {
    if (this.currentMusic && !this.isMuted) {
      this.currentMusic.resume();
    }
    if (this.nativeAudio && !this.isMuted) {
      this.nativeAudio.play().catch(error => {
        console.warn('Error reanudando audio nativo:', error);
      });
    }
  }
}

export const audioManager = new AudioManager();