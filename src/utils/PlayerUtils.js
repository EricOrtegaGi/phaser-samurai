// Utilidades globales para ataques y efectos del jugador

export function showDamageText(scene, x, y, amount, color = '#ff0000') {
  const damageText = scene.add.text(x, y, `-${amount}`, {
    font: 'bold 20px Arial',
    fill: color,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5);
  scene.tweens.add({
    targets: damageText,
    y: y - 30,
    alpha: 0,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => { damageText.destroy(); }
  });
}

export function healPlayer(scene, player, amount) {
  if (player.isDead) return;
  const oldHp = player.hp;
  const targetHp = Math.min(player.maxHp, player.hp + amount);
  const actualHeal = targetHp - oldHp;
  if (actualHeal > 0) {
    const healPerTick = Math.ceil(actualHeal / 10);
    let currentHeal = 0;
    const healInterval = scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (currentHeal < actualHeal) {
          const healThisTick = Math.min(healPerTick, actualHeal - currentHeal);
          player.hp += healThisTick;
          currentHeal += healThisTick;
          showDamageText(scene, player.x, player.y - 30, `+${healThisTick}`, '#00ff00');
          // Actualizar barra de vida si existe
          if (scene.playerHealthBar) {
            const healthPercent = player.hp / player.maxHp;
            scene.playerHealthBar.width = scene.HEALTH_BAR_WIDTH * healthPercent;
            if (healthPercent > 0.6) scene.playerHealthBar.fillColor = 0x00ff00;
            else if (healthPercent > 0.3) scene.playerHealthBar.fillColor = 0xffff00;
            else scene.playerHealthBar.fillColor = 0xff0000;
          }
        } else {
          healInterval.remove();
        }
      },
      callbackScope: scene,
      repeat: 9
    });
  }
}

export function applyDamageOverTime(scene, enemy, damage) {
  enemy.takeDamage(damage, true);
  showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
  let ticks = 0;
  const damageInterval = scene.time.addEvent({
    delay: 1000,
    callback: () => {
      if (enemy && !enemy.isDead && ticks < 3) {
        enemy.takeDamage(damage, true);
        showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
        ticks++;
      } else {
        damageInterval.remove();
      }
    },
    callbackScope: scene,
    repeat: 2
  });
}

