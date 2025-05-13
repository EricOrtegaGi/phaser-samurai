<template>
  <div class="game-container">
    <div v-if="loading" class="loading">Loading game...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div id="mundo1-container" ref="gameContainer"></div>
  </div>
</template>

<script>
import Phaser from 'phaser';

class Mundo1Scene extends Phaser.Scene {
  constructor() {
    super('Mundo1Scene');
  }

  preload() {
    // Cargar los sprites con la ruta correcta
    this.load.spritesheet('idle', '/assets/player/IDLE.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('run', '/assets/player/RUN.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });

    // Cargar fondos
    this.load.image('bg1', '/assets/Background/1.png');
    this.load.image('bg2', '/assets/Background/2.png');
    this.load.image('bg3', '/assets/Background/3.png');

    // Cargar tileset
    this.load.image('tileset', '/assets/Tileset/Tileset.png');
    // Cargar tile individual para el suelo
    this.load.image('ground', '/assets/Tileset/ground.png');

    // Cargar props y árboles
    this.load.image('trees', '/assets/Trees/Trees.png');
    this.load.image('props', '/assets/Props/Props.png');
    this.load.image('objects', '/assets/Props/Objects.png');
    this.load.image('flag', '/assets/Props/Flag.png');
    this.load.image('tree1', '/assets/Trees/tree1.png');
    this.load.image('tree3', '/assets/Trees/tree3.png');
  }

  create() {
    try {
      // 3. Jugador
      this.player = this.physics.add.sprite(100, 300, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);

      // Suelo visual
      this.ground = this.add.tileSprite(0, 605, 800, 32, 'ground');
      this.ground.setOrigin(0, 1);

      // Suelo físico invisible para colisión
      this.groundCollider = this.physics.add.staticSprite(400, 620 - 16, null);
      this.groundCollider.displayWidth = 800;
      this.groundCollider.displayHeight = 32;
      this.groundCollider.refreshBody();
      this.groundCollider.setVisible(false);

      // Colisión jugador-suelo
      this.physics.add.collider(this.player, this.groundCollider);

      // Línea para visualizar la hitbox del suelo
      const hitboxLine = this.add.graphics();
      hitboxLine.lineStyle(2, 0xff0000, 1); // Rojo, grosor 2
      hitboxLine.beginPath();
      hitboxLine.moveTo(0, 620 - 32); // Inicio de la línea (x=0, y=parte superior del suelo)
      hitboxLine.lineTo(800, 620 - 32); // Fin de la línea (x=800, y=parte superior del suelo)
      hitboxLine.closePath();
      hitboxLine.strokePath();

      // 4. Controles
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      // 6. Animaciones
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
      this.player.anims.play('idle', true);

      // Fondos para dar profundidad
      this.bg3 = this.add.image(400, 300, 'bg3');
      this.bg3.setDisplaySize(800, 600);
      this.bg3.setDepth(-30);
      this.bg2 = this.add.image(400, 300, 'bg2');
      this.bg2.setDisplaySize(800, 600);
      this.bg2.setDepth(-20);
      this.bg = this.add.image(400, 300, 'bg1');
      this.bg.setDisplaySize(800, 600);
      this.bg.setDepth(-10);

      // Árboles encima del suelo
      this.tree1 = this.add.image(150, 605 -32, 'tree1');
      this.tree1.setOrigin(0.5, 1);
      this.tree1.setScale(2.5);
      this.tree1.setDepth(5);
      this.tree3 = this.add.image(650, 605 -32, 'tree3');
      this.tree3.setOrigin(0.5, 1);
      this.tree3.setScale(2.5);
      this.tree3.setDepth(5);
    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo1Scene');
    }
  }

  update() {
    try {
      // Efecto parallax para los fondos
      if (this.player) {
        // this.bg1.tilePositionX = this.player.x * 0.1;
        // this.bg2.tilePositionX = this.player.x * 0.2;
        // this.bg3.tilePositionX = this.player.x * 0.3;
      }

      // Lógica de movimiento del jugador
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
    } catch (error) {
      console.error('Error in game update:', error);
    }
  }

  completeLevel() {
    // Mostrar mensaje de victoria
    const victoryText = this.add.text(400, 300, '¡Nivel Completado!', {
      fontSize: '32px',
      fill: '#fff'
    }).setOrigin(0.5);

    // Reiniciar el nivel después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }
}

export default {
  name: 'Mundo1',
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
        parent: 'mundo1-container',
        width: 800,
        height: 600,
        backgroundColor: '#b0b0b0', // Fondo claro para ver el suelo
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false,
          },
        },
        scene: Mundo1Scene,
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

#mundo1-container {
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