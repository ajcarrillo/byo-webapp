import React, { useEffect, useRef, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import { UnityProvider } from 'react-unity-webgl/distribution/types/unity-provider'

import './Unity.css'

interface IUnityContainerProps {
  unityProvider: UnityProvider,
  loadingProgression: number,
  isLoaded: boolean,
}

const UnityContainer: React.FC<IUnityContainerProps> = (props: IUnityContainerProps) => {
  const { unityProvider, loadingProgression, isLoaded } = props

  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [screenshots, setScreenshots] = useState<string[]>([])


  function handleClickRequestFullScreen() {
    //requestFullscreen(true)
  }

  function handleClickRequestPointerLock() {
    //requestPointerLock()
  }

  function handleClickUnload() {
    //unload()
  }

  function handleClickSetLogText() {
    // sendMessage(
    //   'Persistent',
    //   'SetLogText',
    //   'Hello World, the time is ' + new Date().toISOString()
    // )
    //sendMessage(GAME_OBJECT, 'ToggleDebug', 'show')
  }

  function handleClickLogCanvasRefToConsole() {
    console.log('Canvas Reference', { canvasRef: canvasRef.current })
  }

  // const handleClickTakeScreenshot = () => {
  //   const screenshot = takeScreenshot('image/jpg', 1)
  //   if (screenshot) {
  //     setScreenshots([...screenshots, screenshot])
  //   }
  // }

  return (
    <>
      {/* <h2>Unity Test</h2>
      <p>
        Loading progression: <code>{loadingProgression}</code>
        <br />
        Loaded: <code>{isLoaded ? 'YES' : 'NO'}</code>
        <br />
        Error: <code>{initialisationError?.message || 'NONE'}</code>
        <br />
        References:
        <button onClick={handleClickLogCanvasRefToConsole}>
          Log Canvas Ref to Console
        </button>
        <br />
        Actions:
        <button onClick={handleClickRequestFullScreen}>
          Request Fullscreen
        </button>
        <button onClick={handleClickRequestPointerLock}>
          Request Pointer Lock
        </button>
        <button onClick={handleClickUnload}>Unload</button>
        <br />
        Screenshots:
        <button onClick={handleClickTakeScreenshot}>Take Screenshot</button>
        {screenshots.map((screenshot, index) => (
          <img key={index} src={screenshot} height={50} alt="Screenshot" />
        ))}
        <br />
        Communication:
        <button onClick={handleClickSetLogText}>Set Log Text</button>
      </p> */}
      {!isLoaded && (
        <div className='Unity-loading-container'>
          <span>Loading... {Math.round(loadingProgression * 100)}%</span>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        className={'Proteus-webgl-canvas'}
        style={{ visibility: isLoaded ? 'visible' : 'hidden', display: isLoaded ? '' : 'none' }}
        devicePixelRatio={window.devicePixelRatio}
        disabledCanvasEvents={['dragstart', 'scroll', 'click']}
        // ref={canvasRef}
      />
      {/* <div className='Proteus-webgl-canvas'></div> */}
    </>
  )
}

export default UnityContainer
