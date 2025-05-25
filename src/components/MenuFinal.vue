<template>
  <div class="menu-final">
    <div class="menu-content">
      <h1 class="victory-title">¡Felicidades!</h1>
      <div class="victory-message">Has completado tu entrenamiento como samurái</div>
      <div class="score-display">
        <span class="score-label">Puntuación Base:</span>
        <span class="score-value">{{ finalScore }}</span>
      </div>
      <div class="score-display">
        <span class="score-label">Muertes:</span>
        <span class="score-value">{{ deathCount }}</span>
      </div>
      <div class="score-display">
        <span class="score-label">Puntuación Final:</span>
        <span class="score-value">{{ finalScoreWithDeaths }} / {{ maxScore }}</span>
      </div>
      <div class="stars-display">
        <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= stars }">★</span>
      </div>
      <div class="confetti-container">
        <div v-for="n in 50" :key="n" class="confetti" :style="confettiStyle(n)"></div>
      </div>
      <button class="menu-button" @click="volverAlMenu">
        <span class="button-text">Volver al Menú Principal</span>
        <span class="button-description">Comienza una nueva aventura</span>
      </button>
    </div>
  </div>
</template>

<script>
import { audioManager } from '../utils/AudioManager';

export default {
  name: 'MenuFinal',
  data() {
    return {
      finalScore: 0,
      deathCount: 0,
      finalScoreWithDeaths: 0,
      stars: 1,
      maxScore: 975
    };
  },
  created() {
    // Obtener la puntuación final y muertes del localStorage
    this.finalScore = parseInt(localStorage.getItem('finalScore') || 0);
    this.deathCount = parseInt(localStorage.getItem('deathCount') || 0);
    this.finalScoreWithDeaths = this.finalScore - (this.deathCount * 100);
    if (this.finalScoreWithDeaths < 0) this.finalScoreWithDeaths = 0;
    // Calcular estrellas
    if (this.finalScoreWithDeaths === 0 || this.finalScoreWithDeaths <= 50) {
      this.stars = 0;
    } else if (this.finalScoreWithDeaths >= this.maxScore) {
      this.stars = 3;
    } else if (this.finalScoreWithDeaths >= Math.floor(this.maxScore / 2)) {
      this.stars = 2;
    } else {
      this.stars = 1;
    }
  },
  methods: {
    volverAlMenu() {
      // Limpiar la puntuación y muertes del localStorage
      localStorage.removeItem('finalScore');
      localStorage.removeItem('deathCount');
      // Detener música antes de volver al menú
      audioManager.stopAllMusic();
      this.$router.push('/');
    },
    confettiStyle(n) {
      const colors = ['#ffd700', '#ff4444', '#44ff44', '#4444ff', '#ff44ff'];
      const color = colors[n % colors.length];
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const animationDelay = `${Math.random() * 2}s`;
      
      return {
        backgroundColor: color,
        left,
        animationDuration,
        animationDelay
      };
    }
  }
};
</script>

<style scoped>
.menu-final {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
  overflow: hidden;
}

.menu-content {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.score-display {
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 0.5rem;
  border: 2px solid #3498db;
}

.score-label {
  font-size: 1.2rem;
  color: #3498db;
  margin-right: 1rem;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

.victory-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.victory-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #fff;
}

.stars-display {
  margin: 1.5rem 0 0.5rem 0;
  font-size: 2.5rem;
  color: #bbb;
}

.star.filled {
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  opacity: 0.7;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
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

@media (max-width: 600px) {
  .menu-content {
    padding: 1rem;
  }

  .victory-title {
    font-size: 2rem;
  }

  .victory-message {
    font-size: 1rem;
  }

  .menu-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  .score-value {
    font-size: 1.5rem;
  }
}
</style>