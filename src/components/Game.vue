<template>
  <div class="game-container">
    <div ref="gameContainer"></div>
    <MenuMuerte v-if="showDeathMenu" @checkpoint="onCheckpoint" />
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
import MenuMuerte from './MenuMuerte.vue';

export default {
  name: 'Game',
  components: { MenuMuerte },
  data() {
    return {
      game: null,
      resourceManager: ResourceManager,
      eventBus: EventBus,
      objectPools: {},
      gameState: null,
      debugSystem: null,
      showDeathMenu: false
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
      // Listener para terminar el juego y navegar al menú final
      window.addEventListener('game-finished', this.onGameFinished);
      window.addEventListener('player-died', this.onPlayerDied);
      window.addEventListener('checkpoint', this.onCheckpoint);
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
    window.removeEventListener('game-finished', this.onGameFinished);
    window.removeEventListener('player-died', this.onPlayerDied);
    window.removeEventListener('checkpoint', this.onCheckpoint);
  },
  methods: {
    onGameFinished(e) {
      // Navegar al menú final
      this.$router.push('/menu-final');
    },
    onPlayerDied() {
      this.showDeathMenu = true;
    },
    onCheckpoint() {
      this.showDeathMenu = false;
      // Reiniciar la escena actual de Phaser
      if (this.game && this.game.scene && this.game.scene.getScenes(true).length > 0) {
        const currentScene = this.game.scene.getScenes(true)[0];
        if (currentScene) {
          // Pasar datos actuales al reiniciar la escena
          const data = {
            hasPotion: currentScene.hasPotion,
            score: currentScene.score,
            deathCount: currentScene.deathCount
          };
          currentScene.scene.restart(data);
        }
      }
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