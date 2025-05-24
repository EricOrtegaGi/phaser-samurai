import { Enemy } from './Enemy';

export class Goblin extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'goblin_idle');
    this.health = 250;
    this.maxHealth = 250;
    this.speed = 100;
    this.attackDamage = 20;
    this.attackRange = 60;
    this.attackDelay = 400;
    this.attackCooldownTime = 300;
    this.optimalDistance = 60;
    this.takeHitCooldownTime = 500;
    this.isLastGroup = x >= 2500;
    this.createAnimations();
    this.play('goblin_idle');

    this.body.setOffset(24, -8);
  }

  createAnimations() {
    if (!this.scene.anims.exists('goblin_idle')) {
      this.scene.anims.create({
        key: 'goblin_idle',
        frames: this.scene.anims.generateFrameNumbers('goblin_idle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!this.scene.anims.exists('goblin_run')) {
      this.scene.anims.create({
        key: 'goblin_run',
        frames: this.scene.anims.generateFrameNumbers('goblin_run', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.scene.anims.exists('goblin_attack')) {
      this.scene.anims.create({
        key: 'goblin_attack',
        frames: this.scene.anims.generateFrameNumbers('goblin_attack', { start: 0, end: 7 }),
        frameRate: 15,
        repeat: 0
      });
    }
    if (!this.scene.anims.exists('goblin_take_hit')) {
      this.scene.anims.create({
        key: 'goblin_take_hit',
        frames: this.scene.anims.generateFrameNumbers('goblin_take_hit', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!this.scene.anims.exists('goblin_death')) {
      this.scene.anims.create({
        key: 'goblin_death',
        frames: this.scene.anims.generateFrameNumbers('goblin_death', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: 0
      });
    }
  }

  update(player) {
    if (this.isDead || this.isTakingHit) return;
    // Actualizar posición de la barra de vida
    const offsetY = -30;
    this.healthBarBg.x = this.x;
    this.healthBarBg.y = this.y + offsetY;
    this.healthBar.x = this.x - (50 - this.healthBar.width) / 2;
    this.healthBar.y = this.y + offsetY;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (this.isAttacking) {
      this.setVelocityX(0);
      return;
    }
    if (distance < this.attackRange && !this.isAttacking && !this.attackCooldown) {
      this.attackPosition = { x: this.x, y: this.y };
      this.attack(player);
    } else if (distance < 300 && !this.isAttacking) {
      this.chasePlayer(player);
    } else if (!this.isAttacking) {
      this.play('goblin_idle', true);
      this.setVelocityX(0);
    }
  }

  chasePlayer(player) {
    const direction = player.x < this.x ? -1 : 1;
    this.direction = direction;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance < this.optimalDistance) {
      this.setVelocityX(-this.speed * direction);
    } else if (distance > this.optimalDistance) {
      this.setVelocityX(this.speed * direction);
    } else {
      this.setVelocityX(0);
    }
    this.play('goblin_run', true);
    this.flipX = direction < 0;
  }

  attack(player) {
    if (!this.isAttacking && !this.attackCooldown) {
      this.isAttacking = true;
      this.attackCooldown = true;
      this.setVelocityX(0);
      this.play('goblin_attack', true);
      this.scene.time.delayedCall(this.attackDelay, () => {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (distance < this.attackRange) {
          this.scene.takePlayerDamage(this.attackDamage);
        }
      });
      this.once('animationcomplete', () => {
        this.isAttacking = false;
        this.scene.time.delayedCall(this.attackCooldownTime, () => {
          this.attackCooldown = false;
        });
      });
    }
  }

  takeDamage(amount, isDot = false) {
    if (this.isDead || (this.isTakingHit && !isDot)) return;
    this.health -= amount;
    this.updateHealthBar();
    const damageText = this.scene.add.text(this.x, this.y - 30, `-${amount}`, {
      font: 'bold 20px Arial',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.scene.tweens.add({
      targets: damageText,
      y: this.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => { damageText.destroy(); }
    });
    if (!isDot) {
      this.isTakingHit = true;
      this.takeHitCooldown = true;
      this.setVelocityX(0);
      this.play('goblin_take_hit', true);
      const knockbackDirection = this.scene.player.x < this.x ? 1 : -1;
      this.setVelocityX(knockbackDirection * 100);
      this.once('animationcomplete-goblin_take_hit', () => {
        this.isTakingHit = false;
        this.scene.time.delayedCall(this.takeHitCooldownTime, () => {
          this.takeHitCooldown = false;
        });
      });
    }
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocityX(0);
    this.play('goblin_death', true);
    this.healthBarBg.destroy();
    this.healthBar.destroy();
    if (this.isLastGroup && Math.random() < 0.3 && !this.scene.hasPotion) {
      if (typeof window !== 'undefined' && window.Potion) {
        new window.Potion(this.scene, this.x, this.y);
      }
    }
    this.once('animationcomplete', () => {
      this.destroy();
    });
  }
} 