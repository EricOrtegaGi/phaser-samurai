import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.body.setGravityY(300);
    this.setScale(1);
    this.setDepth(10);
    this.isAttacking = false;
    this.isDead = false;
    this.isTakingHit = false;
    this.direction = 1;
    this.attackCooldown = false;
    this.takeHitCooldown = false;
    this.createHealthBar();
  }

  createHealthBar() {
    const barWidth = 50;
    const barHeight = 5;
    const offsetY = -40;
    this.healthBarBg = this.scene.add.rectangle(this.x, this.y + offsetY, barWidth, barHeight, 0x666666).setOrigin(0.5, 0.5);
    this.healthBar = this.scene.add.rectangle(this.x, this.y + offsetY, barWidth, barHeight, 0x00ff00).setOrigin(0.5, 0.5);
    this.healthBarBg.setDepth(11);
    this.healthBar.setDepth(11);
  }

  updateHealthBar() {
    const healthPercent = this.health / this.maxHealth;
    const barWidth = 50;
    this.healthBar.width = barWidth * healthPercent;
    if (healthPercent > 0.6) { this.healthBar.fillColor = 0x00ff00; }
    else if (healthPercent > 0.3) { this.healthBar.fillColor = 0xffff00; }
    else { this.healthBar.fillColor = 0xff0000; }
  }

  takeDamage(amount, isDot = false) {
    if (this.isDead || (this.isTakingHit && !isDot)) return;
    this.health -= amount;
    this.updateHealthBar();
    if (!isDot) {
      this.isTakingHit = true;
      this.takeHitCooldown = true;
      this.setVelocityX(0);
      // Animación de recibir daño y retroceso se implementa en la subclase
    }
    if (this.health <= 0) { this.die(); }
  }

  die() {
    this.isDead = true;
    this.setVelocityX(0);
    this.healthBarBg.destroy();
    this.healthBar.destroy();
    // Animación de muerte y destrucción se implementa en la subclase
  }
} 