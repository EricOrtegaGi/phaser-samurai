<template>
  <div class="game-container">
    <div v-if="loading" class="loading">Loading game...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div id="mundo2-container" ref="gameContainer"></div>
  </div>
</template>

<script>
import Phaser from 'phaser';

class Mundo2Scene extends Phaser.Scene {
  constructor() {
    super('Mundo2Scene');
  }

  preload() {
    // Cargar los sprites con la ruta correcta
    this.load.spritesheet('idle', '/assets/IDLE.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('run', '/assets/RUN.png', {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  create() {
    try {
      // Verificar si las animaciones ya existen antes de crearlas
      if (!this.anims.exists('idle')) {
        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
      }

      if (!this.anims.exists('run')) {
        this.anims.create({
          key: 'run',
          frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
          frameRate: 12,
          repeat: -1
        });
      }

      // Crear jugador con sprite
      this.player = this.physics.add.sprite(100, 450, 'idle');
      this.player.setScale(1);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);

      // Crear enemigo
      this.enemy = this.add.rectangle(400, 450, 32, 48, 0x0000ff);
      this.physics.add.existing(this.enemy);
      this.enemy.body.setCollideWorldBounds(true);

      // Crear suelo
      this.ground = this.add.rectangle(400, 580, 800, 20, 0x00ff00);
      this.physics.add.existing(this.ground, true);

      // Añadir colisiones
      this.physics.add.collider(this.player, this.ground);
      this.physics.add.collider(this.enemy, this.ground);

      // Controles del jugador
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      // Movimiento básico del enemigo
      this.enemyDirection = 1;

      // Iniciar con la animación idle
      this.player.anims.play('idle', true);
    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo2Scene');
    }
  }

  update() {
    try {
      // Movimiento del jugador
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-160);
        this.player.setFlipX(true);
        if (this.player.body.touching.down) {
          this.player.anims.play('run', true);
        }
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(160);
        this.player.setFlipX(false);
        if (this.player.body.touching.down) {
          this.player.anims.play('run', true);
        }
      } else {
        this.player.body.setVelocityX(0);
        if (this.player.body.touching.down) {
          this.player.anims.play('idle', true);
        }
      }

      if (this.cursors.jump.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-330);
      }

      // Si está en el aire, mantener la animación actual
      if (!this.player.body.touching.down) {
        if (this.player.anims.currentAnim.key === 'idle') {
          this.player.anims.play('idle', true);
        }
      }

      // Movimiento del enemigo
      this.enemy.body.setVelocityX(100 * this.enemyDirection);

      // Cambiar dirección del enemigo al chocar con los bordes
      if (this.enemy.body.blocked.left || this.enemy.body.blocked.right) {
        this.enemyDirection *= -1;
      }
    } catch (error) {
      console.error('Error in game update:', error);
    }
  }
}

export default {
  name: 'Mundo2',
  data() {
    return {
      game: null,
      loading: true,
      error: null
    };
  },
  mounted() {
    try {
      this.loading = true;
      const config = {
        type: Phaser.AUTO,
        parent: 'mundo2-container',
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false,
          },
        },
        scene: Mundo2Scene,
      };

      this.game = new Phaser.Game(config);
      this.loading = false;
    } catch (error) {
      this.error = 'Failed to initialize game';
      console.error('Game initialization error:', error);
      this.loading = false;
    }
  },
  beforeUnmount() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
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

#mundo2-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
}

.loading, .error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.error {
  color: #ff4444;
}
</style>