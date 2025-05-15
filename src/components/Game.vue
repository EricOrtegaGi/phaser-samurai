<template>
  <div class="game-container">
    <div ref="gameContainer"></div>
  </div>
</template>

<script>
import Phaser from 'phaser';
import { Mundo1Scene, Mundo2Scene } from '../scenes/GameScenes';
import ResourceManager from '../utils/ResourceManager';
import EventBus from '../utils/EventBus';
import { ObjectPool } from '../utils/ObjectPool';
import { GameState } from '../utils/GameState';
import { DebugSystem } from '../utils/DebugSystem';

export default {
  name: 'Game',
  data() {
    return {
      game: null,
      resourceManager: ResourceManager,
      eventBus: EventBus,
      objectPools: {},
      gameState: null,
      debugSystem: null
    };
  },
  mounted() {
    try {
      // Inicializar sistemas
      this.gameState = new GameState();
      this.objectPools = {
        // Ejemplo: pool de enemigos
        enemies: new ObjectPool(() => null, 10)
      };
      // Crear el juego y pasar referencias a las escenas
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
        parentVue: this,
        resourceManager: this.resourceManager,
        eventBus: this.eventBus,
        objectPools: this.objectPools,
        gameState: this.gameState
      });
      // DebugSystem se inicializa en la escena para tener acceso a game.add
    } catch (error) {
      console.error('Game initialization error:', error);
    }
  },
  beforeUnmount() {
    if (this.game) {
      this.game.destroy(true);
    }
    this.eventBus.clear();
    this.resourceManager.clear();
    // Limpieza de pools si es necesario
    Object.values(this.objectPools).forEach(pool => pool.clear());
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