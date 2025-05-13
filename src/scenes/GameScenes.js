import Phaser from 'phaser';

export class Mundo1Scene extends Phaser.Scene {
  constructor() {
    super('Mundo1Scene');
  }

  init() {
    // Guardar referencia a la instancia de Vue
    this.parentVue = this.game.config.parentVue;
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
    this.load.image('portal', '/assets/Props/portal.png');
  }

  create() {
    try {
      // Configurar el mundo del juego para que sea más largo
      this.physics.world.setBounds(0, 0, 3200, 600); // Mapa 4 veces más largo

      // 3. Jugador
      this.player = this.physics.add.sprite(300, 300, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);

      // Configurar la cámara para seguir al jugador
      this.cameras.main.setBounds(0, 0, 3200, 600);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);

      // Suelo visual extendido
      this.ground = this.add.tileSprite(0, 605, 3200, 32, 'ground');
      this.ground.setOrigin(0, 1);

      // Suelo físico invisible para colisión
      this.groundCollider = this.physics.add.staticSprite(1600, 620 - 16, null);
      this.groundCollider.displayWidth = 3200;
      this.groundCollider.displayHeight = 32;
      this.groundCollider.refreshBody();
      this.groundCollider.setVisible(false);

      // Colisión jugador-suelo
      this.physics.add.collider(this.player, this.groundCollider);

      // Fondos para dar profundidad (repetidos a lo largo del mapa)
      this.bgLayers = [
        { key: 'bg3', depth: -30, speed: 0.7 },
        { key: 'bg2', depth: -20, speed: 0.8 },
        { key: 'bg1', depth: -10, speed: 0.9 }
      ];
      this.bgImages = {};
      const fondoWidth = 800;
      const numFondos = Math.ceil(3200 / fondoWidth) + 1;
      this.bgLayers.forEach(layer => {
        this.bgImages[layer.key] = [];
        for (let i = 0; i < numFondos; i++) {
          const img = this.add.image(i * fondoWidth + fondoWidth / 2, 300, layer.key);
          img.setDisplaySize(fondoWidth, 600);
          img.setDepth(layer.depth);
          this.bgImages[layer.key].push(img);
        }
      });

      // Árboles distribuidos a lo largo del mapa
      this.createTrees();

      // Añadir el portal como objeto físico interactivo
      this.portal = this.physics.add.staticImage(3000, 605 - 32, 'portal');
      this.portal.setOrigin(0.5, 1);
      this.portal.setScale(2);
      this.portal.setDepth(5);

      // Ajustar la hitbox del portal para que solo sea el centro y subirla 20px
      this.portal.body.setSize(12, 12);
      this.portal.body.setOffset(
        (this.portal.width * this.portal.scaleX - 12) / 2,
        (this.portal.height * this.portal.scaleY - 12) / 2 - 20
      );

      // Colisión jugador-portal (superposición)
      this.physics.add.overlap(this.player, this.portal, () => {
        // Debug: mostrar en consola cuando el jugador toca la hitbox
        console.debug('El jugador ha tocado la hitbox central del portal');
        
        // Desactivar temporalmente las colisiones
        this.physics.world.disable(this.player);
        this.physics.world.disable(this.portal);
        
        // Añadir efecto de transición
        this.cameras.main.fade(500, 0, 0, 0);
        
        // Esperar a que termine el fade y cambiar de escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Mundo2Scene');
        });
      }, null, this);

      // Controles
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      // Animaciones
      if (!this.anims.exists('idle')) {
        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
          frameRate: 12,
          repeat: -1
        });
      }
      if (!this.anims.exists('run')) {
        this.anims.create({
          key: 'run',
          frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
          frameRate: 14,
          repeat: -1
        });
      }
      this.player.anims.play('idle', true);
      this.player.setDepth(10);
    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo1Scene');
    }
  }

  createTrees() {
    // Crear árboles a lo largo del mapa
    const treePositions = [
      { x: 150, y: 605 - 32, type: 'tree1' },
      { x: 650, y: 605 - 32, type: 'tree3' },
      { x: 1150, y: 605 - 32, type: 'tree1' },
      { x: 1650, y: 605 - 32, type: 'tree3' },
      { x: 2150, y: 605 - 32, type: 'tree1' },
      { x: 2650, y: 605 - 32, type: 'tree3' },
      { x: 3150, y: 605 - 32, type: 'tree1' }
    ];

    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, pos.type);
      tree.setOrigin(0.5, 1);
      tree.setScale(3.5);
      tree.setDepth(5);
    });
  }

  update() {
    try {
      // Efecto parallax para los fondos (repetidos)
      if (this.player) {
        const cam = this.cameras.main;
        const fondoWidth = 800;
        this.bgLayers.forEach(layer => {
          this.bgImages[layer.key].forEach((img, idx) => {
            // Calcular la posición x con parallax
            img.x = (idx * fondoWidth + fondoWidth / 2) - (cam.scrollX * (1 - layer.speed));
            // Si la imagen sale completamente por la izquierda, la reposiciono al final
            if (img.x + fondoWidth / 2 < cam.scrollX) {
              const maxIdx = Math.max(...this.bgImages[layer.key].map(i => i.x));
              img.x = maxIdx + fondoWidth;
            }
          });
        });
      }

      // Lógica de movimiento del jugador
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-240);
        this.player.setFlipX(true);
        if (this.player.body.touching.down) {
          this.player.anims.play('run', true);
        }
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(240);
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
}

