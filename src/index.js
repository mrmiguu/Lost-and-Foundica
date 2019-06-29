import Phaser from 'phaser'
import './index.css'
// assets
import tuxmonSample32pxExtruded from '../assets/tilesets/tuxmon-sample-32px-extruded.png'
import tuxemonTown from '../assets/tilemaps/tuxemon-town.json'
import atlasPng from '../assets/atlas/atlas.png'
import atlasJson from '../assets/atlas/atlas.json'

/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let game = new Phaser.Game(config)

window.addEventListener('resize', _ => {
  game.scale.setGameSize(window.innerWidth, window.innerHeight)
})

let cursors
let player
let showDebug = false

function preload() {
  this.load.image("tiles", tuxmonSample32pxExtruded)
  this.load.tilemapTiledJSON("map", tuxemonTown)

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // If you don't use an atlas, you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  this.load.atlas("atlas", atlasPng, atlasJson)
}

function create() {
  let map = this.make.tilemap({ key: "map" })

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  let tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles")

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  let belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0)
  let worldLayer = map.createStaticLayer("World", tileset, 0, 0)
  let aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0)

  worldLayer.setCollisionByProperty({ collides: true })

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10)

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  let spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point")

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  // player = this.physics.add
  //   .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
  //   .setSize(30, 40)
  //   .setOffset(0, 24)

  player = this.physics.add
    .sprite(spawnPoint.x + 200, spawnPoint.y - 510, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24)
  // .setMaxVelocity(1000, 1000)

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(player, worldLayer)

  let video = document.querySelector('#test')//document.createElement('video')
  // video.id = 'test'
  video.autoplay = true
  // document.body.append(video)
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
    // audio: true,
  }).then(stream => video.srcObject = stream)

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  let anims = this.anims
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  })
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  })
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  })
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  })

  let camera = this.cameras.main
  camera.startFollow(player)
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

  cursors = this.input.keyboard.createCursorKeys()

  // Help text that has a "fixed" position on the screen
  this.add
    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(30)

  // Debug graphics
  this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic()

    // Create worldLayer collision graphic above the player, but below the help text
    let graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20)
    worldLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    })
  })

  requestAnimationFrame(t => frameRequestCallback({
    player,
    camera,
    video,
  }, t))
}

function update() {
  let onGround = player.body.blocked.down
  let accel = onGround ? 600 : 50

  if (cursors.left.isDown) {
    player.setAccelerationX(-accel)
    player.setFlipX(true)
  } else if (cursors.right.isDown) {
    player.setAccelerationX(accel)
    player.setFlipX(false)
  } else {
    player.setAccelerationX(0)
  }

  if (onGround && cursors.up.isDown) {
    player.setVelocityY(-500)
  }

  if (onGround) {
    player.setDrag(1000, 0)
    player.setMaxVelocity(300, 1000)
    if (player.body.velocity.x !== 0) player.anims.play("misa-right-walk", true)
    else player.setTexture("atlas", "misa-right")
  } else {
    player.setDrag(0, 0)
    player.setMaxVelocity(300, 1000)
    player.anims.stop()
    player.anims.play("misa-right-walk", true)
  }
}

let lastX
let lastY

function frameRequestCallback(params, t) {
  let {
    player: { x, y },
    camera,
    video,
  } = params

  if (x !== lastX || y !== lastY) {
    let tx = x - camera.scrollX - player.width / 2
    let ty = y - camera.scrollY - player.height / 2 + 10

    // let el = document.getElementById('test')
    video.style.transform = `translate(${tx}px, ${ty}px)`

    lastX = x
    lastY = y
  }

  requestAnimationFrame(t => frameRequestCallback(params, t))
}
