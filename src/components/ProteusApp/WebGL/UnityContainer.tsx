import React, { useEffect, useRef, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'

interface IWebGLProps {
  loaderUrl: string,
  dataUrl: string,
  frameworkUrl: string,
  codeUrl: string,
}

const UnityContainer: React.FC<IWebGLProps> = (props: IWebGLProps) => {
  const { loaderUrl, dataUrl, frameworkUrl, codeUrl } = props
  const GAME_OBJECT = 'ProteusInterface'

  const {
    loadingProgression,
    unityProvider,
    isLoaded,
    requestFullscreen,
    requestPointerLock,
    sendMessage,
    initialisationError,
    addEventListener,
    removeEventListener,
    takeScreenshot,
    unload,
  } = useUnityContext({
    codeUrl,
    dataUrl,
    frameworkUrl,
    loaderUrl,
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
    cacheControl: (url: string) => 'no-cache',
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [screenshots, setScreenshots] = useState<string[]>([])


  function handleClickRequestFullScreen() {
    requestFullscreen(true)
  }

  function handleClickRequestPointerLock() {
    requestPointerLock()
  }

  function handleClickUnload() {
    unload()
  }

  function handleClickSetLogText() {
    // sendMessage(
    //   'Persistent',
    //   'SetLogText',
    //   'Hello World, the time is ' + new Date().toISOString()
    // )
    sendMessage(GAME_OBJECT, 'ToggleDebug', 'show')
  }

  function handleClickLogCanvasRefToConsole() {
    console.log('Canvas Reference', { canvasRef: canvasRef.current })
  }

  const handleClickTakeScreenshot = () => {
    const screenshot = takeScreenshot('image/jpg', 1)
    if (screenshot) {
      setScreenshots([...screenshots, screenshot])
    }
  }

  useEffect(() => {
    function logParametersToConsole(...parameters: any[]) {
      //console.log({ parameters })
    }

    addEventListener('ClickedTestButton', logParametersToConsole)
    addEventListener('ClickedStringTestButton', logParametersToConsole)
    addEventListener('ClickedNumberTestButton', logParametersToConsole)
    addEventListener('ClickedNumbersTestButton', logParametersToConsole)
    addEventListener('ClickedBoolTestButton', logParametersToConsole)
    addEventListener('ClickedObjectTestButton', logParametersToConsole)
    return () => {
      removeEventListener('ClickedTestButton', logParametersToConsole)
      removeEventListener('ClickedStringTestButton', logParametersToConsole)
      removeEventListener('ClickedNumberTestButton', logParametersToConsole)
      removeEventListener('ClickedNumbersTestButton', logParametersToConsole)
      removeEventListener('ClickedBoolTestButton', logParametersToConsole)
      removeEventListener('ClickedObjectTestButton', logParametersToConsole)
    }
  }, [addEventListener, removeEventListener])

  return (
    <>
      <h2>Unity Test</h2>
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
      </p>
      <Unity
        unityProvider={unityProvider}
        style={{
          width: '100%',
        }}
        devicePixelRatio={window.devicePixelRatio}
        disabledCanvasEvents={['dragstart']}
        ref={canvasRef}
      />
    </>
  )
}

export { UnityContainer }
