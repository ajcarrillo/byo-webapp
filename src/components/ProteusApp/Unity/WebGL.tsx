import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'

interface IWebGLProps {
  loaderUrl: string,
  dataUrl: string,
  frameworkUrl: string,
  codeUrl: string,
}

const WebGL: React.FC<IWebGLProps> = (props: IWebGLProps) => {
  const { loaderUrl, dataUrl, frameworkUrl, codeUrl } = props
  const GAME_OBJECT = 'Interface'

  const { 
    unityProvider, 
    loadingProgression, 
    isLoaded, 
    sendMessage, 
    addEventListener, 
    removeEventListener 
  } = useUnityContext({
    loaderUrl: '/proteus-app/Build/proteus-app.loader.js',
    dataUrl: '/proteus-app/Build/proteus-app.data',
    frameworkUrl: '/proteus-app/Build/proteus-app.framework.js',
    codeUrl: '/proteus-app/Build/proteus-app.wasm',
  })

  const [showDebugUI, setShowDebugUI] = useState<boolean>(false)

  const handleControllerConfigUpdate = useCallback((jsonData: string) => {
    console.log(jsonData)
  }, [])

  useEffect(() => {
    addEventListener('UpdateConfig', handleControllerConfigUpdate)
    return () => {
      removeEventListener('UpdateConfig', handleControllerConfigUpdate)
    }
  }, [addEventListener, removeEventListener, handleControllerConfigUpdate])

  /**
   * Updates the debug UI visibilty and dispatches an event to Unity
   */
  const handleToggleDebugUI = () => {
    setShowDebugUI((prev: boolean) => {
      sendMessage(GAME_OBJECT, 'ToggleDebug', !prev)
      return !prev
    })
  }
  console.log(isLoaded)
  return (
    <div className="WebGL-container">
      {!isLoaded ? (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      ) : (
        <>
          <Unity
            unityProvider={unityProvider}
            style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
          />

          <button onClick={() => handleToggleDebugUI()}>Toggle Debug</button>
        </>
      )}
    </div>
  )
}

export default WebGL