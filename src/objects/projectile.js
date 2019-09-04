import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'

export class Projectile extends GameObjects.Sprite {
  constructor (scene) {
    super(scene, 0, 0, 'projectile')
    this.uid = generateUID()
    this.baseSpeed = 0.3
    this.scene = scene
    this.power = 20
    this.setName('projectile')
    this.anims.play('fired')
  }

  fire (x, y, direction) {
    this.setPosition(x, y)
    this.direction = direction
    this.setActive(true)
    this.setVisible(true)
  }

  impact () {
    this.scene.projectiles.killAndHide(this)
    /* let explosion = this.scene.explosions.get()

    if(explosion) {
      explosion.explode(
        this.x,
        this.y)
    } */
  }

  update (time, delta) {
    this.updatePosition(delta)
    this.checkBounds()
    this.checkImpact()
  }

  checkImpact () {
    this.scene.physics.overlap(
      this.scene.enemies,
      this,
      this.impactCollision,
      null,
      this
    )
  }

  impactCollision (projectile, enemy) {
    enemy.receiveDamage(projectile)
    projectile.impact()
  }

  updatePosition (delta) {
    const speed = delta * this.baseSpeed
    const speedX = this.direction.x * speed
    const speedY = this.direction.y * speed
    this.setX(this.x + speedX)
    this.setY(this.y + speedY)
  }

  checkBounds () {
    if (this.isOutOfBounds()) {
      this.scene.projectiles.killAndHide(this)
    }
  }

  isOutOfBounds () {
    return this.x > 1280 || this.x < 0 || this.y > 768 || this.y < 0
  }
}

export class Explosion extends GameObjects.Sprite {
  constructor (scene) {
    super(scene, 0, 0, 'explosion')
    this.anims.play('explosion')
  }

  explode (x, y) {
    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
  }
}
