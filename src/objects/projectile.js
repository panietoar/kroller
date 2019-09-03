import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'

export default class Projectile extends GameObjects.Ellipse {
  constructor (scene, originX, originY, direction) {
    super(scene, originX, originY, 10, 10, 0x0000ff)
    this.uid = generateUID()
    this.direction = direction
    this.baseSpeed = 0.5
    this.scene = scene
    this.power = 20
    this.setName('projectile')
  }

  update (delta) {
    this.updatePosition(delta)
    this.checkBounds()
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
      this.scene.deleteProjectile(this)
    }
  }

  isOutOfBounds () {
    return this.x > 1280 || this.x < 0 || this.y > 768 || this.y < 0
  }
}
