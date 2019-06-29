import React, { useState, useEffect } from 'react'
import Phaser from './Phaser'
// styles
import './styles/Phaser.module.scss'

function Canvas({ size, onPhaser }) {
  let [phaser, setPhaser] = useState()

  useEffect(
    () => {
      if (!phaser) return

      let [width, height] = size
      console.log(`(${width}, ${height})`)
      phaser.scale.setGameSize(width, height)
    },
    [phaser, size]
  )

  useEffect(
    () => {
      if (!phaser) return
      onPhaser(phaser)
    },
    [phaser]
  )

  useEffect(
    () => {
      console.log(`THE ENTIRETY OF PHASER HAS BEEN INITIALIZED`)
      setPhaser(new Phaser({ size }))
    },
    []
  )

  return (
    null
  )
}

export default Canvas
