<template>
  <div class="menu-principal">
    <div class="menu-content">
      <h1>Samurai Game</h1>
      <div class="menu-buttons">
        <button class="menu-button" @click="irAMundo1">
          <span class="button-text">Mundo 1</span>
          <span class="button-description">Aventura básica</span>
        </button>
        <button class="menu-button" @click="irAMundo2">
          <span class="button-text">Mundo 2</span>
          <span class="button-description">Con enemigos</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuPrincipal',
  methods: {
    irAMundo1() {
      this.$router.push('/game1');
    },
    irAMundo2() {
      this.$router.push('/game2');
    }
  }
};
</script>

<style scoped>
.menu-principal {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
}

.menu-content {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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

@media (max-width: 600px) {
  .menu-content {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .menu-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>