export function attackMelee(scene, player, enemies, ultimateActive) {
  const meleeWidth = 60;
  const meleeHeight = 80;
  const facing = player.flipX ? -1 : 1;
  const offsetX = facing * 5;
  const hitboxX = player.x + offsetX;
  const hitboxY = player.y - 10;
  scene.attackHitbox = scene.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
  scene.physics.add.existing(scene.attackHitbox);
  scene.attackHitbox.body.setAllowGravity(false);
  scene.attackHitbox.body.setImmovable(true);
  scene.attackHitbox.visible = false;
  let hitEnemy = false;
  let totalDamage = 0;
  enemies.forEach(enemy => {
    if (enemy && !enemy.isDead) {
      const enemyBounds = enemy.getBounds();
      const hitboxBounds = scene.attackHitbox.getBounds();
      if (Phaser.Geom.Rectangle.Overlaps(enemyBounds, hitboxBounds)) {
        const isFacing = (facing === -1 && enemy.x < player.x) || (facing === 1 && enemy.x > player.x);
        if (isFacing) {
          const damage = ultimateActive ? 64 : 40;
          enemy.takeDamage(damage);
          totalDamage += damage;
          if (ultimateActive) {
            applyDamageOverTime(scene, enemy, 15);
            totalDamage += 45;
          } else {
            showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
          }
          hitEnemy = true;
        }
      }
    }
  });
  if (hitEnemy && !ultimateActive) {
    scene.ultimateCharge = Math.min(100, scene.ultimateCharge + 5);
  } else if (hitEnemy && ultimateActive) {
    healPlayer(scene, player, Math.floor(totalDamage * 0.1));
  }
  player.once('animationcomplete-attack1', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
  player.once('animationcomplete-attack1_ult', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
}

export function attackMeleeAir(scene, player, enemies, ultimateActive) {
  const meleeWidth = 90;
  const meleeHeight = 110;
  const facing = player.flipX ? -1 : 1;
  const offsetX = facing * 5;
  const hitboxX = player.x + offsetX;
  const hitboxY = player.y - 10;
  scene.attackHitbox = scene.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
  scene.physics.add.existing(scene.attackHitbox);
  scene.attackHitbox.body.setAllowGravity(false);
  scene.attackHitbox.body.setImmovable(true);
  scene.attackHitbox.visible = false;
  let hitEnemy = false;
  let totalDamage = 0;
  enemies.forEach(enemy => {
    if (enemy && !enemy.isDead) {
      const enemyBounds = enemy.getBounds();
      const hitboxBounds = scene.attackHitbox.getBounds();
      if (Phaser.Geom.Rectangle.Overlaps(enemyBounds, hitboxBounds)) {
        const isFacing = (facing === -1 && enemy.x < player.x) || (facing === 1 && enemy.x > player.x);
        if (isFacing) {
          const damage = ultimateActive ? 50 : 30;
          enemy.takeDamage(damage);
          totalDamage += damage;
          if (ultimateActive) {
            applyDamageOverTime(scene, enemy, 15);
            totalDamage += 45;
          } else {
            showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
          }
          hitEnemy = true;
        }
      }
    }
  });
  if (hitEnemy && !ultimateActive) {
    scene.ultimateCharge = Math.min(100, scene.ultimateCharge + 7);
  } else if (hitEnemy && ultimateActive) {
    healPlayer(scene, player, Math.floor(totalDamage * 0.1));
  }
  player.once('animationcomplete-jump_attack', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
  player.once('animationcomplete-jump_attack_ult', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
}

export function attackMelee2(scene, player, enemies, ultimateActive) {
  const meleeWidth = 70;
  const meleeHeight = 90;
  const facing = player.flipX ? -1 : 1;
  const offsetX = facing * 5;
  const hitboxX = player.x + offsetX;
  const hitboxY = player.y - 10;
  scene.attackHitbox = scene.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
  scene.physics.add.existing(scene.attackHitbox);
  scene.attackHitbox.body.setAllowGravity(false);
  scene.attackHitbox.body.setImmovable(true);
  scene.attackHitbox.visible = false;
  let hitEnemy = false;
  let totalDamage = 0;
  enemies.forEach(enemy => {
    if (enemy && !enemy.isDead) {
      const enemyBounds = enemy.getBounds();
      const hitboxBounds = scene.attackHitbox.getBounds();
      if (Phaser.Geom.Rectangle.Overlaps(enemyBounds, hitboxBounds)) {
        const isFacing = (facing === -1 && enemy.x < player.x) || (facing === 1 && enemy.x > player.x);
        if (isFacing) {
          const damage = ultimateActive ? 62 : 50;
          enemy.takeDamage(damage);
          totalDamage += damage;
          if (ultimateActive) {
            applyDamageOverTime(scene, enemy, 15);
            totalDamage += 45;
          } else {
            showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
          }
          hitEnemy = true;
        }
      }
    }
  });
  if (hitEnemy && !ultimateActive) {
    scene.ultimateCharge = Math.min(100, scene.ultimateCharge + 10);
  } else if (hitEnemy && ultimateActive) {
    healPlayer(scene, player, Math.floor(totalDamage * 0.1));
  }
  player.once('animationcomplete-attack2', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
  player.once('animationcomplete-attack2_ult', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
}

export function attackMelee3(scene, player, enemies, ultimateActive) {
  const meleeWidth = 80;
  const meleeHeight = 100;
  const facing = player.flipX ? -1 : 1;
  const offsetX = facing * 5;
  const hitboxX = player.x + offsetX;
  const hitboxY = player.y - 10;
  scene.attackHitbox = scene.add.rectangle(hitboxX, hitboxY, meleeWidth, meleeHeight);
  scene.physics.add.existing(scene.attackHitbox);
  scene.attackHitbox.body.setAllowGravity(false);
  scene.attackHitbox.body.setImmovable(true);
  scene.attackHitbox.visible = false;
  let hitEnemy = false;
  let totalDamage = 0;
  enemies.forEach(enemy => {
    if (enemy && !enemy.isDead) {
      const enemyBounds = enemy.getBounds();
      const hitboxBounds = scene.attackHitbox.getBounds();
      if (Phaser.Geom.Rectangle.Overlaps(enemyBounds, hitboxBounds)) {
        const isFacing = (facing === -1 && enemy.x < player.x) || (facing === 1 && enemy.x > player.x);
        if (isFacing) {
          const damage = ultimateActive ? 42 : 35;
          enemy.takeDamage(damage);
          totalDamage += damage;
          if (ultimateActive) {
            applyDamageOverTime(scene, enemy, 15);
            totalDamage += 45;
          } else {
            showDamageText(scene, enemy.x, enemy.y - 30, damage, '#ff0000');
          }
          hitEnemy = true;
        }
      }
    }
  });
  if (hitEnemy && !ultimateActive) {
    scene.ultimateCharge = Math.min(100, scene.ultimateCharge + 12);
  } else if (hitEnemy && ultimateActive) {
    healPlayer(scene, player, Math.floor(totalDamage * 0.1));
  }
  player.once('animationcomplete-attack3', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
  player.once('animationcomplete-attack3_ult', () => {
    if (scene.attackHitbox) { scene.attackHitbox.destroy(); scene.attackHitbox = null; }
  });
}

// Puedes crear attackMeleeAir, attackMelee2, attackMelee3 igual cambiando los valores de daño y suma de ultimate 