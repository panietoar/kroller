import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'
import HealthBar from './healthBar'

export class Enemy extends GameObjects.Sprite {
  constructor (scene, sprite) {
    super(scene, 700, 600, sprite)
    this.uid = generateUID()
    this.scene = scene
    this.sprite = sprite
    this.currentDirection = 0

    /* this.healthText = scene.add.text(this.x - 12, this.y - 60, '', {
      color: '#000000'
    }) */
  }

  get position () {
    return { x: this.x, y: this.y }
  }

  setHealth (health) {
    this.maxHealth = health
    this.currentHealth = health
    this.healthBar = new HealthBar(
      this.scene,
      this.position,
      this.displayHeight - 20,
      this.maxHealth
    )
  }

  receiveDamage (projectile) {
    this.currentHealth -= projectile.power
    this.healthBar.updateHealth(this.currentHealth)
  }

  update (time, delta) {
    this.checkHealth()
    this.move(delta, this.scene.player.position)
    this.healthBar.updatePosition(this.position)
    // this.healthText.setPosition(this.x - 12, this.y - 60)
  }

  move (delta, { x, y }) {
    const direction = new Phaser.Math.Vector2(
      this.x - x,
      this.y - y
    ).normalize()
    this.updateAnim(direction.angle())

    const speedX = direction.x * this.baseSpeed * delta
    const speedY = direction.y * this.baseSpeed * delta
    this.body.setVelocityX(-speedX)
    this.body.setVelocityY(-speedY)
  }

  updateAnim (angle) {
    if (angle < 1 && this.facing !== 'left') {
      this.anims.play(`${this.sprite}-walk-left`)
      this.facing = 'left'
    } else if (angle >= 1 && angle < 2) {
      if (this.facing !== 'up') {
        this.anims.play(`${this.sprite}-walk-up`)
        this.facing = 'up'
      }
    } else if (angle >= 2 && angle < 3.6) {
      if (this.facing !== 'right') {
        this.anims.play(`${this.sprite}-walk-right`)
        this.facing = 'right'
      }
    } else if (angle >= 3.6 && angle < 5.6) {
      if (this.facing !== 'down') {
        this.anims.play(`${this.sprite}-walk-down`)
        this.facing = 'down'
      }
    } else {
      if (this.facing !== 'left') {
        this.anims.play(`${this.sprite}-walk-left`)
        this.facing = 'left'
      }
    }
  }

  spawn (x, y) {
    this.setPosition(x, y)
    this.setVisible(true)
    this.setActive(true)
    this.anims.play(`${this.sprite}-walk-down`)
    this.facing = 'up'
    // this.healthText.setVisible(true)
    this.healthBar.updateHealth(this.currentHealth)
    this.healthBar.draw(true)
  }

  checkHealth () {
    // this.healthText.setText(`${this.currentHealth.toFixed(0)}`)
    if (this.currentHealth <= 0) {
      this.die()
    }
  }

  die () {
    this.scene.enemies.killAndHide(this)
    // this.healthText.setVisible(false)
    this.currentHealth = this.maxHealth
    this.setPosition(-500, -500)
    this.scene.killEmmiter.emit('enemyKilled', this)
    this.healthBar.hide()
  }
}

export class Skeleton extends Enemy {
  constructor (scene) {
    super(scene, 'skeleton')
    this.setName('Purple')

    this.setHealth(55)
    this.baseSpeed = 3
    this.damage = 15
    this.experience = 1
  }
}
