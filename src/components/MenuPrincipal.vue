<template>
  <div class="menu-principal">
    <!-- Notificación de audio -->
    <div v-if="showAudioNotification" class="audio-notification" @click="enableAudio">
      <div class="audio-notification-content">
        <span class="audio-icon">🔊</span>
        <span>Haz clic para habilitar el audio</span>
      </div>
    </div>
    
    <div class="menu-container">
      <div class="menu-content">
        <h1>Samurai Game</h1>
        <div class="menu-buttons">
          <button class="menu-button" @click="irAMundo1">
            <span class="button-text">Iniciar Partida</span>
          </button>
        </div>
      </div>
      
      <div class="controls-panel">
        <h2>Controles</h2>
        <div class="controls-section">
          <h3>Movimiento</h3>
          <div class="control-item">
            <span class="key">A</span>
            <span class="description">Mover izquierda</span>
          </div>
          <div class="control-item">
            <span class="key">D</span>
            <span class="description">Mover derecha</span>
          </div>
          <div class="control-item">
            <span class="key">w</span>
            <span class="description">Saltar</span>
          </div>
        </div>
        
        <div class="controls-section">
          <h3>Combate</h3>
          <div class="control-item">
            <span class="key">LMB</span>
            <span class="description">Ataque básico</span>
          </div>
          <div class="control-item">
            <span class="key">Q</span>
            <span class="description">Ataque especial</span>
          </div>
          <div class="control-item">
            <span class="key">E</span>
            <span class="description">Ataque poderoso</span>
          </div>
          <div class="control-item">
            <span class="key">R</span>
            <span class="description">Ultimate (cuando esté cargada)</span>
          </div>
        </div>
          <div class="controls-section">
          <h3>Objetos</h3>
          <div class="control-item">
            <span class="key">F</span>
            <span class="description">Usar poción</span>
          </div>
        </div>
        
        <div class="controls-section">
          <h3>💡 Sugerencias</h3>
          <div class="tip-item">
            <span class="tip-text">Encadenar ataques asegura un DPS y un combate más óptimo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { audioManager } from '../utils/AudioManager';

export default {
  name: 'MenuPrincipal',
  data() {
    return {
      showAudioNotification: true
    };
  },  mounted() {
    // Reproducir música del menú principal
    audioManager.playMusic('menuPrincipal');
    
    // Mostrar notificación si el usuario no ha interactuado O si hay música pendiente O si se viene desde otro menú
    if (!audioManager.userHasInteracted || audioManager.pendingMusic || this.checkReturnFromDeath()) {
      this.showAudioNotification = true;
    } else {
      this.showAudioNotification = false;
    }
  },  methods: {
    enableAudio() {
      this.showAudioNotification = false;
      // Forzar la reproducción de la música del menú principal
      audioManager.playMusic('menuPrincipal');
    },
      // Verificar si venimos de vuelta al menú principal desde la pantalla de muerte
    checkReturnFromDeath() {
      // Comprobar si existe el query parameter fromDeath
      if (this.$route && this.$route.query) {
        const fromDeath = this.$route.query.fromDeath;
        return fromDeath === 'true';
      }
      return false;
    },
    irAMundo1() {
      // Detener música del menú antes de ir al juego
      audioManager.stopAllMusic();
      this.$router.push('/game');
    },
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  cursor: pointer;
  animation: fadeIn 0.3s ease-out;
}

.audio-notification-content {
  background: rgba(52, 152, 219, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
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

.menu-principal {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
  padding: 2rem;
  box-sizing: border-box;
}

.menu-container {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  max-width: 1200px;
  width: 100%;
}

.menu-content {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  flex: 1;
}

.controls-panel {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  min-width: 280px;
}

.controls-panel h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #3498db;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.controls-section {
  margin-bottom: 1.5rem;
}

.controls-section h3 {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #f39c12;
  border-bottom: 1px solid rgba(243, 156, 18, 0.3);
  padding-bottom: 0.5rem;
}

.control-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 1rem;
}

.key {
  background: linear-gradient(45deg, #34495e, #2c3e50);
  border: 2px solid #3498db;
  border-radius: 0.3rem;
  padding: 0.4rem 0.8rem;
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.description {
  font-size: 0.9rem;
  opacity: 0.9;
  flex: 1;
}

.tip-item {
  background: rgba(52, 152, 219, 0.1);
  border-left: 3px solid #3498db;
  padding: 0.8rem;
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
}

.tip-text {
  font-size: 0.85rem;
  font-style: italic;
  color: #ecf0f1;
  line-height: 1.4;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: #fff;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-button {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 200px;
}

.menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #3498db, #2c3e50);
}

.menu-button:active {
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

@media (max-width: 900px) {
  .menu-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .controls-panel {
    max-width: 100%;
    min-width: auto;
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 600px) {
  .menu-principal {
    padding: 1rem;
  }

  .menu-content {
    padding: 1rem;
  }

  .controls-panel {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .menu-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
  
  .controls-panel h2 {
    font-size: 1.5rem;
  }
  
  .key {
    min-width: 50px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .description {
    font-size: 0.8rem;
  }
}
</style>