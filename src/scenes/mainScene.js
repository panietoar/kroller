import Player from '../objects/player'
import { PurpleEnemy } from '../objects/enemy'
import Projectile from '../objects/projectile';

export class MainScene extends Phaser.Scene {
  ENEMY_SPAWN_TIMER = 4000

  preload() {
    this.load.spritesheet('projectile', 'assets/sprites/projectile4.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('explosion', 'assets/sprites/explosion71.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create () {
    const controls = this.createControls()
    this.player = new Player(this, 'mage', controls)
    this.physics.add.existing(this.player)
    this.add.existing(this.player)
    this.cameras.main.setBackgroundColor('#ffffff')
    this.projectiles = this.physics.add.group({
      classType: Projectile,
      max: 3,
      runChildUpdate: true
    })
    this.enemies = this.physics.add.group()
    this.killedEnemies = 0
    this.paused = false
    this.generateEnemies()
    //this.killEmmiter = new Phaser.Events.EventEmitter()
    //this.killEmmiter.on('enemyKilled', this.player.receiveRewards, this.player)

    this.anims.create({
      key: 'fired',
      frames: this.anims.generateFrameNumbers('projectile', { start: 0, end: 16, first: 0 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 16, first: 0 }),
      frameRate: 8
    })
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
    if (this.killedEnemies === 10) {
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
    projectile.explode()
    //this.deleteProjectile(projectile)
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
     if(this.enemies.countActive() < 3 ){
       this.enemies.add(new PurpleEnemy(this), true)
     }
    }, this.ENEMY_SPAWN_TIMER)
  }

  gameOver () {
    this.scene.pause()
    this.input.off('pointerup')
    this.add.text(550, 350, 'Game Over', {
      color: '#ff0000',
      fontSize: '30px'
    })
    clearInterval(this.enemyInterval)
  }
}