export class Mundo2Scene extends Phaser.Scene {
  constructor() {
    super('Mundo2Scene');
  }

  init() {
    // Guardar referencia a la instancia de Vue
    this.parentVue = this.game.config.parentVue;
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
    this.load.image('portal', '/assets/Props/portal.png');
  }

  create() {
    try {
      // Configurar el mundo del juego para que sea más largo
      this.physics.world.setBounds(0, 0, 3200, 600); // Mapa 4 veces más largo

      // Configurar fade in inicial
      this.cameras.main.fadeIn(500, 0, 0, 0);

      // Verificar si las animaciones ya existen antes de crearlas
      if (!this.anims.exists('idle')) {
        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
          frameRate: 12,
          repeat: -1
        });
      }

      if (!this.anims.exists('run')) {
        this.anims.create({
          key: 'run',
          frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
          frameRate: 14,
          repeat: -1
        });
      }

      // Crear portal de entrada alineado al suelo, a la derecha del primer árbol
      this.portal = this.physics.add.staticImage(300, 605 - 32, 'portal');
      this.portal.setOrigin(0.5, 1);
      this.portal.setScale(2);
      this.portal.setDepth(5);

      // Crear jugador con sprite a la derecha del portal
      this.player = this.physics.add.sprite(320, 450, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);

      // Configurar la cámara para seguir al jugador
      this.cameras.main.setBounds(0, 0, 3200, 600);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);

      // Suelo visual extendido
      this.ground = this.add.tileSprite(0, 605, 3200, 32, 'ground');
      this.ground.setOrigin(0, 1);

      // Suelo físico invisible para colisión
      this.groundCollider = this.physics.add.staticSprite(1600, 620 - 16, null);
      this.groundCollider.displayWidth = 3200;
      this.groundCollider.displayHeight = 32;
      this.groundCollider.refreshBody();
      this.groundCollider.setVisible(false);

      // Colisión jugador-suelo
      this.physics.add.collider(this.player, this.groundCollider);

      // Fondos para dar profundidad (repetidos a lo largo del mapa)
      this.bgLayers = [
        { key: 'bg3', depth: -30, speed: 0.7 },
        { key: 'bg2', depth: -20, speed: 0.8 },
        { key: 'bg1', depth: -10, speed: 0.9 }
      ];
      this.bgImages = {};
      const fondoWidth = 800;
      const numFondos = Math.ceil(3200 / fondoWidth) + 1;
      this.bgLayers.forEach(layer => {
        this.bgImages[layer.key] = [];
        for (let i = 0; i < numFondos; i++) {
          const img = this.add.image(i * fondoWidth + fondoWidth / 2, 300, layer.key);
          img.setDisplaySize(fondoWidth, 600);
          img.setDepth(layer.depth);
          this.bgImages[layer.key].push(img);
        }
      });

      // Árboles distribuidos a lo largo del mapa
      this.createTrees();

      // Controles del jugador
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      // Iniciar con la animación idle
      this.player.anims.play('idle', true);
      this.player.setDepth(10);
    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo2Scene');
    }
  }

  createTrees() {
    // Crear árboles a lo largo del mapa
    const treePositions = [
      { x: 150, y: 605 - 32, type: 'tree1' },
      { x: 650, y: 605 - 32, type: 'tree3' },
      { x: 1150, y: 605 - 32, type: 'tree1' },
      { x: 1650, y: 605 - 32, type: 'tree3' },
      { x: 2150, y: 605 - 32, type: 'tree1' },
      { x: 2650, y: 605 - 32, type: 'tree3' },
      { x: 3150, y: 605 - 32, type: 'tree1' }
    ];

    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, pos.type);
      tree.setOrigin(0.5, 1);
      tree.setScale(3.5);
      tree.setDepth(5);
    });
  }

  update() {
    try {
      // Efecto parallax para los fondos (repetidos)
      if (this.player) {
        const cam = this.cameras.main;
        const fondoWidth = 800;
        this.bgLayers.forEach(layer => {
          this.bgImages[layer.key].forEach((img, idx) => {
            // Calcular la posición x con parallax
            img.x = (idx * fondoWidth + fondoWidth / 2) - (cam.scrollX * (1 - layer.speed));
            // Si la imagen sale completamente por la izquierda, la reposiciono al final
            if (img.x + fondoWidth / 2 < cam.scrollX) {
              const maxIdx = Math.max(...this.bgImages[layer.key].map(i => i.x));
              img.x = maxIdx + fondoWidth;
            }
          });
        });
      }

      // Movimiento del jugador
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-240);
        this.player.setFlipX(true);
        if (this.player.body.touching.down) {
          this.player.anims.play('run', true);
        }
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(240);
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
} 