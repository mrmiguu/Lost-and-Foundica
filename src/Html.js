import React, { useState, useEffect, useRef } from 'react'
import Cam from './Cam'
import styles from './styles/Html.module.scss'

function Html({ phaser, onResize }) {

  if (!phaser || !phaser.player) return null

  useEffect(
    () => {
      window.addEventListener('resize', _ => onResize([window.innerWidth, window.innerHeight]))
    },
    []
  )

  useEffect(
    () => {
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then(stream => vidRef.current.srcObject = stream)
    },
    []
  )

  let [videoXY, setVideoXY] = useState([0, 0])
  // let [[lastX, lastY], setLastXY] = useState([0, 0])

  useEffect(
    () => {
      function animationFrame(t) {

        if (phaser.player) {
          // if (phaser.player.x !== lastX || phaser.player.y !== lastY) {
          let vx = phaser.player.x - phaser.camera.scrollX - 33 //- phaser.player.width / 2
          let vy = phaser.player.y - phaser.camera.scrollY - 70 //- phaser.player.height / 2 + 13

          setVideoXY([vx, vy])
          //   setLastXY([phaser.player.x, phaser.player.y])
          // }
        }

        requestAnimationFrame(animationFrame)
      }
      requestAnimationFrame(animationFrame)
    },
    []
  )

  let vidRef = useRef()

  // console.log(`re-render video`)

  return (
    <div>
      {/* <div
        id={styles.Video}
        style={{
          transform: `translate(${vx}px, ${vy}px) scale(-1, 1)`
        }}
      >
        <div id={styles.Crop}>
          <video
            ref={vidRef}
            autoPlay
            playsInline
          />
        </div>
      </div> */}
      <Cam
        camRef={vidRef}
        xy={videoXY}
        hat={'🧢'}
        anim={'walk'}
        flip={phaser.player.flipX}
      />
    </div>
  )
}

export default Html
