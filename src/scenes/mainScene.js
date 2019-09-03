import Player from '../objects/player'
import Enemy from '../objects/enemy'

export class MainScene extends Phaser.Scene {
  ENEMY_SPAWN_TIMER = 4000

  create () {
    const controls = this.createControls()
    this.player = new Player(this, 'mage', controls)
    this.physics.add.existing(this.player)
    this.add.existing(this.player)
    this.cameras.main.setBackgroundColor('#ffffff')
    this.projectiles = this.physics.add.group()
    this.enemies = this.physics.add.group()
    this.killedEnemies = 0
    this.paused = false
    this.generateEnemies()
  }

  createControls () {
    const arrowKeys = this.input.keyboard.createCursorKeys()
    this.pauseKey = arrowKeys.space
    const wasdKeys = this.input.keyboard.addKeys('W,S,A,D')
    const controls = { ...arrowKeys, ...wasdKeys }
    this.input.on('pointerup', pointer => this.player.fireProjectile(pointer))
    return controls
  }

  update (time, delta) {
    if (this.paused) {
      return
    }
    this.player.update(delta)
    this.enemies.getChildren().forEach(enemy => {
      enemy.update(delta, this.player.position)
    })
    this.projectiles.getChildren().forEach(projectile => {
      projectile.update(delta)
    })
    this.physics.add.overlap(
      this.enemies,
      this.projectiles,
      this.attackCollision,
      null,
      this
    )
    this.physics.add.overlap(
      this.enemies,
      this.player,
      this.enemyCollision,
      null,
      this
    )
    if (this.killedEnemies === 2) {
      this.gameOver()
    }
    if (this.pauseKey.isDown) {
      this.paused = !this.paused
    }
  }

  enemyCollision (player, enemy) {
    player.receiveDamage(enemy)
  }

  attackCollision (enemy, projectile) {
    enemy.receiveDamage(projectile)
    this.deleteProjectile(projectile)
  }

  deleteProjectile (projectile) {
    this.projectiles.remove(projectile, true, true)
    projectile.destroy()
  }

  removeEnemy (enemy) {
    this.enemies.remove(enemy, true, true)
    this.killedEnemies++
  }

  generateEnemies () {
    this.enemyInterval = setInterval(() => {
      this.enemies.add(new Enemy(this), true)
    }, this.ENEMY_SPAWN_TIMER)
  }

  gameOver () {
    this.paused = true
    this.input.off('pointerup')
    this.add.text(550, 350, 'Game Over', {
      color: '#ff0000',
      fontSize: '30px'
    })
    clearInterval(this.enemyInterval)
  }
}
