import { useEffect, useRef } from 'react'

export const useObservable = (observable: { subscribe: (arg0: (result: any) => void) => any; }, setter: (arg0: any) => void) => {
  useEffect(() => {
    const subscription = observable.subscribe((result: any) => {
      setter(result)
    })
    
    return () => subscription.unsubscribe()
  }, [observable, setter])
}

export const useEvent = (eventName: string, eventHandler: any) => {
  const cbRef = useRef(eventHandler)

  useEffect(() => {
    cbRef.current = eventHandler
  }) // update after each render

  useEffect(() => {
    console.log('+++ subscribe')
    const cb = (e: any) => cbRef.current(e) // then use most recent cb value
    window.addEventListener(eventName, cb)
    return () => {
      console.log('--- unsubscribe')
      window.removeEventListener(eventName, cb)
    }
  }, [eventName])
  return
}

export const useEffectOnlyOnce = (callback: (arg0: any) => void, dependencies: any, condition: (arg0: any) => any) => {
  const calledOnce = useRef(false)

  useEffect(() => {
    if (calledOnce.current) {
      return
    }

    if (condition(dependencies)) {
      callback(dependencies)
      calledOnce.current = true
    }
  }, [callback, condition, dependencies])
}