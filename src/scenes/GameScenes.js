import Phaser from 'phaser';
import { DebugSystem } from '../utils/DebugSystem';
import { Goblin } from '../entities/Goblin';
import { Mushroom } from '../entities/Mushroom';
import { attackMelee, attackMeleeAir, attackMelee2, attackMelee3, showDamageText, healPlayer, applyDamageOverTime } from '../utils/PlayerUtils';
import { audioManager } from '../utils/AudioManager';

export class Mundo1Scene extends Phaser.Scene {
  constructor() {
    super('Mundo1Scene');
    // Constantes para las barras de vida
    this.HEALTH_BAR_WIDTH = 200;
    this.HEALTH_BAR_HEIGHT = 20;
    this.HEALTH_BAR_MARGIN_TOP = 20;
    this.HEALTH_BAR_MARGIN_LEFT = 40;
    this.hasPotion = false;
    this.score = 0; // Añadir puntuación inicial
    this.deathCount = 0;
  }

  init(data) {
    this.parentVue = this.game.config.parentVue;
    this.resourceManager = this.game.config.resourceManager;
    this.eventBus = this.game.config.eventBus;
    this.objectPools = this.game.config.objectPools;
    this.gameState = this.game.config.gameState;
    this.debugSystem = new DebugSystem(this);
    this.goblins = [];
    this.hasPotion = data && data.hasPotion !== undefined ? data.hasPotion : false;
    this.score = data && data.score !== undefined ? data.score : 0;
    this.initialScore = this.score;
    this.deathCount = data && data.deathCount !== undefined ? data.deathCount : 0;
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

    // Cargar animaciones del goblin
    this.load.spritesheet('goblin_idle', '/assets/enemies/Goblin/Idle.png', {
      frameWidth: 150,
      frameHeight: 135,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('goblin_run', '/assets/enemies/Goblin/Run.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('goblin_attack', '/assets/enemies/Goblin/Attack.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('goblin_take_hit', '/assets/enemies/Goblin/Take Hit.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('goblin_death', '/assets/enemies/Goblin/Death.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.image('potion', '/assets/items/potion.png');
    
    // Cargar efectos de sonido para ataques
    this.load.audio('attackBasic', '/assets/sounds/111.mp3');
    this.load.audio('attackSpecial', '/assets/sounds/222.mp3'); 
    this.load.audio('attackPowerful', '/assets/sounds/333.mp3');
    
    // Cargar música de fondo
    this.load.audio('menuPrincipal', '/assets/sounds/menu principal.mp3');
    this.load.audio('menuGame', '/assets/sounds/menu1.mp3');
    this.load.audio('menuDeath', '/assets/sounds/menu2.mp3');
    this.load.audio('menuVictory', '/assets/sounds/menu3.mp3');
  }

  create() {
    try {
      this.debugSystem.init();
      
      // Inicializar audioManager y reproducir música de juego
      audioManager.init(this);
      audioManager.playMusic('menuGame');
      
      this.physics.world.setBounds(0, 0, 3200, 600);
      this.player = this.physics.add.sprite(300, 300, 'idle');
      this.player.setScale(1.5);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);
      // Ajustar la hitbox del jugador
      this.player.body.setSize(80, 100, true); // Ajustar tamaño de la hitbox (ejemplo)
      this.player.body.setOffset(24, 5); // Ajustar offset vertical para que se vea en el suelo

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
      this.physics.add.collider(this.player, this.groundCollider);
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
          // Pasar el estado de la poción y la puntuación al Mundo2Scene
          this.scene.start('Mundo2Scene', { 
            hasPotion: this.hasPotion,
            score: this.score,
            deathCount: this.deathCount
          });
        });
      }, null, this);
      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        attack2: Phaser.Input.Keyboard.KeyCodes.Q,
        attack3: Phaser.Input.Keyboard.KeyCodes.E,
        usePotion: Phaser.Input.Keyboard.KeyCodes.F
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
      this.player.hp = 300;
      this.player.maxHp = 300;
      this.player.isDead = false;
      
      // Crear barra de vida del jugador
      // Fondo de la barra (gris)
      this.playerHealthBarBg = this.add.rectangle(
        this.HEALTH_BAR_MARGIN_LEFT,
        this.HEALTH_BAR_MARGIN_TOP,
        this.HEALTH_BAR_WIDTH,
        this.HEALTH_BAR_HEIGHT,
        0x666666
      ).setOrigin(0, 0).setScrollFactor(0);
      
      // Barra de vida (verde)
      this.playerHealthBar = this.add.rectangle(
        this.HEALTH_BAR_MARGIN_LEFT,
        this.HEALTH_BAR_MARGIN_TOP,
        this.HEALTH_BAR_WIDTH,
        this.HEALTH_BAR_HEIGHT,
        0x00ff00
      ).setOrigin(0, 0).setScrollFactor(0);
      
      this.input.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown() && !this.isAttacking) {
          if (this.player.body.touching.down && !this.attackCooldown) {
            this.isAttacking = true;
            this.attackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'attack1_ult' : 'attack1', true);
            this.player.setVelocityX(0);
            // Reproducir sonido de ataque básico
            this.sound.play('attackBasic', { volume: 0.5 });
            attackMelee(this, this.player, this.goblins, this.ultimateActive);
            this.time.delayedCall(this.attackCooldownTime, () => {
              this.attackCooldown = false;
            });
          } else if (!this.player.body.touching.down && !this.jumpAttackCooldown) {
            this.isAttacking = true;
            this.jumpAttackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'jump_attack_ult' : 'jump_attack', true);
            this.player.setVelocityX(0);
            // Reproducir sonido de ataque básico para jump attack
            this.sound.play('attackBasic', { volume: 0.5 });
            attackMeleeAir(this, this.player, this.goblins, this.ultimateActive);
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
          // Reproducir sonido de ataque especial (Q)
          this.sound.play('attackSpecial', { volume: 0.5 });
          attackMelee2(this, this.player, this.goblins, this.ultimateActive);
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
          // Reproducir sonido de ataque poderoso (E)
          this.sound.play('attackPowerful', { volume: 0.5 });
          attackMelee3(this, this.player, this.goblins, this.ultimateActive);
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
      const barWidth = 200;
      const barHeight = 20;
      const marginTop = 20;
      const centerX = this.cameras.main.width - barWidth - 20; // Cambiar a la derecha
      this.ultimateBarBg = this.add.rectangle(centerX, marginTop, barWidth, barHeight, 0x222222)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateBar = this.add.rectangle(centerX, marginTop, 0, barHeight, 0xffd700)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateText = this.add.text(centerX + barWidth + 10, marginTop, '', { font: 'bold 16px Arial', fill: '#fff' })
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.scale.on('resize', (gameSize) => {
        const newCenterX = gameSize.width - barWidth - 20; // Actualizar posición en resize
        this.ultimateBarBg.x = newCenterX;
        this.ultimateBar.x = newCenterX;
        this.ultimateText.x = newCenterX + barWidth + 10;
      });

