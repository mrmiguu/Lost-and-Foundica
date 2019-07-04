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
  let [uids, setUids] = useState([])

  useEffect(
    () => {
      firebase.auth()
        .signInAnonymously()
        .then(cred => {
          let signInRef = firebase.database().ref(cred.user.uid)

          signInRef.set(true)
          signInRef
            .onDisconnect()
            .remove()

          setUser(cred.user)
        })
    },
    []
  )

  useEffect(() => {
    firebase.database().ref().on('value', snap => {
      let uids = []
      snap.forEach(item => {
        uids = [...uids, item.key]
      })
      setUids(uids)
    })
  }, [])

  useEffect(
    () => {
      if (user) console.log(`uid ${user.uid}`)
    },
    [user]
  )

  useEffect(
    () => {
      console.log(`uids ${JSON.stringify(uids)}`)
    },
    [uids]
  )

  return [user, uids]
}

function App() {
  let [size, setSize] = useState([window.innerWidth, window.innerHeight])
  let [phaser, setPhaser] = useState()
  let [user, uids] = useAuth()

  useEffect(
    () => {
      let pairs = uids.map(uid => {
        let ref = firebase.database().ref(uid)
        let cb = snap => {
          console.log(`${uid}@val ${JSON.stringify(snap.val())}`)
        }
        ref.on('value', cb)
        setTimeout(() => ref.set({
          xy: [
            uid === user.uid ? phaser.player.x : phaser.player2.x,
            uid === user.uid ? phaser.player.y : phaser.player2.y,
          ]
        }), 3000)
        return [uid, cb]
      })


      return () => pairs.forEach(([uid, cb]) => {
        firebase.database().ref(uid).off('value', cb)
      })
    },
    [uids]
  )


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
