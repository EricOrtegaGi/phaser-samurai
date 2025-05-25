<template>
  <div class="menu-muerte">
    <!-- Notificación de audio -->
    <div v-if="showAudioNotification" class="audio-notification" @click="enableAudio">
      <div class="audio-notification-content">
        <span class="audio-icon">🔊</span>
        <span>Haz clic para habilitar el audio</span>
      </div>
    </div>
    
    <div class="menu-content">
      <h1 class="death-title">Has Muerto</h1>
      <div class="death-message">El camino del samurái es difícil...</div>
      <button class="retry-button" @click="emitCheckpoint">
        <span class="button-text">Checkpoint</span>
        <span class="button-description">Reaparecer en el mundo actual</span>
      </button>
      <button class="retry-button" @click="reiniciarJuego">
        <span class="button-text">Volver al inicio</span>
        <span class="button-description">Volver al menú principal</span>
      </button>
    </div>
  </div>
</template>

<script>
import { audioManager } from '../utils/AudioManager';

export default {
  name: 'MenuMuerte',
  data() {
    return {
      showAudioNotification: true
    };
  },  mounted() {
    // Reproducir música de muerte
    audioManager.playMusic('menuDeath');
    
    // Mostrar notificación si el usuario no ha interactuado O si hay música pendiente
    if (!audioManager.userHasInteracted || audioManager.pendingMusic) {
      this.showAudioNotification = true;
    } else {
      this.showAudioNotification = false;
    }
  },  methods: {
    enableAudio() {
      this.showAudioNotification = false;
      // Forzar la reproducción de la música de muerte
      audioManager.playMusic('menuDeath');
    },    reiniciarJuego() {
      // Detener música de muerte y volver al menú principal
      audioManager.stopAllMusic();
      // Pasar un parámetro indicando que venimos de la pantalla de muerte
      this.$router.push({ path: '/', query: { fromDeath: 'true' }});
    },
    emitCheckpoint() {
      // Detener música de muerte antes de reiniciar el juego
      audioManager.stopAllMusic();
      this.$emit('checkpoint');
      window.dispatchEvent(new CustomEvent('checkpoint'));
    }
  }
};
</script>

<style scoped>
.audio-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  cursor: pointer;
  animation: fadeIn 0.3s ease-out;
}

.audio-notification-content {
  background: rgba(255, 68, 68, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
  animation: pulse 2s infinite;
}

.audio-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.menu-muerte {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(44, 0, 0, 0.85); /* Fondo rojo oscuro semitransparente */
  backdrop-filter: blur(2px);
  animation: fadeIn 0.5s ease-out;
}

.menu-content {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  animation: fadeInContent 0.7s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInContent {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.death-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #ff4444;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.death-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ff9999;
}

.retry-button {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #8b0000, #ff4444);
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 200px;
  margin: 0 0.5rem;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  background: linear-gradient(45deg, #ff4444, #8b0000);
}

.retry-button:active {
  transform: translateY(0);
}

.button-text {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.button-description {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .menu-content {
    padding: 1rem;
  }

  .death-title {
    font-size: 2.5rem;
  }

  .death-message {
    font-size: 1rem;
  }

  .retry-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>