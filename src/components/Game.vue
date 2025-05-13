<template>
  <div class="game-container">
    <div ref="gameContainer"></div>
  </div>
</template>

<script>
import Phaser from 'phaser';
import { Mundo1Scene, Mundo2Scene } from '../scenes/GameScenes';

export default {
  name: 'Game',
  data() {
    return {
      game: null
    };
  },
  mounted() {
    try {
      this.game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: this.$refs.gameContainer,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false
          }
        },
        scene: [Mundo1Scene, Mundo2Scene],
        parentVue: this
      });
    } catch (error) {
      console.error('Game initialization error:', error);
    }
  },
  beforeUnmount() {
    if (this.game) {
      this.game.destroy(true);
    }
  }
};
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

canvas {
  display: block;
  margin: 0 auto;
}
</style> 