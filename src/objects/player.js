import { GameObjects } from 'phaser'
import { HEALTH, SPEED } from '../constants/playerDefaults'
import generateUID from '../utils/uid'
import HealthBar from './healthBar';

export default class Player extends GameObjects.Ellipse {
  INVULNERABLE_TIME = 2000

  constructor (scene, type, controls) {
    super(scene, 50, 50, 25, 25, 0xff0000)
    this.controls = controls
    this.uid = generateUID()
    this.scene = scene
    
    this.health = HEALTH[type]
    this.baseSpeed = SPEED[type]
    this.attackCoolDown = 1.5
    this.onCoolDown = false
    this.invulnerable = false
    this.invulnerableTime = 0
    this.experience = 0
    this.level = 1
    
    this.setData({
      health: HEALTH[type]
    })
    this.healthBar = new HealthBar(scene, this.position, this.displayHeight, this.health)
    this.healthBar.draw()
    this.healthText = scene.add.text(
      this.x - 12,
      this.y - 40,
      `${this.health.toFixed(0)}`,
      {
        color: '#000000'
      }
    )
  }

  get position () {
    return { x: this.x, y: this.y }
  }

  update (delta) {
    this.handleInput(delta)
    this.healthBar.updatePosition(this.position)
    this.checkInvulnerable(delta)
    this.checkEnemyCollision()

    //Debug
    this.healthText.setPosition(this.x - 12, this.y - 40)
    this.healthText.setText(`${this.health.toFixed(0)}`)
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

  checkInvulnerable (delta) {
    this.invulnerableTime += this.invulnerable ? delta : 0
    if (this.invulnerableTime >= 200) {
      this.isFilled = !this.isFilled
      this.invulnerableTime = 0
    }
  }

  checkEnemyCollision () {
    this.scene.physics.overlap(
      this.scene.enemies,
      this,
      this.enemyCollision,
      null,
      this
    )
  }

  enemyCollision (player, enemy) {
    player.receiveDamage(enemy)
  }

  fireProjectile (pointer) {
    if (this.onCoolDown) {
      return
    }
    let projectile = this.scene.projectiles.get()

    if (projectile) {
      let projectileDirection = new Phaser.Math.Vector2(pointer.x - this.x, pointer.y - this.y)
      projectileDirection = projectileDirection.normalize()
      projectile.fire(
        this.x,
        this.y,
        projectileDirection
      )
    }
    this.onCoolDown = true
    window.setTimeout(() => {
      this.onCoolDown = false
    }, this.attackCoolDown * 1000)
  }

  receiveDamage ({ damage }) {
    if (this.invulnerable) {
      return
    }
    this.health -= damage
    if (this.health <= 0) {
      this.health = 0
      this.scene.gameOver()
    }
    this.healthBar.updateHealth(this.health)
    this.invulnerable = true
    setTimeout(() => {
      this.invulnerable = false
      this.isFilled = true
    }, this.INVULNERABLE_TIME)
    this.isFilled = false
  }

  receiveRewards (enemy) {
    //console.log('Killed enemy:', enemy.name)
  }
}
