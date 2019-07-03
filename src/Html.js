import React, { useState, useEffect, useRef } from 'react'
import Cam from './Cam'
import styles from './styles/Html.module.scss'

function useResize(onResize) {
  useEffect(
    () => {
      window.addEventListener('resize', _ => onResize([window.innerWidth, window.innerHeight]))
    },
    []
  )
}

function useStream(vidRef) {
  let [stream, setStream] = useState()

  useEffect(
    () => {
      vidRef.current.srcObject = stream
    },
    [stream]
  )

  useEffect(
    () => {
      console.log(`getUserMedia!`)
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then(setStream)
    },
    []
  )

  return stream
}

function useAnimFrame(callback) {
  useEffect(
    () => {
      function animationFrame(t) {
        callback(t)
        requestAnimationFrame(animationFrame)
      }
      requestAnimationFrame(animationFrame)
      return () => cancelAnimationFrame(animationFrame)
    },
    []
  )
}

function Html({ phaser, onResize }) {
  if (!phaser) return null

  useResize(onResize)

  let vidRef = useRef()
  let vid2Ref = useRef()
  let stream = useStream(vidRef)
  let stream2 = useStream(vid2Ref)

  let [videoXY, setVideoXY] = useState([0, 0])
  let [video2XY, setVideo2XY] = useState([0, 0])
  // let [[lastX, lastY], setLastXY] = useState([phaser.player.x, phaser.player.y])


  useAnimFrame(
    () => {

      // if (~~phaser.player.x !== ~~lastX || ~~(phaser.player.y - 18) !== ~~lastY) {
      let vx = phaser.player.x - phaser.camera.scrollX - 33 //- phaser.player.width / 2
      let vy = phaser.player.y - phaser.camera.scrollY - 70 //- phaser.player.height / 2 + 13
      setVideoXY([vx, vy])
      //   setLastXY([~~phaser.player.x, ~~(phaser.player.y - 18)])
      // }
      let vx2 = phaser.player2.x - phaser.camera.scrollX - 33 //- phaser.player2.width / 2
      let vy2 = phaser.player2.y - phaser.camera.scrollY - 70 //- phaser.player2.height / 2 + 13
      setVideo2XY([vx2, vy2])
    }
  )


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
        onPlay={() => {
          phaser.player.setVisible(!!stream)
        }}
      />

      <Cam
        camRef={vid2Ref}
        xy={video2XY}
        hat={'🧢'}
        anim={'walk'}
        flip={phaser.player2.flipX}
        onPlay={() => {
          phaser.player2.setVisible(!!stream2)
        }}
      />

    </div>
  )
}

export default Html
