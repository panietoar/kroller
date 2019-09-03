import { GameObjects } from 'phaser'
import { HEALTH, SPEED } from '../constants/playerDefaults'
import generateUID from '../utils/uid'
import Projectile from '../objects/projectile'
import { NormalizedVector } from '../utils/geometry'

export default class Player extends GameObjects.Ellipse {
  INVULNERABLE_TIME = 2000

  constructor (scene, type, controls) {
    super(scene, 50, 50, 25, 25, 0xff0000)
    this.controls = controls
    this.uid = generateUID()
    this.scene = scene

    this.health = HEALTH[type]
    this.baseSpeed = SPEED[type]
    this.attackCoolDown = 2
    this.onCoolDown = false
    this.invulnerable = false
    this.invulnerableTime = 0
    this.experience = 0
    this.level = 1

    this.setData({
      health: HEALTH[type]
    })
    this.healtText = scene.add.text(
      this.x - 12,
      this.y - 40,
      `${this.health.toFixed(0)}`,
      {
        color: '#000000'
      }
    )
  }

  initializeState () {}

  get position () {
    return { x: this.x, y: this.y }
  }

  update (delta) {
    this.handleInput(delta)
    this.checkInvulnerable(delta)
    this.checkHealth()
  }

  handleInput (delta) {
    const speed = delta * this.baseSpeed
    if (this.controls.left.isDown || this.controls.A.isDown) {
      this.setX(this.x - speed)
    }
    if (this.controls.right.isDown || this.controls.D.isDown) {
      this.setX(this.x + speed)
    }
    if (this.controls.up.isDown || this.controls.W.isDown) {
      this.setY(this.y - speed)
    }
    if (this.controls.down.isDown || this.controls.S.isDown) {
      this.setY(this.y + speed)
    }
  }

  checkHealth () {
    this.healtText.setPosition(this.x - 12, this.y - 40)
    if (this.health <= 0) {
      this.health = 0
      this.scene.gameOver()
    }
    this.healtText.setText(`${this.health.toFixed(0)}`)
  }

  checkInvulnerable (delta) {
    this.invulnerableTime += this.invulnerable ? delta : 0
    if (this.invulnerableTime >= 200) {
      this.isFilled = !this.isFilled
      this.invulnerableTime = 0
    }
  }

  fireProjectile (pointer) {
    if (this.onCoolDown) {
      return
    }
    const projectile = new Projectile(
      this.scene,
      this.x,
      this.y,
      new NormalizedVector(pointer.x - this.x, pointer.y - this.y)
    )
    this.scene.projectiles.add(projectile, true)
    this.onCoolDown = true
    window.setTimeout(() => {
      this.onCoolDown = false
    }, this.attackCoolDown * 1000)
  }

  receiveDamage ({ damage }) {
    this.health -= damage
    this.invulnerable = true
    setTimeout(() => {
      this.invulnerable = false
      this.isFilled = true
    }, INVULNERABLE_TIME)
    this.isFilled = false
  }
}