      // Crear goblins
      this.createGoblins();

      // Añadir texto para mostrar si tiene poción
      this.potionText = this.add.text(20, 50, this.hasPotion ? 'Poción: F para usar' : '', {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setScrollFactor(0);

      // Añadir texto para mostrar la puntuación
      this.scoreText = this.add.text(20, 80, 'Puntuación: 0', {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setScrollFactor(0);
    } catch (error) {
      console.error('Error in create:', error);
      this.scene.start('Mundo1Scene');
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
      // Detener completamente al jugador tras la ulti
      this.player.setVelocity(0, 0);
      this.player.body.setAcceleration(0, 0);
      this.player.body.setDrag(1000, 0);
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

  createGoblins() {
    // Crear goblins en diferentes posiciones a lo largo del mundo
    const goblinPositions = [
      { x: 500, y: 555 },    // Primer grupo
      { x: 530, y: 555 },
      { x: 560, y: 555 },
      { x: 1000, y: 555 },   // Segundo grupo
      { x: 1030, y: 555 },
      { x: 1060, y: 555 },
      { x: 1500, y: 555 },   // Tercer grupo
      { x: 1530, y: 555 },
      { x: 1560, y: 555 },
      { x: 2000, y: 555 },   // Cuarto grupo
      { x: 2030, y: 555 },
      { x: 2060, y: 555 },
      { x: 2500, y: 555 },   // Quinto grupo
      { x: 2530, y: 555 },
      { x: 2560, y: 555 }
    ];

    goblinPositions.forEach(pos => {
      const goblin = new Goblin(this, pos.x, pos.y);
      this.goblins.push(goblin);
      this.physics.add.collider(goblin, this.groundCollider);
    });
  }

  update() {
    try {
      this.debugSystem.update();
      
      // Actualizar fondos
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

      // Comprobar si se presiona la tecla F para usar la poción
      if (this.cursors.usePotion.isDown && this.hasPotion) {
        this.usePotion();
      }

      // Actualizar texto de la poción
      this.potionText.setText(this.hasPotion ? 'Poción: F para usar' : '');

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

      // Actualizar goblins
      this.goblins.forEach(goblin => {
        if (goblin && !goblin.isDead) {
          goblin.update(this.player);
        }
      });

      // Limpiar goblins muertos
      this.goblins = this.goblins.filter(goblin => goblin && !goblin.isDead);
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
      // Resetear puntuación a 0 por muerte
      this.score = 0;
      this.scoreText.setText(`Puntuación: ${this.score}`);
      // Detener música de juego antes de mostrar el menú de muerte
      audioManager.stopAllMusic();
      this.time.delayedCall(2000, () => {
        window.dispatchEvent(new CustomEvent('player-died'));
      });
      this.deathCount++;
    } else if (amount > 0) {
      const animKey = this.ultimateActive ? 'hurt_ult' : 'hurt';
      this.isAttacking = true;
      this.player.anims.play(animKey, true);
      
      // Forzar detención del jugador
      this.player.setVelocity(0, 0);
      this.player.body.setAcceleration(0, 0);
      this.player.body.setDrag(1000, 0);
      
      // Deshabilitar controles temporalmente
      this.input.keyboard.enabled = false;
      
      // Guardar el estado de la ultimate
      const wasUltimateActive = this.ultimateActive;
      
      this.player.once('animationcomplete-' + animKey, () => {
        if (!this.player.isDead) {
          this.isAttacking = false;
          this.input.keyboard.enabled = true;
          
          // Resetear el estado de las teclas para evitar inputs pegados
          this.cursors.left.isDown = false;
          this.cursors.right.isDown = false;
          this.cursors.jump.isDown = false;
          
          // Asegurar que la velocidad está en 0
          this.player.setVelocity(0, 0);
          this.player.body.setAcceleration(0, 0);
          this.player.body.setDrag(0, 0);
          
          // Restaurar la animación correcta basada en el estado de la ultimate
          if (wasUltimateActive) {
            this.player.anims.play('idle_ult', true);
          } else {
            this.player.anims.play('idle', true);
          }
        }
      });
    }
    
    // Actualizar barra de vida
    const healthPercent = this.player.hp / this.player.maxHp;
    this.playerHealthBar.width = this.HEALTH_BAR_WIDTH * healthPercent;
    
    // Cambiar color según la vida
    if (healthPercent > 0.6) {
      this.playerHealthBar.fillColor = 0x00ff00; // Verde
    } else if (healthPercent > 0.3) {
      this.playerHealthBar.fillColor = 0xffff00; // Amarillo
    } else {
      this.playerHealthBar.fillColor = 0xff0000; // Rojo
    }
  }

  usePotion() {
    if (!this.hasPotion) return;

    // Recargar la ultimate al 100%
    this.ultimateCharge = 100;
    this.hasPotion = false;

    // Efecto visual de uso
    const useText = this.add.text(this.player.x, this.player.y - 30, '¡Ultimate Recargada!', {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación del texto
    this.tweens.add({
      targets: useText,
      y: this.player.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        useText.destroy();
      }
    });
  }

  // Añadir método para actualizar la puntuación
  updateScore(points) {
    this.score += points;
    this.scoreText.setText(`Puntuación: ${this.score}`);
    
    // Efecto visual de puntos ganados
    const scoreText = this.add.text(this.player.x, this.player.y - 30, `+${points}`, {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación del texto
    this.tweens.add({
      targets: scoreText,
      y: this.player.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        scoreText.destroy();
      }
    });
  }
}

export class Potion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'potion');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración física
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.body.setGravityY(300);
    this.setScale(0.5);
    this.setDepth(10);

    // Añadir colisión con el suelo
    scene.physics.add.collider(this, scene.groundCollider);

    // Añadir colisión con el jugador
    scene.physics.add.overlap(scene.player, this, this.collect, null, this);
  }

  collect() {
    // Guardar la poción en el inventario
    this.scene.hasPotion = true;
    
    // Efecto visual de recolección
    const collectText = this.scene.add.text(this.x, this.y - 30, '¡Poción Recogida!', {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación del texto
    this.scene.tweens.add({
      targets: collectText,
      y: this.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        collectText.destroy();
      }
    });

    // Destruir la poción del mundo
    this.destroy();
  }
}

export class Mundo2Scene extends Phaser.Scene {
  constructor() {
    super('Mundo2Scene');
    // Constantes para las barras de vida
    this.HEALTH_BAR_WIDTH = 200;
    this.HEALTH_BAR_HEIGHT = 20;
    this.HEALTH_BAR_MARGIN_TOP = 20;
    this.HEALTH_BAR_MARGIN_LEFT = 40;
    this.hasPotion = false;
    this.score = 0; // Añadir puntuación inicial
    this.initialScore = 0;
  }

  init(data) {
    this.parentVue = this.game.config.parentVue;
    this.resourceManager = this.game.config.resourceManager;
    this.eventBus = this.game.config.eventBus;
    this.objectPools = this.game.config.objectPools;
    this.gameState = this.game.config.gameState;
    this.debugSystem = new DebugSystem(this);
    this.hasPotion = data.hasPotion || false;
    this.score = data.score || 0; // Recibir puntuación del mundo anterior
    this.initialScore = this.score; // Guardar la puntuación inicial
    this.deathCount = data.deathCount || 0;
  }

  preload() {
    // Cargar assets del jugador y del entorno
    this.load.spritesheet('idle', '/assets/player/IDLE.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('run', '/assets/player/RUN.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack1', '/assets/player/ATTACK 1.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack2', '/assets/player/ATTACK 2.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('attack3', '/assets/player/ATTACK 3.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('jump_attack', '/assets/player/JUMP_ATTACK.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
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
    this.load.spritesheet('death', '/assets/player/DEATH.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('hurt', '/assets/player/HURT.png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.spritesheet('hurt_ult', '/assets/player/ultimate/HURT (FLAMING SWORD).png', { frameWidth: 128, frameHeight: 108, margin: 0, spacing: 0 });
    this.load.image('potion', '/assets/items/potion.png');

    // Cargar spritesheets del champiñón (Mushroom)
    this.load.spritesheet('mushroom_idle', '/assets/enemies/Mushroom/Idle.png', {
      frameWidth: 150,
      frameHeight: 135,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('mushroom_run', '/assets/enemies/Mushroom/Run.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('mushroom_attack', '/assets/enemies/Mushroom/Attack.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('mushroom_take_hit', '/assets/enemies/Mushroom/Take Hit.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('mushroom_death', '/assets/enemies/Mushroom/Death.png', {
      frameWidth: 150,
      frameHeight: 150,
      margin: 0,
      spacing: 0
    });
    
    // Cargar efectos de sonido para ataques
    this.load.audio('attackBasic', '/assets/sounds/111.mp3');
    this.load.audio('attackSpecial', '/assets/sounds/222.mp3'); 
    this.load.audio('attackPowerful', '/assets/sounds/333.mp3');
    
    // Cargar música de fondo
    this.load.audio('menuPrincipal', '/assets/sounds/menu principal.mp3');
    this.load.audio('menuGame', '/assets/sounds/menu1.mp3');
    this.load.audio('menuDeath', '/assets/sounds/menu2.mp3');
    this.load.audio('menuVictory', '/assets/sounds/menu3.mp3');
  }

  create() {
    try {
      this.debugSystem.init();
      
      // Inicializar audioManager y reproducir música de juego
      audioManager.init(this);
      audioManager.playMusic('menuGame');
      
      this.physics.world.setBounds(0, 0, 3200, 600);
      this.cameras.main.fadeIn(500, 0, 0, 0);

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
      this.physics.add.collider(this.player, this.groundCollider);

      window.addEventListener('player-died', this.handlePlayerDeathBound = this.handlePlayerDeath.bind(this));

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

      // Añadir el portal decorativo en la posición de inicio del jugador
      this.add.image(320, 605 - 32, 'portal').setOrigin(0.5, 1).setScale(2).setDepth(5);

      // --- AÑADIR MUSHROOM AL SEGUNDO MUNDO ---
      this.mushrooms = [];
      const mushroomPositions = [
        { x: 800, y: 555 },   // Primer grupo
        { x: 830, y: 555 },
        { x: 1200, y: 555 },  // Segundo grupo
        { x: 1230, y: 555 },
        { x: 1600, y: 555 },  // Tercer grupo
        { x: 1630, y: 555 },
        { x: 2000, y: 555 },  // Cuarto grupo
        { x: 2030, y: 555 },
        { x: 2400, y: 555 },  // Quinto grupo
        { x: 2430, y: 555 },
        { x: 2800, y: 555 },  // Sexto grupo
        { x: 2830, y: 555 }
      ];

      mushroomPositions.forEach(pos => {
        const mushroom = new Mushroom(this, pos.x, pos.y);
        this.mushrooms.push(mushroom);
        this.physics.add.collider(mushroom, this.groundCollider);
      });
      // ----------------------------------------

      this.cursors = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        attack2: Phaser.Input.Keyboard.KeyCodes.Q,
        attack3: Phaser.Input.Keyboard.KeyCodes.E,
        usePotion: Phaser.Input.Keyboard.KeyCodes.F
      });

      // Crear animaciones del jugador
      if (!this.anims.exists('idle')) { this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }), frameRate: 12, repeat: -1 }); }
      if (!this.anims.exists('run')) { this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }), frameRate: 14, repeat: -1 }); }
      if (!this.anims.exists('attack1')) { this.anims.create({ key: 'attack1', frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 6 }), frameRate: 18, repeat: 0 }); }
      if (!this.anims.exists('attack2')) { this.anims.create({ key: 'attack2', frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 4 }), frameRate: 18, repeat: 0 }); }
      if (!this.anims.exists('attack3')) { this.anims.create({ key: 'attack3', frames: this.anims.generateFrameNumbers('attack3', { start: 0, end: 6 }), frameRate: 18, repeat: 0 }); }
      if (!this.anims.exists('jump_attack')) { this.anims.create({ key: 'jump_attack', frames: this.anims.generateFrameNumbers('jump_attack', { start: 0, end: 6 }), frameRate: 18, repeat: 0 }); }
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

      // Configurar UI
      this.player.hp = 300;
      this.player.maxHp = 300;
      this.player.isDead = false;

      this.playerHealthBarBg = this.add.rectangle(
        this.HEALTH_BAR_MARGIN_LEFT,
        this.HEALTH_BAR_MARGIN_TOP,
        this.HEALTH_BAR_WIDTH,
        this.HEALTH_BAR_HEIGHT,
        0x666666
      ).setOrigin(0, 0).setScrollFactor(0);

      this.playerHealthBar = this.add.rectangle(
        this.HEALTH_BAR_MARGIN_LEFT,
        this.HEALTH_BAR_MARGIN_TOP,
        this.HEALTH_BAR_WIDTH,
        this.HEALTH_BAR_HEIGHT,
        0x00ff00
      ).setOrigin(0, 0).setScrollFactor(0);

      this.ultimateCharge = 0;
      this.ultimateActive = false;
      this.ultimateDuration = 15000;
      this.ultimateTimeLeft = 0;

      const barWidth = 200;
      const barHeight = 20;
      const marginTop = 20;
      const centerX = this.cameras.main.width - barWidth - 20;
      this.ultimateBarBg = this.add.rectangle(centerX, marginTop, barWidth, barHeight, 0x222222)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateBar = this.add.rectangle(centerX, marginTop, 0, barHeight, 0xffd700)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.ultimateText = this.add.text(centerX + barWidth + 10, marginTop, '', { font: 'bold 16px Arial', fill: '#fff' })
        .setOrigin(0, 0)
        .setScrollFactor(0);

      this.scale.on('resize', (gameSize) => {
        const newCenterX = gameSize.width - barWidth - 20;
        this.ultimateBarBg.x = newCenterX;
        this.ultimateBar.x = newCenterX;
        this.ultimateText.x = newCenterX + barWidth + 10;
      });

      // Añadir texto para mostrar si tiene poción
      this.potionText = this.add.text(20, 50, this.hasPotion ? 'Poción: F para usar' : '', {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setScrollFactor(0);

      // Configurar eventos de ataque
      this.input.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown() && !this.isAttacking) {
          if (this.player.body.touching.down && !this.attackCooldown) {
            this.isAttacking = true;
            this.attackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'attack1_ult' : 'attack1', true);
            this.player.setVelocityX(0);
            // Reproducir sonido de ataque básico
            this.sound.play('attackBasic', { volume: 0.5 });
            attackMelee(this, this.player, this.mushrooms, this.ultimateActive);
            this.time.delayedCall(this.attackCooldownTime, () => { this.attackCooldown = false; });
          } else if (!this.player.body.touching.down && !this.jumpAttackCooldown) {
            this.isAttacking = true;
            this.jumpAttackCooldown = true;
            this.player.anims.play(this.ultimateActive ? 'jump_attack_ult' : 'jump_attack', true);
            this.player.setVelocityX(0);
            // Reproducir sonido de ataque básico para jump attack
            this.sound.play('attackBasic', { volume: 0.5 });
            attackMeleeAir(this, this.player, this.mushrooms, this.ultimateActive);
            this.time.delayedCall(this.jumpAttackCooldownTime, () => { this.jumpAttackCooldown = false; });
          }
        }
      });

      // Eventos de animación de ataque
      this.player.on('animationcomplete-attack1', () => { console.debug('Animación attack1 completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true); } });
      this.player.on('animationcomplete-attack2', () => { console.debug('Animación attack2 completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true); } });
      this.player.on('animationcomplete-attack3', () => { console.debug('Animación attack3 completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true); } });
      this.player.on('animationcomplete-jump_attack', () => { console.debug('Animación jump_attack completada, restableciendo estado'); this.isAttacking = false; if (!this.player.body.touching.down) { this.player.anims.play(this.ultimateActive ? 'idle_ult' : 'idle', true); } });
      this.player.on('animationcomplete-attack1_ult', () => { console.debug('Animación attack1_ult completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play('idle_ult', true); } });
      this.player.on('animationcomplete-attack2_ult', () => { console.debug('Animación attack2_ult completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play('idle_ult', true); } });
      this.player.on('animationcomplete-attack3_ult', () => { console.debug('Animación attack3_ult completada, restableciendo estado'); this.isAttacking = false; if (this.player.body.touching.down) { this.player.anims.play('idle_ult', true); } });
      this.player.on('animationcomplete-jump_attack_ult', () => { console.debug('Animación jump_attack_ult completada, restableciendo estado'); this.isAttacking = false; if (!this.player.body.touching.down) { this.player.anims.play('idle_ult', true); } });

      // Eventos de teclado para ataques especiales
      this.input.keyboard.on('keydown-Q', () => {
        if (!this.isAttacking && this.player.body.touching.down && !this.attack2Cooldown) {
          this.isAttacking = true;
          this.attack2Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack2_ult' : 'attack2', true);
          this.player.setVelocityX(0);
          // Reproducir sonido de ataque especial (Q)
          this.sound.play('attackSpecial', { volume: 0.5 });
          attackMelee2(this, this.player, this.mushrooms, this.ultimateActive);
          this.time.delayedCall(this.attack2CooldownTime, () => { this.attack2Cooldown = false; });
        }
      });
      this.input.keyboard.on('keydown-E', () => {
        if (!this.isAttacking && this.player.body.touching.down && !this.attack3Cooldown) {
          this.isAttacking = true;
          this.attack3Cooldown = true;
          this.player.anims.play(this.ultimateActive ? 'attack3_ult' : 'attack3', true);
          this.player.setVelocityX(0);
          // Reproducir sonido de ataque poderoso (E)
          this.sound.play('attackPowerful', { volume: 0.5 });
          attackMelee3(this, this.player, this.mushrooms, this.ultimateActive);
          this.time.delayedCall(this.attack3CooldownTime, () => { this.attack3Cooldown = false; });
        }
      });

      this.input.keyboard.enabled = true;
      this.game.canvas.tabIndex = 0;
      this.game.canvas.focus();

      // Evento de tecla R para ultimate
      this.input.keyboard.on('keydown-R', () => {
        if (this.ultimateCharge >= 99 && !this.ultimateActive) {
          this.activateUltimate();
        }
      });

      // Añadir texto para mostrar la puntuación
      this.scoreText = this.add.text(20, 80, `Puntuación: ${this.score}`, {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setScrollFactor(0);

      // Añadir el portal final en el extremo derecho del mapa
      this.finalPortal = this.physics.add.staticImage(3000, 605 - 32, 'portal');
      this.finalPortal.setOrigin(0.5, 1);
      this.finalPortal.setScale(2);
      this.finalPortal.setDepth(5);
      this.finalPortal.body.setSize(12, 12);
      this.finalPortal.body.setOffset(
        (this.finalPortal.width * this.finalPortal.scaleX - 12) / 2,
        (this.finalPortal.height * this.finalPortal.scaleY - 12) / 2 - 20
      );

      // Añadir colisión con el portal final
      this.physics.add.overlap(this.player, this.finalPortal, () => {
        console.debug('El jugador ha tocado el portal final');
        this.physics.world.disable(this.player);
        this.physics.world.disable(this.finalPortal);
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          // Guardar la puntuación y el conteo de muertes en localStorage
          localStorage.setItem('finalScore', this.score);
          localStorage.setItem('deathCount', this.deathCount);
          // Detener música de juego antes de mostrar la pantalla de victoria
          audioManager.stopAllMusic();
          // Emitir evento global con score y deathCount
          window.dispatchEvent(new CustomEvent('game-finished', { 
            detail: { score: this.score, deathCount: this.deathCount }
          }));
        });
      }, null, this);

    } catch (error) {
      console.error('Error in create:', error);
      this.scene.start('Mundo2Scene');
    }
  }

  handlePlayerDeath() {
    // Restaurar la puntuación al valor inicial al cruzar el portal
    this.score = this.initialScore;
    // Reiniciar la escena y pasar los datos necesarios
    this.scene.restart({
      hasPotion: this.hasPotion,
      score: this.score,
      deathCount: this.deathCount
    });
  }

  shutdown() {
    window.removeEventListener('player-died', this.handlePlayerDeath.bind(this));
  }
  destroy() {
    this.shutdown();
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
      // Detener completamente al jugador tras la ulti
      this.player.setVelocity(0, 0);
      this.player.body.setAcceleration(0, 0);
      this.player.body.setDrag(1000, 0);
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
      
      // Actualizar fondos
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

      // Comprobar si se presiona la tecla F para usar la poción
      if (this.cursors.usePotion.isDown && this.hasPotion) {
        this.usePotion();
      }

      // Actualizar texto de la poción
      this.potionText.setText(this.hasPotion ? 'Poción: F para usar' : '');

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

      // Actualizar mushrooms
      if (this.mushrooms) {
          this.mushrooms.forEach(mushroom => {
            if (mushroom && !mushroom.isDead) {
              mushroom.update(this.player);
            }
          });
        // Limpiar champiñones muertos
          this.mushrooms = this.mushrooms.filter(mushroom => mushroom && !mushroom.isDead);
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
      // Restar 100 puntos por muerte
      //this.score = Math.max(0, this.score - 100);
      //this.scoreText.setText(`Puntuación: ${this.score}`);
      // Detener música de juego antes de mostrar el menú de muerte
      audioManager.stopAllMusic();
      this.time.delayedCall(2000, () => {
        window.dispatchEvent(new CustomEvent('player-died'));
      });
      this.deathCount++;
    } else if (amount > 0) {
      const animKey = this.ultimateActive ? 'hurt_ult' : 'hurt';
      this.isAttacking = true;
      this.player.anims.play(animKey, true);
      
      // Forzar detención del jugador
      this.player.setVelocity(0, 0);
      this.player.body.setAcceleration(0, 0);
      this.player.body.setDrag(1000, 0);
      
      // Deshabilitar controles temporalmente
      this.input.keyboard.enabled = false;
      
      // Guardar el estado de la ultimate
      const wasUltimateActive = this.ultimateActive;
      
      this.player.once('animationcomplete-' + animKey, () => {
        if (!this.player.isDead) {
          this.isAttacking = false;
          this.input.keyboard.enabled = true;
          
          // Resetear el estado de las teclas para evitar inputs pegados
          this.cursors.left.isDown = false;
          this.cursors.right.isDown = false;
          this.cursors.jump.isDown = false;
          
          // Asegurar que la velocidad está en 0
          this.player.setVelocity(0, 0);
          this.player.body.setAcceleration(0, 0);
          this.player.body.setDrag(0, 0);
          
          // Restaurar la animación correcta basada en el estado de la ultimate
          if (wasUltimateActive) {
            this.player.anims.play('idle_ult', true);
          } else {
            this.player.anims.play('idle', true);
          }
        }
      });
    }
    
    // Actualizar barra de vida
    const healthPercent = this.player.hp / this.player.maxHp;
    this.playerHealthBar.width = this.HEALTH_BAR_WIDTH * healthPercent;
    
    // Cambiar color según la vida
    if (healthPercent > 0.6) {
      this.playerHealthBar.fillColor = 0x00ff00; // Verde
    } else if (healthPercent > 0.3) {
      this.playerHealthBar.fillColor = 0xffff00; // Amarillo
    } else {
      this.playerHealthBar.fillColor = 0xff0000; // Rojo
    }
  }

  usePotion() {
    if (!this.hasPotion) return;

    // Recargar la ultimate al 100%
    this.ultimateCharge = 100;
    this.hasPotion = false;

    // Efecto visual de uso
    const useText = this.add.text(this.player.x, this.player.y - 30, '¡Ultimate Recargada!', {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación del texto
    this.tweens.add({
      targets: useText,
      y: this.player.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        useText.destroy();
      }
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText(`Puntuación: ${this.score}`);
    
    // Efecto visual de puntos ganados
    const scoreText = this.add.text(this.player.x, this.player.y - 30, `+${points}`, {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación del texto
    this.tweens.add({
      targets: scoreText,
      y: this.player.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        scoreText.destroy();
      }
    });
  }
}


