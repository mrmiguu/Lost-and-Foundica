import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Html from './Html'
import Canvas from './Canvas'
import { } from './styles/App.module.scss'

firebase.initializeApp({
  apiKey: 'AIzaSyCKE8XTWiaGoLE876gg_fTMMj0yDLV7L2Q',
  authDomain: 'test-3bb26.firebaseapp.com',
  databaseURL: 'https://test-3bb26.firebaseio.com',
  projectId: 'test-3bb26',
  storageBucket: 'test-3bb26.appspot.com',
  messagingSenderId: '198127730795',
  appId: '1:198127730795:web:24e6a169235767b4'
})

function useAuth() {
  let [user, setUser] = useState()

  useEffect(
    () => {
      firebase.auth()
        .signInAnonymously()
        .then(cred => setUser(cred.user))
    },
    []
  )

  useEffect(
    () => {
      if (user) console.log(`uid ${user.uid}`)
    },
    [user]
  )

  return user
}

function App() {
  let [size, setSize] = useState([window.innerWidth, window.innerHeight])
  let [phaser, setPhaser] = useState()
  let user = useAuth()

  if (!user) return null

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
