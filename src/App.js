import React, { useState } from 'react'
import Html from './Html'
import Canvas from './Canvas'
import { } from './styles/App.module.scss'

function App() {
  let [size, setSize] = useState([window.innerWidth, window.innerHeight])
  let [phaser, setPhaser] = useState()

  return (
    <div>
      <Html
        phaser={phaser}
        onResize={setSize}
      />

      <Canvas
        size={size}
        onPhaser={setPhaser}
      />
    </div>
  )
}

export default App
