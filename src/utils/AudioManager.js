// AudioManager.js - Gestor centralizado de audio para el juego

class AudioManager {  constructor() {
    this.currentMusic = null;
    this.currentMusicKey = null; // Para trackear qué música está sonando
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isMuted = false;
    this.currentScene = null;
    this.nativeAudio = null; // Para audio nativo en menús
    this.pendingMusic = null; // Para guardar música pendiente hasta la interacción del usuario
    this.userHasInteracted = false;
    
    // Escuchar la primera interacción del usuario
    this.setupUserInteractionListener();
  }

  // Configurar listener para detectar la primera interacción del usuario
  setupUserInteractionListener() {
    const handleFirstInteraction = () => {
      this.userHasInteracted = true;
      
      // Si hay música pendiente, reproducirla ahora
      if (this.pendingMusic) {
        this.playMusic(this.pendingMusic.audioKey, this.pendingMusic.loop, this.pendingMusic.volume);
        this.pendingMusic = null;
      }
      
      // Remover los event listeners ya que ya no los necesitamos
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
  }

  // Inicializar con una escena de Phaser
  init(scene) {
    this.currentScene = scene;
  }

  // Detener toda la música actual
  stopAllMusic() {
    // Detener música de Phaser
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
    
    // Detener audio nativo
    if (this.nativeAudio) {
      this.nativeAudio.pause();
      this.nativeAudio = null;
    }
  }  // Reproducir música con transición suave
  playMusic(audioKey, loop = true, volume = null) {
    // Si el audio key es el mismo que ya está sonando, no hacer nada para evitar reiniciar la misma música
    if (this.currentMusicKey === audioKey && this.currentMusic) {
      return;
    }
    
    // Si el usuario no ha interactuado aún, guardar la música para reproducir después
    if (!this.userHasInteracted) {
      this.pendingMusic = { audioKey, loop, volume };
      console.log(`Música ${audioKey} programada para reproducir después de la interacción del usuario`);
      return;
    }// Detener música actual primero
    this.stopAllMusic();
    
    // Intentar reproducir con Phaser si tenemos una escena
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
    
    // Fallback: usar audio nativo del navegador
    this.playNativeAudio(audioKey, loop, volume);
  }
  // Reproducir audio usando APIs nativas del navegador
  playNativeAudio(audioKey, loop = true, volume = null) {
    // Mapear las claves de audio a rutas de archivos
    const audioFiles = {
      'menuPrincipal': '/assets/sounds/menu principal.mp3',
      'menuGame': '/assets/sounds/menu1.mp3',
      'menuDeath': '/assets/sounds/menu2.mp3',
      'menuVictory': '/assets/sounds/menu3.mp3',
      'attackBasic': '/assets/sounds/111.mp3',
      'attackSpecial': '/assets/sounds/222.mp3',
      'attackPowerful': '/assets/sounds/333.mp3'
    };
    
    // Guardar la clave de audio para referencia
    this.currentMusicKey = audioKey;

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

  // Reproducir efecto de sonido
  playSFX(audioKey, volume = null) {    // Intentar con Phaser primero
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
    
    // Fallback: usar audio nativo para SFX también
    this.playNativeAudio(audioKey, false, volume || this.sfxVolume);
  }
  // Establecer volumen de música
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    // Actualizar volumen en música de Phaser
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.musicVolume);
    }
    
    // Actualizar volumen en audio nativo
    if (this.nativeAudio) {
      this.nativeAudio.volume = this.musicVolume;
    }
  }

  // Establecer volumen de efectos
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  // Silenciar/desmutear todo el audio
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Manejar música de Phaser
    if (this.currentMusic) {
      if (this.isMuted) {
        this.currentMusic.pause();
      } else {
        this.currentMusic.resume();
      }
    }
    
    // Manejar audio nativo
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

  // Pausar música actual
  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
    if (this.nativeAudio) {
      this.nativeAudio.pause();
    }
  }

  // Reanudar música actual
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

// Exportar instancia singleton
export const audioManager = new AudioManager();