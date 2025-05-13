<template>
  <div class="menu-final">
    <div class="menu-content">
      <h1 class="victory-title">¡Felicidades!</h1>
      <div class="victory-message">Has completado tu entrenamiento como samurái</div>
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
export default {
  name: 'MenuFinal',
  methods: {
    volverAlMenu() {
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
  background: linear-gradient(135deg, #004400 0%, #001a00 100%);
  color: white;
  overflow: hidden;
}

.menu-content {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
  animation: fadeIn 0.5s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.victory-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #44ff44;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: glow 2s infinite;
}

@keyframes glow {
  0% {
    text-shadow: 0 0 10px #44ff44;
  }
  50% {
    text-shadow: 0 0 20px #44ff44, 0 0 30px #44ff44;
  }
  100% {
    text-shadow: 0 0 10px #44ff44;
  }
}

.victory-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #99ff99;
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
  background: linear-gradient(45deg, #004400, #44ff44);
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
  box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
  background: linear-gradient(45deg, #44ff44, #004400);
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
    font-size: 2.5rem;
  }

  .victory-message {
    font-size: 1rem;
  }

  .menu-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>