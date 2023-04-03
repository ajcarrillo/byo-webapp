import { useEffect } from 'react'

export const useObservable = (observable: { subscribe: (arg0: (result: any) => void) => any; }, setter: (arg0: any) => void) => {
  useEffect(() => {
    const subscription = observable.subscribe((result: any) => {
      setter(result)
    })
    
    return () => subscription.unsubscribe()
  }, [observable, setter])
}
