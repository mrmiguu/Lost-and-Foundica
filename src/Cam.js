import React, { /* useRef, */ useEffect, useState } from 'react'
// import styled from 'styled-components'
import styles from './styles/Cam.module.scss'
import cx from 'classnames'
import { anims } from './const'

let hats = {
  '🧢': styles.BilledHat,
  '💣': styles.BombHat,
  '🎩': styles.TopHat,
  '👒': styles.SunHat,
  '⛑': styles.MedicHat,
}

function Cam({ camRef, xy, anim, hat, flip, muted, onPlay, onStream }) {
  let { frames, rate } = anims[anim]

  let [frame, setFrame] = useState(0)
  let [isPlaying, setIsPlaying] = useState()
  // let camRef = useRef()
  // let stream = useMedia('user', true)

  // useEffect(() => {
  //   camRef.current.srcObject = stream

  //   if (stream) {
  //     onStream && onStream(stream)
  //   }

  // }, [stream, onStream])

  useEffect(() => {
    setFrame(0)

    let i = setInterval(() =>
      setFrame(frame =>
        (frame + 1) % frames.length,
      ),
      rate
    )

    return () => clearInterval(i)
  }, [anim, frames, rate])

  return (
    <div
      className={cx(styles.Cam)}
      style={{
        transform: `translate(${xy[0]}px, ${xy[1]}px) ${flip ? 'scale(-1,1)' : ''}`,
      }}
      hidden={!camRef || !camRef.current || !camRef.current.srcObject}
    >
      {/* <img
        className={styles.Body}
        src={anims['stand'].frames[frame]}
        alt="sprite body"
      /> */}
      {/* {
        Object.keys(anims).flatMap(a =>
          anims[a].frames.map((body, f) => {
            let isUs = a === anim && f === frame

            return (
              <img
                key={`${a},${f}`}
                className={styles.Body}
                src={body}
                alt="sprite body"
                style={isUs ? { display: 'inline' } : { display: 'none' }}
              />
            )
          })
        )
      } */}

      <div
        className={styles.Crop}
        style={{
          transform: flip ? 'scale(-1, 1)' : 'scale(-1, 1)',
        }}
      >
        <video
          ref={camRef}
          autoPlay
          playsInline
          onPlay={() => {
            setIsPlaying(true)
            onPlay()
          }}
        // muted={muted}
        // hidden
        />
      </div>

      <span className={hats[hat]} hidden={!isPlaying}>
        {hat}
      </span>

      {/* <span className={styles.Name}>Alex</span> */}

    </div>

  )
}

export default Cam
