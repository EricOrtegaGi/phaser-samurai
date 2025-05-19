import Phaser from 'phaser';
import { DebugSystem } from '../utils/DebugSystem';

export class Mundo1Scene extends Phaser.Scene {
  constructor() {
    super('Mundo1Scene');
  }

  init() {
    this.parentVue = this.game.config.parentVue;
    this.resourceManager = this.game.config.resourceManager;
    this.eventBus = this.game.config.eventBus;
    this.objectPools = this.game.config.objectPools;
    this.gameState = this.game.config.gameState;
    this.debugSystem = new DebugSystem(this);
  }

  preload() {
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
    this.load.spritesheet('attack1', '/assets/player/ATTACK 1.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('attack2', '/assets/player/ATTACK 2.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('attack3', '/assets/player/ATTACK 3.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('jump_attack', '/assets/player/JUMP_ATTACK.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.image('bg1', '/assets/Background/1.png');
    this.load.image('bg2', '/assets/Background/2.png');
    this.load.image('bg3', '/assets/Background/3.png');
    this.load.image('tileset', '/assets/Tileset/Tileset.png');
    this.load.image('ground', '/assets/Tileset/ground.png');
    this.load.image('trees', '/assets/Trees/Trees.png');
    this.load.image('props', '/assets/Props/Props.png');
    this.load.image('objects', '/assets/Props/Objects.png');
    this.load.image('flag', '/assets/Props/Flag.png');
    this.load.image('tree1', '/assets/Trees/tree1.png');
    this.load.image('tree3', '/assets/Trees/tree3.png');
    this.load.image('portal', '/assets/Props/portal.png');
    this.load.spritesheet('idle_ult', '/assets/player/ultimate/IDLE (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('run_ult', '/assets/player/ultimate/RUN (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack1_ult', '/assets/player/ultimate/ATTACK 1 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack2_ult', '/assets/player/ultimate/ATTACK 2 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack3_ult', '/assets/player/ultimate/ATTACK 3 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('jump_attack_ult', '/assets/player/ultimate/JUMP ATTACK (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('shout', '/assets/player/ultimate/SHOUT.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('death', '/assets/player/DEATH.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('hurt', '/assets/player/HURT.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('hurt_ult', '/assets/player/ultimate/HURT (FLAMING SWORD).png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('nightborne', '/assets/enemies/nightborne/NightBorne.png', {
      frameWidth: 80,
      frameHeight: 80,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('nightborne_run', '/assets/enemies/nightborne/NightBorne_run.png', {
      frameWidth: 80,
      frameHeight: 80,
      margin: 0,
      spacing: 0
    });

    // Añadir evento para detectar errores de carga del spritesheet nightborne
    this.load.on('loaderror', (file) => {
      if (file.key === 'nightborne') {
        console.error('Error cargando spritesheet nightborne:', file.key, file.url);
      }
    });
  }

  create() {
    try {
      this.debugSystem.init();
      this.physics.world.setBounds(0, 0, 3200, 600);
      this.player = this.physics.add.sprite(300, 300, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);
      this.cameras.main.setBounds(0, 0, 3200, 600);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);
      this.ground = this.add.tileSprite(0, 605, 3200, 32, 'ground');
      this.ground.setOrigin(0, 1);
      this.groundCollider = this.physics.add.staticSprite(1600, 620 - 16, null);
      this.groundCollider.displayWidth = 3200;
      this.groundCollider.displayHeight = 32;
      this.groundCollider.refreshBody();
      this.groundCollider.setVisible(false);
      this.physics.add.collider(this.player, this.groundCollider); // Colisión del jugador con el suelo
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
      this.createTrees();
      this.portal = this.physics.add.staticImage(3000, 605 - 32, 'portal');
      this.portal.setOrigin(0.5, 1);
      this.portal.setScale(2);
      this.portal.setDepth(5);
      this.portal.body.setSize(12, 12);
      this.portal.body.setOffset(
        (this.portal.width * this.portal.scaleX - 12) / 2,
        (this.portal.height * this.portal.scaleY - 12) / 2 - 20
      );
      this.physics.add.overlap(this.player, this.portal, () => {
        console.debug('El jugador ha tocado la hitbox central del portal');
        this.physics.world.disable(this.player);
        this.physics.world.disable(this.portal);
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Mundo2Scene');
        });
      }, null, this);
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        attack2: Phaser.Input.Keyboard.KeyCodes.Q,
        attack3: Phaser.Input.Keyboard.KeyCodes.E
      });
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
      if (!this.anims.exists('attack1')) {
        this.anims.create({
          key: 'attack1',
          frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('attack2')) {
        this.anims.create({
          key: 'attack2',
          frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 4 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('attack3')) {
        this.anims.create({
          key: 'attack3',
          frames: this.anims.generateFrameNumbers('attack3', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('jump_attack')) {
        this.anims.create({
          key: 'jump_attack',
          frames: this.anims.generateFrameNumbers('jump_attack', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      this.loadUltimateAnimations();
      this.player.anims.play('idle', true);
      this.player.setDepth(10);
      this.isAttacking = false;
      this.activatingUltimate = false;
      this.attackCooldown = false;
      this.attackCooldownTime = 400;
      this.attack2Cooldown = false;
      this.attack2CooldownTime = 600;
      this.attack3Cooldown = false;
      this.attack3CooldownTime = 800;
      this.jumpAttackCooldown = false;
      this.jumpAttackCooldownTime = 1200;
      this.player.hp = 500;
      this.player.isDead = false;
      this.playerHpText = this.add.text(40, 40, 'HP: 500', {
        font: 'bold 16px Arial',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0, 0).setScrollFactor(0);
      this.input.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown() && !this.isAttacking) {
          if (this.player.body.touching.down && !this.attackCooldown) {
            this.isAttacking = true;
            this.attackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'attack1_ult' : 'attack1', true);
            this.player.setVelocityX(0);
            this.attackMelee();
            this.time.delayedCall(this.attackCooldownTime, () => {
              this.attackCooldown = false;
            });
          } else if (!this.player.body.touching.down && !this.jumpAttackCooldown) {
            this.isAttacking = true;
            this.jumpAttackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'jump_attack_ult' : 'jump_attack', true);
            this.player.setVelocityX(0);
            this.attackMeleeAir();
            this.time.delayedCall(this.jumpAttackCooldownTime, () => {
              this.jumpAttackCooldown = false;
            });
          }
        }
      });
      this.player.on('animationcomplete-attack1', () => {
        console.debug('Animación attack1 completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack2', () => {
        console.debug('Animación attack2 completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack3', () => {
        console.debug('Animación attack3 completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-jump_attack', () => {
        console.debug('Animación jump_attack completada, restableciendo estado');
        this.isAttacking = false;
        if (!this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack1_ult', () => {
        console.debug('Animación attack1_ult completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-attack2_ult', () => {
        console.debug('Animación attack2_ult completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-attack3_ult', () => {
        console.debug('Animación attack3_ult completada, restableciendo estado');
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-jump_attack_ult', () => {
        console.debug('Animación jump_attack_ult completada, restableciendo estado');
        this.isAttacking = false;
        if (!this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.input.keyboard.on('keydown-Q', () => {
        console.log('Tecla Q presionada. ultimateActive:', this.ultimateActive, ' isAttacking:', this.isAttacking, ' touching.down:', this.player.body.touching.down, ' attack2Cooldown:', this.attack2Cooldown);
        if (!this.isAttacking && this.player.body.touching.down && !this.attack2Cooldown) {
          this.isAttacking = true;
          this.attack2Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack2_ult' : 'attack2', true);
          this.player.setVelocityX(0);
          this.attackMelee2();
          this.time.delayedCall(this.attack2CooldownTime, () => {
            this.attack2Cooldown = false;
          });
        }
      });

      this.input.keyboard.on('keydown-E', () => {
        console.log('Tecla E presionada. ultimateActive:', this.ultimateActive, ' isAttacking:', this.isAttacking, ' touching.down:', this.player.body.touching.down, ' attack3Cooldown:', this.attack3Cooldown);
        if (!this.isAttacking && this.player.body.touching.down && !this.attack3Cooldown) {
          this.isAttacking = true;
          this.attack3Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack3_ult' : 'attack3', true);
          this.player.setVelocityX(0);
          this.attackMelee3();
          this.time.delayedCall(this.attack3CooldownTime, () => {
            this.attack3Cooldown = false;
          });
        }
      });
      this.input.keyboard.enabled = true;
      this.game.canvas.tabIndex = 0;
      this.game.canvas.focus();
      this.input.keyboard.on('keydown-R', () => {
        if (this.ultimateCharge >= 99 && !this.ultimateActive) {
          this.activateUltimate();
        }
      });

      this.ultimateCharge = 0;
      this.ultimateActive = false;
      this.ultimateDuration = 15000;
      this.ultimateTimeLeft = 0;
      // Posicionar barra de ultimate centrada arriba
      const barWidth = 200;
      const barHeight = 20;
      const marginTop = 20;
      const centerX = this.cameras.main.width / 2;
      this.ultimateBarBg = this.add.rectangle(centerX - barWidth / 2, marginTop, barWidth, barHeight, 0x222222)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateBar = this.add.rectangle(centerX - barWidth / 2, marginTop, 0, barHeight, 0xffd700)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateText = this.add.text(centerX + barWidth / 2 + 10, marginTop, '', { font: 'bold 16px Arial', fill: '#fff' })
        .setOrigin(0, 0)
        .setScrollFactor(0);
      // Actualizar posición al redimensionar
      this.scale.on('resize', (gameSize) => {
        const newCenterX = gameSize.width / 2;
        this.ultimateBarBg.x = newCenterX - barWidth / 2;
        this.ultimateBar.x = newCenterX - barWidth / 2;
        this.ultimateText.x = newCenterX + barWidth / 2 + 10;
      });
      // Crear sprite del enemigo NightBorne
      this.enemy = this.physics.add.sprite(600, 650 - 32, 'nightborne'); // Posición inicial de ejemplo
      this.enemy.setOrigin(0.5, 1);
      this.enemy.setScale(2); // Escala aumentada
      this.enemy.setCollideWorldBounds(true);
      this.enemy.body.setGravityY(300); // Gravedad similar al jugador

      this.physics.add.collider(this.enemy, this.groundCollider); // Colisión del enemigo con el suelo (re-añadida)

      // Crear animación idle para NightBorne
      if (!this.anims.exists('nightborne_idle')) {
        this.anims.create({
          key: 'nightborne_idle',
          frames: this.anims.generateFrameNumbers('nightborne', { start: 0, end: 7 }),
          frameRate: 10, // Velocidad de animación de ejemplo
          repeat: -1 // Repetir indefinidamente
        });
      }
      
      // Crear animación walk para NightBorne (Restaurada y corregida)
      if (!this.anims.exists('nightborne_walk')) {
        this.anims.create({
          key: 'nightborne_walk',
          frames: this.anims.generateFrameNumbers('nightborne_run', { start: 0, end: 5 }), // Usar el spritesheet correcto y frames 0-5
          frameRate: 10, // Velocidad de animación de ejemplo
          repeat: -1
        });
      }
      
      // Crear animación attack para NightBorne
      if (!this.anims.exists('nightborne_attack')) {
        this.anims.create({
          key: 'nightborne_attack',
          frames: this.anims.generateFrameNumbers('nightborne', { start: 16, end: 27 }), // Rango de frames ajustado
          frameRate: 15, // Velocidad de animación de ejemplo
          repeat: 0 // No repetir, es un ataque
        });
      }

      // Iniciar animación idle para el enemigo
      this.enemy.anims.play('nightborne_idle', true);

      // Añadir HP y texto de HP al enemigo
      this.enemy.hp = 500; // HP inicial de ejemplo
      this.enemy.isDead = false; // Estado de muerte
      this.enemyHpText = this.add.text(this.enemy.x, this.enemy.y - 120, `HP: ${this.enemy.hp}`, {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);

      // Función para que el enemigo reciba daño
      this.enemy.takeDamage = (amount) => {
        if (this.enemy.isDead) return;
        this.enemy.wasHitThisAttack = true;
        const willDie = (this.enemy.hp - amount) <= 0;
        this.enemy.hp -= amount;
        if (this.enemy.hp <= 0) {
          this.enemy.hp = 0;
          this.enemy.isDead = true;
          // Aquí se podría añadir una animación de muerte para el enemigo
          // Por ahora, simplemente lo destruiremos después de un breve retardo
          if (this.enemy.body) { // Deshabilitar cuerpo de física antes de la muerte
            this.enemy.body.enable = false;
          }
          this.enemyHpText.setText(`HP: ${this.enemy.hp}`);
          this.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 500, // Duración de la desaparición
            onUpdate: tween => {
              const v = tween.getValue();
              this.enemy.setScale(v, v); // Escala reducida
              this.enemy.alpha = v; // Fundido
              this.enemyHpText.alpha = v; // Fundido del texto de HP
            },
            onComplete: () => {
              this.enemy.destroy();
              this.enemyHpText.destroy();
            }
          });
        } else if (amount > 0) {
          this.enemyHpText.setText(`HP: ${this.enemy.hp}`);
          // Efecto visual de daño (opcional)
           const knockbackDirection = (this.player.x < this.enemy.x) ? 1 : -1; // Empujar al enemigo en la dirección opuesta al jugador
           this.tweens.add({
             targets: this.enemy,
             alpha: 0.5,
             x: this.enemy.x + (20 * knockbackDirection),
             yoyo: true,
             repeat: 1,
             duration: 100,
             onComplete: () => {
               this.enemy.alpha = 1;
             }
           });
        }
      };

      // Propiedades del enemigo para aggro y ataque
      this.enemy.aggroRange = 300; // Distancia a la que el enemigo detecta al jugador
      this.enemy.meleeRange = 80; // Distancia para el ataque cuerpo a cuerpo
      this.enemy.moveSpeed = 100; // Velocidad de movimiento del enemigo
      this.isEnemyAttacking = false; // Estado de ataque del enemigo
      this.canEnemyAttack = true; // Bandera para controlar el cooldown del ataque del enemigo
      this.enemyAttackCooldownTime = 1500; // Tiempo de cooldown del ataque del enemigo en ms

    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo1Scene');
    }
  }
  
  attackMelee() {
    const meleeRange = 60;
    const meleeWidth = 60;
    const meleeHeight = 80;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 50;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 50 : 25;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 20 : 10));
      }
    }, null, this);
    this.player.once('animationcomplete-attack1', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack1_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }
  
  attackMeleeAir() {
    const meleeRange = 60;
    const meleeWidth = 90;
    const meleeHeight = 110;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 50;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 70 : 35;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 20 : 10));
      }
    }, null, this);
    this.player.once('animationcomplete-jump_attack', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-jump_attack_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  createTrees() {
    const treePositions = [
      { x: 200, y: 605 - 32, type: 'tree1' },
      { x: 900, y: 605 - 32, type: 'tree3' },
      { x: 1600, y: 605 - 32, type: 'tree1' },
      { x: 2300, y: 605 - 32, type: 'tree3' },
      { x: 3000, y: 605 - 32, type: 'tree1' }
    ];
    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, pos.type);
      tree.setOrigin(0.5, 1);
      tree.setScale(3.5);
      tree.setDepth(5);
    });
  }

  attackMelee2() {
    const meleeRange = 70;
    const meleeWidth = 70;
    const meleeHeight = 90;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 60;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 70 : 35;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 30 : 15));
      }
    }, null, this);
    this.player.once('animationcomplete-attack2', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack2_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  attackMelee3() {
    const meleeRange = 80;
    const meleeWidth = 80;
    const meleeHeight = 100;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 70;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 90 : 45;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 40 : 20));
      }
    }, null, this);
    this.player.once('animationcomplete-attack3', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack3_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  loadUltimateAnimations() {
    if (!this.anims.exists('idle_ult')) {
      this.anims.create({
        key: 'idle_ult',
        frames: this.anims.generateFrameNumbers('idle_ult', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('run_ult')) {
      this.anims.create({
        key: 'run_ult',
        frames: this.anims.generateFrameNumbers('run_ult', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: -1
      });
    }
    if (!this.anims.exists('attack1_ult')) {
      this.anims.create({
        key: 'attack1_ult',
        frames: this.anims.generateFrameNumbers('attack1_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('attack2_ult')) {
      this.anims.create({
        key: 'attack2_ult',
        frames: this.anims.generateFrameNumbers('attack2_ult', { start: 0, end: 4 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('attack3_ult')) {
      this.anims.create({
        key: 'attack3_ult',
        frames: this.anims.generateFrameNumbers('attack3_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('jump_attack_ult')) {
      this.anims.create({
        key: 'jump_attack_ult',
        frames: this.anims.generateFrameNumbers('jump_attack_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('shout')) {
      this.anims.create({
        key: 'shout',
        frames: this.anims.generateFrameNumbers('shout', { start: 0, end: 16 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('death')) {
      this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('death', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!this.anims.exists('hurt')) {
      this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('hurt', { start: 0, end: 3 }),
        frameRate: 14,
        repeat: 0
      });
    }
    if (!this.anims.exists('hurt_ult')) {
      this.anims.create({
        key: 'hurt_ult',
        frames: this.anims.generateFrameNumbers('hurt_ult', { start: 0, end: 3 }),
        frameRate: 14,
        repeat: 0
      });
    }
  }

  activateUltimate() {
    console.log('Iniciando activación de ultimate');
    console.log('Animación actual:', this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'ninguna');
    console.log('Estado isAttacking:', this.isAttacking);
    this.player.anims.stop();
    this.isAttacking = false;
    this.activatingUltimate = true;
    this.input.keyboard.enabled = false;
    this.player.setVelocity(0, 0);
    this.player.anims.play('shout', true);
    console.log('Intentando reproducir animación shout, animación actual:', this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'ninguna');
    this.player.once('animationcomplete-shout', () => {
      console.log('Animación shout completada');
      this.ultimateActive = true;
      this.activatingUltimate = false;
      this.input.keyboard.enabled = true;
      this.ultimateTimeLeft = this.ultimateDuration;
      this.ultimateCharge = 100;
      this.player.anims.play('idle_ult', true);
      this.ultimateTimerEvent = this.time.addEvent({
        delay: 100,
        repeat: this.ultimateDuration / 100 - 1,
        callback: () => {
          this.ultimateTimeLeft -= 100;
          this.ultimateCharge = (this.ultimateTimeLeft / this.ultimateDuration) * 100;
          if (this.ultimateTimeLeft <= 0) {
            this.deactivateUltimate();
          }
        }
      });
    }, this);
  }
  

  deactivateUltimate() {
    this.ultimateActive = false;
    this.ultimateCharge = 0;
    this.player.anims.play('idle', true);
    if (this.ultimateTimerEvent) this.ultimateTimerEvent.remove();
  }

  update() {
    try {
      this.debugSystem.update();
      if (this.player) {
        const cam = this.cameras.main;
        const fondoWidth = 800;
        this.bgLayers.forEach(layer => {
          this.bgImages[layer.key].forEach((img, idx) => {
            img.x = (idx * fondoWidth + fondoWidth / 2) - (cam.scrollX * (1 - layer.speed));
            if (img.x + fondoWidth / 2 < cam.scrollX) {
              const maxIdx = Math.max(...this.bgImages[layer.key].map(i => i.x));
              img.x = maxIdx + fondoWidth;
            }
          });
        });
      }
      if (!this.isAttacking && !this.activatingUltimate) {
        if (this.cursors.left.isDown) {
          this.player.body.setVelocityX(-240);
          this.player.setFlipX(true);
          if (this.player.body.touching.down) {
            this.player.anims.play(this.ultimateActive ? 'run_ult' : 'run', true);
          }
        } else if (this.cursors.right.isDown) {
          this.player.body.setVelocityX(240);
          this.player.setFlipX(false);
          if (this.player.body.touching.down) {
            this.player.anims.play(this.ultimateActive ? 'run_ult' : 'run', true);
          }
        } else {
          this.player.body.setVelocityX(0);
          if (this.player.body.touching.down) {
            const animKey = this.ultimateActive ? 'idle_ult' : 'idle';
            console.debug('Jugador quieto, reproduciendo animación:', animKey);
            this.player.anims.play(animKey, true);
          }
        }
      }
      if (this.cursors.jump.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-330);
      }
      if (!this.player.body.touching.down && !this.isAttacking && !this.activatingUltimate) {
        if (this.player.anims.currentAnim.key === 'idle') {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      }
      this.ultimateBar.width = 2 * this.ultimateCharge;
      this.ultimateText.setText(this.ultimateActive ? `${Math.ceil(this.ultimateTimeLeft / 1000)}s` : '');

      // Lógica del enemigo NightBorne
      if (this.enemy && this.player && !this.enemy.isDead && !this.isEnemyAttacking) {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

        if (distanceToPlayer < this.enemy.aggroRange) {
          // El jugador está dentro del aggro range
          if (distanceToPlayer > this.enemy.meleeRange) {
            // Moverse solo horizontalmente hacia el jugador
            if (this.player.x < this.enemy.x) {
              this.enemy.body.setVelocityX(-this.enemy.moveSpeed);
            } else {
              this.enemy.body.setVelocityX(this.enemy.moveSpeed);
            }
            // Voltear el sprite del enemigo según la posición del jugador
            if (this.player.x < this.enemy.x) {
              this.enemy.setFlipX(true); // Mirar a la izquierda
            } else {
              this.enemy.setFlipX(false); // Mirar a la derecha
            }
            // Reproducir animación de caminar del enemigo si no se está reproduciendo y no está atacando
            if (this.enemy.anims.currentAnim.key !== 'nightborne_walk' && !this.isEnemyAttacking) {
              // console.log('Intentando reproducir animación nightborne_walk'); // Log deshabilitado
              this.enemy.anims.play('nightborne_walk', true);
              // Ajustar el offset del cuerpo para la animación de caminar
              this.enemy.body.setOffset(0, -15); // Ajusta el valor -10 según sea necesario para alinear los pies
            }
          } else {
            // Detenerse y preparar ataque (dentro del melee range)
            this.enemy.body.setVelocityX(0);
            // Si el enemigo se detiene en el rango de ataque, asegurarse de que no esté reproduciendo la animación de caminar
            if (this.enemy.anims.currentAnim && this.enemy.anims.currentAnim.key === 'nightborne_walk') { // Comprobar si currentAnim existe
              // console.log('Deteniendo animación nightborne_walk al entrar en rango melee'); // Log deshabilitado
              this.enemy.anims.stop();
              // Restablecer el offset del cuerpo al detener la animación de caminar
              this.enemy.body.setOffset(0, 0); // O el offset por defecto para idle/ataque
              // No reproducimos idle aquí, la lógica de ataque o el estado fuera de rango lo harán
            }
          }
        } else {
          // El jugador está fuera del aggro range, detener al enemigo
          this.enemy.body.setVelocityX(0);
          // Reproducir animación idle del enemigo si no se está moviendo, no está atacando, y no está ya en idle
          if (this.enemy.body.velocity.x === 0 && this.enemy.body.velocity.y === 0 && !this.isEnemyAttacking && (!this.enemy.anims.currentAnim || this.enemy.anims.currentAnim.key !== 'nightborne_idle')) {
            // console.log('Intentando reproducir animación nightborne_idle'); // Log deshabilitado
            this.enemy.anims.play('nightborne_idle', true);
            // Restablecer el offset del cuerpo para la animación idle
            this.enemy.body.setOffset(0, 0); // O el offset por defecto para idle/ataque
          }
        }
      }

      // Lógica para iniciar el ataque del enemigo
      // Esta lógica debe estar fuera del primer if (!this.isEnemyAttacking) para permitir que el ataque interrumpa el movimiento/idle
      if (this.enemy && this.player && !this.enemy.isDead && !this.player.isDead && !this.isEnemyAttacking) {
         const distanceToPlayer = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
         // Si el enemigo está dentro del rango de ataque y no está atacando, iniciar ataque
         if (distanceToPlayer <= this.enemy.meleeRange && this.canEnemyAttack) { // Comprobar también el cooldown
            this.startEnemyAttack(); // Llamar a la función para manejar el ataque
         }
      }

    } catch (error) {
      console.error('Error in game update:', error);
    }
  }

  takePlayerDamage(amount) {
    if (this.player.isDead) return;
    const willDie = (this.player.hp - amount) <= 0;
    this.player.hp -= amount;
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.player.isDead = true;
      this.isAttacking = true;
      this.player.anims.play('death', true);
      this.player.setVelocity(0, 0);
      this.input.keyboard.enabled = false;
      this.time.delayedCall(2000, () => {
        this.scene.restart();
      });
    } else if (amount > 0) {
      // Animación de daño si no muere
      const animKey = this.ultimateActive ? 'hurt_ult' : 'hurt';
      this.isAttacking = true;
      this.player.anims.play(animKey, true);
      this.player.setVelocity(0, 0);
      this.input.keyboard.enabled = false;
      this.player.once('animationcomplete-' + animKey, () => {
        if (!this.player.isDead) {
          this.isAttacking = false;
          this.input.keyboard.enabled = true;
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
    }
    this.playerHpText.setText(`HP: ${this.player.hp}`);
  }

  startEnemyAttack() {
    if (this.isEnemyAttacking || !this.enemy || !this.player || this.enemy.isDead || this.player.isDead || !this.canEnemyAttack) return; // Añadir comprobación de canEnemyAttack

    this.isEnemyAttacking = true;
    this.canEnemyAttack = false; // Establecer canAttack a false al iniciar el ataque
    this.enemy.body.setVelocity(0, 0); // Detener movimiento

    // Voltear el sprite del enemigo para mirar al jugador antes de atacar
    if (this.player.x < this.enemy.x) {
      this.enemy.setFlipX(true); // Mirar a la izquierda
    } else {
      this.enemy.setFlipX(false); // Mirar a la derecha
    }

    this.enemy.anims.play('nightborne_attack', true);

    // Crear hitbox de ataque temporal
    const attackHitboxWidth = 120; // Ancho de la hitbox de ataque del enemigo (ajustar según la animación)
    const attackHitboxHeight = 100; // Altura de la hitbox de ataque del enemigo (ajustar según la animación)
    const facingDirection = this.enemy.flipX ? -1 : 1;
    // Ajustar el offset de la hitbox según la animación del ataque del enemigo
    const hitboxOffsetX = facingDirection * 60; // Offset de ejemplo, ajustar
    const hitboxX = this.enemy.x + hitboxOffsetX;
    const hitboxY = this.enemy.y - this.enemy.displayHeight / 2 + 20; // Ajustar Y para que coincida con el ataque

    const enemyAttackHitbox = this.add.rectangle(hitboxX, hitboxY, attackHitboxWidth, attackHitboxHeight);
    this.physics.add.existing(enemyAttackHitbox);
    enemyAttackHitbox.body.setAllowGravity(false);
    enemyAttackHitbox.body.setImmovable(true);
    enemyAttackHitbox.visible = true; // Ocultar hitbox (cambiar a true para depurar)

    // Colisión con el jugador
    this.physics.add.overlap(enemyAttackHitbox, this.player, () => {
      const damageAmount = 30; // Daño del ataque del enemigo (ajustar según sea necesario)
      if (this.player && !this.player.isDead) {
        // Podríamos añadir una bandera al jugador para no recibir daño múltiple de una sola hitbox de enemigo si es necesario
        console.log('Colisión detectada: Hitbox de NightBorne golpeó al jugador!'); // Log de colisión
        console.log('Jugador golpeado por NightBorne!');
        this.takePlayerDamage(damageAmount);
      }
    }, null, this);

    // Destruir hitbox y resetear estado al completar la animación de ataque
    this.enemy.once('animationcomplete-nightborne_attack', () => {
      console.log('Animación de ataque de NightBorne completada.');
      enemyAttackHitbox.destroy();
      this.isEnemyAttacking = false;

      // Después del ataque, activar el cooldown
      this.time.delayedCall(this.enemyAttackCooldownTime, () => {
        this.canEnemyAttack = true;
        console.log('Cooldown de ataque de NightBorne terminado.');
      }, [], this);

      // Después del ataque, decidir si vuelve a idle o persigue al jugador
      // La lógica en update manejará esto automáticamente al resetear isEnemyAttacking

    });

    // No añadimos un delayedCall aquí para el cooldown de inicio del ataque, 
    // en su lugar, la lógica de inicio de ataque en update + la bandera isEnemyAttacking
    // y el reseteo al final de la animación actúan como cooldowns.

  }
}

export class Mundo2Scene extends Phaser.Scene {
  constructor() {
    super('Mundo2Scene');
  }

  init() {
    this.parentVue = this.game.config.parentVue;
    this.resourceManager = this.game.config.resourceManager;
    this.eventBus = this.game.config.eventBus;
    this.objectPools = this.game.config.objectPools;
    this.gameState = this.game.config.gameState;
    this.debugSystem = new DebugSystem(this);
  }

  preload() {
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
    this.load.spritesheet('attack1', '/assets/player/ATTACK1.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('attack2', '/assets/player/ATTACK 2.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('attack3', '/assets/player/ATTACK 3.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('jump_attack', '/assets/player/JUMP_ATTACK.png', {
      frameWidth: 128,
      frameHeight: 108,
      margin: 0,
      spacing: 0
    });
    this.load.image('bg1', '/assets/Background/1.png');
    this.load.image('bg2', '/assets/Background/2.png');
    this.load.image('bg3', '/assets/Background/3.png');
    this.load.image('tileset', '/assets/Tileset/Tileset.png');
    this.load.image('ground', '/assets/Tileset/ground.png');
    this.load.image('trees', '/assets/Trees/Trees.png');
    this.load.image('props', '/assets/Props/Props.png');
    this.load.image('objects', '/assets/Props/Objects.png');
    this.load.image('flag', '/assets/Props/Flag.png');
    this.load.image('tree1', '/assets/Trees/tree1.png');
    this.load.image('tree3', '/assets/Trees/tree3.png');
    this.load.image('portal', '/assets/Props/portal.png');
    this.load.spritesheet('idle_ult', '/assets/player/ultimate/IDLE (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('run_ult', '/assets/player/ultimate/RUN (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack1_ult', '/assets/player/ultimate/ATTACK 1 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack2_ult', '/assets/player/ultimate/ATTACK 2 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack3_ult', '/assets/player/ultimate/ATTACK 3 (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('jump_attack_ult', '/assets/player/ultimate/JUMP ATTACK (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('shout', '/assets/player/ultimate/SHOUT.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
  }

  create() {
    try {
      this.debugSystem.init();
      this.physics.world.setBounds(0, 0, 3200, 600);
      this.cameras.main.fadeIn(500, 0, 0, 0);
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
      if (!this.anims.exists('attack1')) {
        this.anims.create({
          key: 'attack1',
          frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('attack2')) {
        this.anims.create({
          key: 'attack2',
          frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 4 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('attack3')) {
        this.anims.create({
          key: 'attack3',
          frames: this.anims.generateFrameNumbers('attack3', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      if (!this.anims.exists('jump_attack')) {
        this.anims.create({
          key: 'jump_attack',
          frames: this.anims.generateFrameNumbers('jump_attack', { start: 0, end: 6 }),
          frameRate: 18,
          repeat: 0
        });
      }
      this.loadUltimateAnimations();
      this.portal = this.physics.add.staticImage(300, 605 - 32, 'portal');
      this.portal.setOrigin(0.5, 1);
      this.portal.setScale(2);
      this.portal.setDepth(5);
      this.player = this.physics.add.sprite(320, 450, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);
      this.cameras.main.setBounds(0, 0, 3200, 600);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);
      this.ground = this.add.tileSprite(0, 605, 3200, 32, 'ground');
      this.ground.setOrigin(0, 1);
      this.groundCollider = this.physics.add.staticSprite(1600, 620 - 16, null);
      this.groundCollider.displayWidth = 3200;
      this.groundCollider.displayHeight = 32;
      this.groundCollider.refreshBody();
      this.groundCollider.setVisible(false);
      this.physics.add.collider(this.player, this.groundCollider); // Colisión del jugador con el suelo
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
      this.createTrees();
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        attack2: Phaser.Input.Keyboard.KeyCodes.Q,
        attack3: Phaser.Input.Keyboard.KeyCodes.E
      });
      this.player.anims.play('idle', true);
      this.player.setDepth(10);
      this.isAttacking = false;
      this.attackCooldown = false;
      this.attackCooldownTime = 400;
      this.attack2Cooldown = false;
      this.attack2CooldownTime = 600;
      this.attack3Cooldown = false;
      this.attack3CooldownTime = 800;
      this.jumpAttackCooldown = false;
      this.jumpAttackCooldownTime = 1200;
      this.input.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown() && !this.isAttacking) {
          if (this.player.body.touching.down && !this.attackCooldown) {
            this.isAttacking = true;
            this.attackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'attack1_ult' : 'attack1', true);
            this.player.setVelocityX(0);
            this.attackMelee();
            this.time.delayedCall(this.attackCooldownTime, () => {
              this.attackCooldown = false;
            });
          } else if (!this.player.body.touching.down && !this.jumpAttackCooldown) {
            this.isAttacking = true;
            this.jumpAttackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'jump_attack_ult' : 'jump_attack', true);
            this.player.setVelocityX(0);
            this.attackMeleeAir();
            this.time.delayedCall(this.jumpAttackCooldownTime, () => {
              this.jumpAttackCooldown = false;
            });
          }
        }
      });
      this.player.on('animationcomplete-attack1', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack2', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack3', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-jump_attack', () => {
        this.isAttacking = false;
        if (!this.player.body.touching.down) {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      });
      this.player.on('animationcomplete-attack1_ult', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-attack2_ult', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-attack3_ult', () => {
        this.isAttacking = false;
        if (this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.player.on('animationcomplete-jump_attack_ult', () => {
        this.isAttacking = false;
        if (!this.player.body.touching.down) {
          this.player.anims.play('idle_ult', true);
        }
      });
      this.input.keyboard.on('keydown-Q', () => {
        console.log('Tecla Q presionada. ultimateActive:', this.ultimateActive, ' isAttacking:', this.isAttacking, ' touching.down:', this.player.body.touching.down, ' attack2Cooldown:', this.attack2Cooldown);
        if (!this.isAttacking && this.player.body.touching.down && !this.attack2Cooldown) {
          this.isAttacking = true;
          this.attack2Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack2_ult' : 'attack2', true);
          this.player.setVelocityX(0);
          this.attackMelee2();
          this.time.delayedCall(this.attack2CooldownTime, () => {
            this.attack2Cooldown = false;
          });
        }
      });
      this.input.keyboard.on('keydown-E', () => {
        console.log('Tecla E presionada. ultimateActive:', this.ultimateActive, ' isAttacking:', this.isAttacking, ' touching.down:', this.player.body.touching.down, ' attack3Cooldown:', this.attack3Cooldown);
        if (!this.isAttacking && this.player.body.touching.down && !this.attack3Cooldown) {
          this.isAttacking = true;
          this.attack3Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack3_ult' : 'attack3', true);
          this.player.setVelocityX(0);
          this.attackMelee3();
          this.time.delayedCall(this.attack3CooldownTime, () => {
            this.attack3Cooldown = false;
          });
        }
      });
    } catch (error) {
      console.error('Error in game creation:', error);
      this.scene.start('Mundo2Scene');
    }
  }

  createTrees() {
    const treePositions = [
      { x: 200, y: 605 - 32, type: 'tree1' },
      { x: 900, y: 605 - 32, type: 'tree3' },
      { x: 1600, y: 605 - 32, type: 'tree1' },
      { x: 2300, y: 605 - 32, type: 'tree3' },
      { x: 3000, y: 605 - 32, type: 'tree1' }
    ];
    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, pos.type);
      tree.setOrigin(0.5, 1);
      tree.setScale(3.5);
      tree.setDepth(5);
    });
  }

  attackMelee() {
    const meleeRange = 60;
    const meleeWidth = 60;
    const meleeHeight = 80;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 50;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 50 : 25;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 20 : 10));
      }
    }, null, this);
    this.player.once('animationcomplete-attack1', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack1_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  attackMeleeAir() {
    const meleeRange = 60;
    const meleeWidth = 90;
    const meleeHeight = 110;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 50;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 70 : 35;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 20 : 10));
      }
    }, null, this);
    this.player.once('animationcomplete-jump_attack', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-jump_attack_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  attackMelee2() {
    const meleeRange = 70;
    const meleeWidth = 70;
    const meleeHeight = 90;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 60;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 70 : 35;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 30 : 15));
      }
    }, null, this);
    this.player.once('animationcomplete-attack2', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack2_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  attackMelee3() {
    const meleeRange = 80;
    const meleeWidth = 80;
    const meleeHeight = 100;
    const facing = this.player.flipX ? -1 : 1;
    const offsetX = facing * 70;
    const hitboxX = this.player.x + offsetX;
    const hitboxY = this.player.y;
    if (this.enemy) this.enemy.wasHitThisAttack = false;
    this.attackHitbox = this.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
    this.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setImmovable(true);
    this.attackHitbox.visible = false;
    this.physics.add.overlap(this.attackHitbox, this.enemy, () => {
      const damage = this.ultimateActive ? 90 : 45;
      if (this.enemy && !this.enemy.wasHitThisAttack) {
        this.enemy.takeDamage(damage);
        this.ultimateCharge = Math.min(100, this.ultimateCharge + (this.ultimateActive ? 40 : 20));
      }
    }, null, this);
    this.player.once('animationcomplete-attack3', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
    this.player.once('animationcomplete-attack3_ult', () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
    });
  }

  loadUltimateAnimations() {
    if (!this.anims.exists('idle_ult')) {
      this.anims.create({
        key: 'idle_ult',
        frames: this.anims.generateFrameNumbers('idle_ult', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('run_ult')) {
      this.anims.create({
        key: 'run_ult',
        frames: this.anims.generateFrameNumbers('run_ult', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: -1
      });
    }
    if (!this.anims.exists('attack1_ult')) {
      this.anims.create({
        key: 'attack1_ult',
        frames: this.anims.generateFrameNumbers('attack1_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('attack2_ult')) {
      this.anims.create({
        key: 'attack2_ult',
        frames: this.anims.generateFrameNumbers('attack2_ult', { start: 0, end: 4 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('attack3_ult')) {
      this.anims.create({
        key: 'attack3_ult',
        frames: this.anims.generateFrameNumbers('attack3_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('jump_attack_ult')) {
      this.anims.create({
        key: 'jump_attack_ult',
        frames: this.anims.generateFrameNumbers('jump_attack_ult', { start: 0, end: 6 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('shout')) {
      this.anims.create({
        key: 'shout',
        frames: this.anims.generateFrameNumbers('shout', { start: 0, end: 16 }),
        frameRate: 18,
        repeat: 0
      });
    }
    if (!this.anims.exists('death')) {
      this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('death', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!this.anims.exists('hurt')) {
      this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('hurt', { start: 0, end: 3 }),
        frameRate: 14,
        repeat: 0
      });
    }
    if (!this.anims.exists('hurt_ult')) {
      this.anims.create({
        key: 'hurt_ult',
        frames: this.anims.generateFrameNumbers('hurt_ult', { start: 0, end: 3 }),
        frameRate: 14,
        repeat: 0
      });
    }
  }

  activateUltimate() {
    console.log('Iniciando activación de ultimate');
    console.log('Animación actual:', this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'ninguna');
    console.log('Estado isAttacking:', this.isAttacking);
    this.player.anims.stop();
    this.isAttacking = false;
    this.activatingUltimate = true;
    this.input.keyboard.enabled = false;
    this.player.setVelocity(0, 0);
    this.player.anims.play('shout', true);
    console.log('Intentando reproducir animación shout, animación actual:', this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'ninguna');
    this.player.once('animationcomplete-shout', () => {
      console.log('Animación shout completada');
      this.ultimateActive = true;
      this.activatingUltimate = false;
      this.input.keyboard.enabled = true;
      this.ultimateTimeLeft = this.ultimateDuration;
      this.ultimateCharge = 100;
      this.player.anims.play('idle_ult', true);
      this.ultimateTimerEvent = this.time.addEvent({
        delay: 100,
        repeat: this.ultimateDuration / 100 - 1,
        callback: () => {
          this.ultimateTimeLeft -= 100;
          this.ultimateCharge = (this.ultimateTimeLeft / this.ultimateDuration) * 100;
          if (this.ultimateTimeLeft <= 0) {
            this.deactivateUltimate();
          }
        }
      });
    }, this);
  }

  deactivateUltimate() {
    this.ultimateActive = false;
    this.ultimateCharge = 0;
    this.player.anims.play('idle', true);
    if (this.ultimateTimerEvent) this.ultimateTimerEvent.remove();
  }

  update() {
    try {
      this.debugSystem.update();
      if (this.player) {
        const cam = this.cameras.main;
        const fondoWidth = 800;
        this.bgLayers.forEach(layer => {
          this.bgImages[layer.key].forEach((img, idx) => {
            img.x = (idx * fondoWidth + fondoWidth / 2) - (cam.scrollX * (1 - layer.speed));
            if (img.x + fondoWidth / 2 < cam.scrollX) {
              const maxIdx = Math.max(...this.bgImages[layer.key].map(i => i.x));
              img.x = maxIdx + fondoWidth;
            }
          });
        });
      }
      if (!this.isAttacking && !this.activatingUltimate) {
        if (this.cursors.left.isDown) {
          this.player.body.setVelocityX(-240);
          this.player.setFlipX(true);
          if (this.player.body.touching.down) {
            this.player.anims.play(this.ultimateActive ? 'run_ult' : 'run', true);
          }
        } else if (this.cursors.right.isDown) {
          this.player.body.setVelocityX(240);
          this.player.setFlipX(false);
          if (this.player.body.touching.down) {
            this.player.anims.play(this.ultimateActive ? 'run_ult' : 'run', true);
          }
        } else {
          this.player.body.setVelocityX(0);
          if (this.player.body.touching.down) {
            const animKey = this.ultimateActive ? 'idle_ult' : 'idle';
            console.debug('Jugador quieto, reproduciendo animación:', animKey);
            this.player.anims.play(animKey, true);
          }
        }
      }
      if (this.cursors.jump.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-330);
      }
      if (!this.player.body.touching.down && !this.isAttacking && !this.activatingUltimate) {
        if (this.player.anims.currentAnim.key === 'idle') {
          this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true);
        }
      }
      this.ultimateBar.width = 2 * this.ultimateCharge;
      this.ultimateText.setText(this.ultimateActive ? `${Math.ceil(this.ultimateTimeLeft / 1000)}s` : '');

      // Lógica del enemigo NightBorne
      if (this.enemy && this.player && !this.enemy.isDead && !this.isEnemyAttacking) {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

        if (distanceToPlayer < this.enemy.aggroRange) {
          // El jugador está dentro del aggro range
          if (distanceToPlayer > this.enemy.meleeRange) {
            // Moverse solo horizontalmente hacia el jugador
            if (this.player.x < this.enemy.x) {
              this.enemy.body.setVelocityX(-this.enemy.moveSpeed);
            } else {
              this.enemy.body.setVelocityX(this.enemy.moveSpeed);
            }
            // Voltear el sprite del enemigo según la posición del jugador
            if (this.player.x < this.enemy.x) {
              this.enemy.setFlipX(true); // Mirar a la izquierda
            } else {
              this.enemy.setFlipX(false); // Mirar a la derecha
            }
            // Reproducir animación de caminar del enemigo si no se está reproduciendo y no está atacando
            if (this.enemy.anims.currentAnim.key !== 'nightborne_walk' && !this.isEnemyAttacking) {
              // console.log('Intentando reproducir animación nightborne_walk'); // Log deshabilitado
              this.enemy.anims.play('nightborne_walk', true);
              // Ajustar el offset del cuerpo para la animación de caminar
              this.enemy.body.setOffset(0, -10); // Ajusta el valor -10 según sea necesario para alinear los pies
            }
          } else {
            // Detenerse y preparar ataque (dentro del melee range)
            this.enemy.body.setVelocityX(0);
            // Si el enemigo se detiene en el rango de ataque, asegurarse de que no esté reproduciendo la animación de caminar
            if (this.enemy.anims.currentAnim && this.enemy.anims.currentAnim.key === 'nightborne_walk') { // Comprobar si currentAnim existe
              // console.log('Deteniendo animación nightborne_walk al entrar en rango melee'); // Log deshabilitado
              this.enemy.anims.stop();
              // Restablecer el offset del cuerpo al detener la animación de caminar
              this.enemy.body.setOffset(0, 0); // O el offset por defecto para idle/ataque
              // No reproducimos idle aquí, la lógica de ataque o el estado fuera de rango lo harán
            }
          }
        } else {
          // El jugador está fuera del aggro range, detener al enemigo
          this.enemy.body.setVelocityX(0);
          // Reproducir animación idle del enemigo si no se está moviendo, no está atacando, y no está ya en idle
          if (this.enemy.body.velocity.x === 0 && this.enemy.body.velocity.y === 0 && !this.isEnemyAttacking && (!this.enemy.anims.currentAnim || this.enemy.anims.currentAnim.key !== 'nightborne_idle')) {
            // console.log('Intentando reproducir animación nightborne_idle'); // Log deshabilitado
            this.enemy.anims.play('nightborne_idle', true);
            // Restablecer el offset del cuerpo para la animación idle
            this.enemy.body.setOffset(0, 0); // O el offset por defecto para idle/ataque
          }
        }
      }

      // Lógica para iniciar el ataque del enemigo
      // Esta lógica debe estar fuera del primer if (!this.isEnemyAttacking) para permitir que el ataque interrumpa el movimiento/idle
      if (this.enemy && this.player && !this.enemy.isDead && !this.player.isDead && !this.isEnemyAttacking) {
         const distanceToPlayer = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
         // Si el enemigo está dentro del rango de ataque y no está atacando, iniciar ataque
         if (distanceToPlayer <= this.enemy.meleeRange && this.canEnemyAttack) { // Comprobar también el cooldown
            this.startEnemyAttack(); // Llamar a la función para manejar el ataque
         }
      }

    } catch (error) {
      console.error('Error in game update:', error);
    }
  }
}