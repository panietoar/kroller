import Player from '../objects/player'
import { Skeleton } from '../objects/enemy'
import { Projectile, Explosion } from '../objects/projectile'
import { GameObjects } from 'phaser'

export class MainScene extends Phaser.Scene {
  preload () {
    this.load.spritesheet('explosion', 'assets/sprites/explosion71.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('missile', 'assets/sprites/missile.png', {
      frameHeight: 32,
      frameWidth: 32
    })
    this.load.spritesheet('skeleton', 'assets/sprites/skeleton.png', {
      frameHeight: 64,
      frameWidth: 64
    })
  }

  create () {
    this.cameras.main.setBackgroundColor('#999999')
    this.createPlayer()
    this.createObjectPools()
    this.killedEnemies = 0
    this.paused = false
    this.generateEnemies()
    this.killEmmiter = new Phaser.Events.EventEmitter()
    this.killEmmiter.on('enemyKilled', this.enemyKilled, this)
    this.createAnimations()
    this.wall = new GameObjects.Rectangle(this, 250, 300, 250, 180, 0xfa38b7)
    this.physics.add.existing(this.wall)
    this.wall.body.setImmovable(true)
    this.add.existing(this.wall)
    this.physics.add.collider(this.player, this.wall)
    this.physics.add.collider(this.enemies, this.wall)
  }

  createObjectPools () {
    this.projectiles = this.physics.add.group({
      classType: Projectile,
      max: 3,
      runChildUpdate: true,
      active: false,
      visible: false
    })

    this.explosions = this.add.group({
      classType: Explosion,
      max: 3,
      active: false,
      visible: false
    })

    this.enemies = this.physics.add.group({
      classType: Skeleton,
      runChildUpdate: true,
      active: false,
      visible: false
    })
  }

  createAnimations () {
    this.anims.create({
      key: 'fired',
      frames: this.anims.generateFrameNumbers('missile', {
        start: 0,
        end: 7,
        first: 0
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 16,
        first: 0
      }),
      frameRate: 64
    })

    this.anims.create({
      key: 'skeleton-walk-up',
      frames: this.anims.generateFrameNumbers('skeleton', {
        start: 105,
        end: 112
      }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'skeleton-walk-left',
      frames: this.anims.generateFrameNumbers('skeleton', {
        start: 118,
        end: 125
      }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'skeleton-walk-down',
      frames: this.anims.generateFrameNumbers('skeleton', {
        start: 131,
        end: 138
      }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'skeleton-walk-right',
      frames: this.anims.generateFrameNumbers('skeleton', {
        start: 144,
        end: 151
      }),
      frameRate: 12,
      repeat: -1
    })
  }

  createPlayer () {
    const controls = this.createControls()
    this.player = new Player(this, 'mage', controls)
    this.physics.add.existing(this.player)
    this.add.existing(this.player)
    this.player.body.setBounce(1, 1)
  }

  createControls () {
    const arrowKeys = this.input.keyboard.createCursorKeys()
    const wasdKeys = this.input.keyboard.addKeys('W,S,A,D')
    const controls = { ...arrowKeys, ...wasdKeys }
    this.input.on('pointerup', pointer => this.player.fireProjectile(pointer))
    return controls
  }

  update (time, delta) {
    this.player.update(delta)
    this.enemies.preUpdate(time, delta)
    this.projectiles.preUpdate(time, delta)

    if (this.player.level === 10) {
      this.gameOver()
    }
  }

  generateEnemies () {
    this.enemyInterval = setInterval(() => {
      const enemy = this.enemies.get()
      if (enemy) {
        enemy.spawn(1300, 340)
      }
    }, 4000)
  }

  enemyKilled (enemy) {
    this.player.receiveRewards(enemy)
    this.killedEnemies++
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
