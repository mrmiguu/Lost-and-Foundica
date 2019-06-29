import { useRef, useLayoutEffect } from 'react'

function useAnimationFrame(callback) {

  let callbackRef = useRef(callback)
  useLayoutEffect(() => {

    callbackRef.current = callback

  }, [callback])

  function af(t) {
    frameRef.current = requestAnimationFrame(af)
    callbackRef.current(t)
  }

  let frameRef = useRef()
  useLayoutEffect(() => {

    frameRef.current = requestAnimationFrame(af)
    return () => cancelAnimationFrame(frameRef.current)

  }, [])

}

export { useAnimationFrame }
