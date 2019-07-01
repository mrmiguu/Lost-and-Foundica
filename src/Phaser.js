import { Game, Scene, AUTO, Display } from 'phaser'
// assets
import tuxmonSample32pxExtruded from './assets/tilesets/tuxmon-sample-32px-extruded.png'
import tuxemonTown from './assets/tilemaps/tuxemon-town.json'
import atlasPng from './assets/atlas/atlas.png'
import atlasJson from './assets/atlas/atlas.json'

function Phaser({ size: [width, height] }) {
  return new Promise(onScene => {
    let g = new Game({
      type: AUTO,
      width,
      height,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 }
        }
      },
    })

    g.scene.add('MyScene', MyScene, true, { onScene })
  })
}

class MyScene extends Scene {
  constructor(config) {
    super(config)
  }

  init({ onScene }) {
    this.onScene = onScene
  }

  preload() {
    // console.log('Phaser.preload')

    this.load.image('tiles', tuxmonSample32pxExtruded)
    this.load.tilemapTiledJSON('map', tuxemonTown)

    // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
    // the this.player animations (walking left, walking right, etc.) in one image. For more info see:
    //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
    // If you don't use an atlas, you can do the same thing with a spritesheet, see:
    //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    this.load.atlas('atlas', atlasPng, atlasJson)
  }

  create() {
    // console.log('Phaser.create')

    let map = this.make.tilemap({ key: 'map' })

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    let tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles')

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    let belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0)
    let worldLayer = map.createStaticLayer('World', tileset, 0, 0)
    let aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0)

    worldLayer.setCollisionByProperty({ collides: true })

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the 'Above Player' layer to sit on top of the this.player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10)

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named 'Spawn Point'
    let spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point')

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the this.player's body.
    // this.player = this.physics.add
    //   .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front')
    //   .setSize(30, 40)
    //   .setOffset(0, 24)

    this.player = this.physics.add
      .sprite(spawnPoint.x + 200, spawnPoint.y - 1010, 'atlas', 'misa-front')
      .setSize(30, 40)
      .setOffset(0, 24)
      .setVisible(false)
    // .setMaxVelocity(1000, 1000)

    // Watch the this.player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, worldLayer)

    // Create the this.player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    let anims = this.anims
    anims.create({
      key: 'misa-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-left-walk.',
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    })
    anims.create({
      key: 'misa-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-right-walk.',
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    })
    anims.create({
      key: 'misa-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-front-walk.',
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    })
    anims.create({
      key: 'misa-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-back-walk.',
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    })

    this.camera = this.cameras.main
    this.camera.startFollow(this.player)
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.cursors = this.input.keyboard.createCursorKeys()

    // Help text that has a 'fixed' position on the screen
    this.add
      .text(16, 16, "Arrow keys to move\nPress 'D' to show hitboxes", {
        font: '18px monospace',
        fill: '#000000',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff'
      })
      .setScrollFactor(0)
      .setDepth(30)

    // Debug graphics
    this.input.keyboard.once('keydown_D', event => {
      // Turn on physics debugging to show this.player's hitbox
      this.physics.world.createDebugGraphic()

      // Create worldLayer collision graphic above the this.player, but below the help text
      let graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20)
      worldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Display.Color(40, 39, 37, 255) // Color of colliding face edges
      })
    })

    this.onScene(this)
  }

  update() {
    // console.log('Phaser.update')

    let onGround = this.player.body.blocked.down
    let accel = onGround ? 600 : 50

    if (this.cursors.left.isDown) {
      this.player.setAccelerationX(-accel)
      this.player.setFlipX(true)
    } else if (this.cursors.right.isDown) {
      this.player.setAccelerationX(accel)
      this.player.setFlipX(false)
    } else {
      this.player.setAccelerationX(0)
    }

    if (onGround && this.cursors.up.isDown) {
      this.player.setVelocityY(-500)
    }

    if (onGround) {
      this.player.setDrag(1000, 0)
      this.player.setMaxVelocity(300, 1000)
      if (this.player.body.velocity.x !== 0) this.player.anims.play('misa-right-walk', true)
      else this.player.setTexture('atlas', 'misa-right')
    } else {
      this.player.setDrag(0, 0)
      this.player.setMaxVelocity(300, 1000)
      this.player.anims.stop()
      this.player.anims.play('misa-right-walk', true)
    }
  }

  // frameRequestCallback(t) {


  //   requestAnimationFrame(this.frameRequestCallback)
  // }
}

export default Phaser
