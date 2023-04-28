import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUnityContext } from 'react-unity-webgl'

import { IProteusState, ProteusMappingConfig } from '../../types/proteus-types'
import { resolveControllerMappingMode, resolveControllerModuleFromMapping } from '../../utils/proteus-utils'
import { getControllerConfigRequest, setGamepadReadyRequest, setMappingModeRequest, setUnityReadyRequest } from '../../store/proteus/proteus-actions'
import ProteusEventHandler from './EventHandler/ProteusEventHandler'
import { transformProteusWebGLFileVersion } from '../../transformers/proteus-transformers'
import UnityContainer from './Unity/UnityContainer'
import ProteusHints from './Hints/ProteusHints'
import ProteusMapping from './Mapping/ProteusMapping'
import ProteusGallery from './Gallery/ProteusGallery'
import ProteusLogo from '../../assets/images/proteus-header-logo.png'
import ProteusLightGreen from '../../assets/images/proteus-footer-light-green.png'
import ProteusLightRed from '../../assets/images/proteus-footer-light-red.png'

interface IProteusShellProps {
  proteus: IProteusState
}

const ProteusShell: React.FC<IProteusShellProps> = (props: IProteusShellProps) => {
  const dispatch = useDispatch()
  const { proteus } = props
  const UNITY_GAME_OBJECT = 'ProteusInterface'
  const [activeWorkspace, setActiveWorkspace] = useState('home')
  const [navigationDisabled, setNavigationDisabled] = useState(true)

  /**
   * Generate the Unity Provider and interface objects for the Unity WebGL
   */
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
    codeUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_CODE || '', proteus.version || ''),
    dataUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_DATA || '', proteus.version || ''),
    frameworkUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_FRAMEWORK || '', proteus.version || ''),
    loaderUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_LOADER || '', proteus.version || ''),
    webglContextAttributes: {
      alpha: true,
      antialias: proteus.settings?.antialiasing,
      depth: proteus.settings?.depthTesting,
      failIfMajorPerformanceCaveat: true,
      powerPreference: proteus.settings?.gpuHighPerformance ? 'high-performance' : 'low-power',
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      stencil: proteus.settings?.multipass,
      desynchronized: false,
      xrCompatible: true,
    },
    cacheControl: (url: string) => 'no-cache',
  })

  /**
   * Changes the current workspace and tells Unity which workspace is active
   * @param worksapce 
   */
  const handleClickWorkspace = (worksapce: string) => {
    if(!navigationDisabled){
      setActiveWorkspace(worksapce)
      sendMessage(
        UNITY_GAME_OBJECT, 
        'WorkspaceChange', 
        worksapce
      )      
    }
  }

  /**
   * Updates the Redux store with the Unity ready state
   * @param ready 
   */
  const setUnityReady =  (ready: boolean) => {
    dispatch(setUnityReadyRequest(ready))
  }

  /**
   * Updates the Redux store with the Gamepad ready state
   * @param ready 
   */
  const setGamepadReady =  (ready: boolean) => {
    dispatch(setGamepadReadyRequest(ready))
  }

  /**
   * Updates the Redux store with the control used on the gamepad,
   * and the module it belongs to
   * @param control 
   */
  const setMappingMode = (control: string) => {
    const mappingConfig: ProteusMappingConfig = {
      mode: resolveControllerMappingMode(control) as ProteusMappingConfig['mode'],
      control,
      module: resolveControllerModuleFromMapping(proteus.connectedController?.controllerConfiguration, control),
    }
    dispatch(setMappingModeRequest(mappingConfig))
  }

  /**
   * Handles events emitted from the ProteusEventHandler component
   * @param eventtName 
   * @param payload 
   */
  const handleUnityEvent = (eventtName: string, payload: string) => {
    switch(eventtName){
    // Unity is ready
    case'ready':
      setUnityReady(true)
      break
    // A connected gamepad has been initialised in Unity
    case'gamepadReady':
      setGamepadReady(true)
      break
    // Unity finsihed rendering the controller
    case'controllerBuilt': 
      sendMessage(
        UNITY_GAME_OBJECT, 
        'WorkspaceChange', 
        activeWorkspace
      )
      setNavigationDisabled(false)
      break
    // User used a button/joystick on the controller
    case'buttonPress':
      setMappingMode(payload)
      break
    default:
      break
    }
  }

  /**
   * Handles a Controller event emitted from the ProteusEventHandler component
   * @param evt 
   * @param payload 
   */
  const handleControllerEvent = (evt: string, payload: string) => {
    //
  }

  /**
   * Connects a controller via USB or Bluetooth
   */
  const requestControllerConfig = useCallback(() => {
    const deviceInterface = proteus.connectedController?.connectionType === 'usb' 
      ? proteus.connectedController?.usbDevice 
      : proteus.connectedController?.connectionType === 'bluetooth' 
        ? proteus.connectedController?.bluetoothDevice 
        : null

    dispatch(getControllerConfigRequest(
      proteus.connectedController?.connectionType || '',
      deviceInterface || null,
      proteus.modules || []
    ))
  }, [dispatch, proteus.connectedController?.bluetoothDevice, proteus.connectedController?.connectionType, proteus.connectedController?.usbDevice, proteus.modules])

  /**
   * Requests the intial controller configuration if it is not in the store AND Unity is ready
   */
  useEffect(() => {
    if(proteus.unityReady && !proteus.connectedController?.controllerConfiguration) requestControllerConfig()
  }, [proteus.connectedController?.controllerConfiguration, proteus.unityReady, requestControllerConfig])

  /**
   * Once we have a controller configuration and Unity is ready, we tell Unity to show its
   * debug screen (if in debug mode), then we send the controller configuration
   */
  useEffect(() => {
    if(proteus.unityReady && proteus.connectedController?.controllerConfiguration?.modules){
      setTimeout(() => {
        //if(process.env.REACT_APP_PROTEUS_DEBUG === 'true')
        //sendMessage(UNITY_GAME_OBJECT, 'ToggleDebug', 'show')

        sendMessage(
          UNITY_GAME_OBJECT, 
          'BuildControllerConfig', 
          JSON.stringify({modules:proteus.connectedController?.controllerConfiguration?.modules})
        )
      }, 1000)
    }
  }, [proteus.connectedController?.controllerConfiguration, proteus.unityReady, sendMessage])

  //console.log(proteus.connectedController?.controllerConfiguration?.modules)
  //console.log(JSON.stringify(proteus.connectedController?.controllerConfiguration?.modules).replaceAll('"', '\\"'))
  return (
    <>
      <div className='Proteus-shell'>
        <div className='Proteus-shell-header'>
          <div className='Proteus-shell-header-logo-container'>
            <div className="Proteus-shell-header-logo">
              <img src={ProteusLogo} alt="Proteus Logo" style={{width: '100%'}} />
            </div>          
          </div>
          <div className='Proteus-shell-header-version'>Build Version: {proteus.version}</div>
          <div className='Proteus-shell-header-avatar'>&nbsp;</div>
        </div>
        <div className='Proteus-shell-workspace'>
          <div className='Proteus-shell-workspace-inner'>
            <div className='Proteus-shell-workspace-toolbar'>
              {proteus.controllerConnectionError ? (
                <div className={'Proteus-shell-error-panel'}>
                  <i className={'fa-solid fa-face-frown'} style={{fontSize: '1.5rem', marginRight: '.6rem'}}></i>
                  <div style={{width: '100%'}}>
                    <div style={{fontSize: '1rem', color: 'rgb(160,160,160)'}}>{proteus.controllerConnectionError}</div>
                  </div>
                </div>
              ) : (<div></div>)}
              <div>
                <button 
                  className={navigationDisabled ? 'Proteus-toolbar-button__disabled' : activeWorkspace === 'home' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'}
                  onClick={() => handleClickWorkspace('home')}
                >
                  <i className='fa-solid fa-mask'></i>
                </button>
                <button 
                  className={navigationDisabled ? 'Proteus-toolbar-button__disabled' : activeWorkspace === 'mapping' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('mapping')}
                >
                  <i className='fa-solid fa-gamepad'></i>
                </button>
                <button 
                  className={navigationDisabled ? 'Proteus-toolbar-button__disabled' : activeWorkspace === 'gallery' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('gallery')}
                >
                  <i className='fa-solid fa-image'></i>
                </button>
                <button 
                  className={navigationDisabled ? 'Proteus-toolbar-button__disabled' : activeWorkspace === 'settings' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('settings')}
                >
                  <i className='fa-solid fa-gear'></i>
                </button>                  
              </div>
            </div>
            <div className='Proteus-shell-workspace-unity'>
              <ProteusEventHandler
                broadcastUnityEvent={handleUnityEvent}
                broadcastControllerEvent={handleControllerEvent}
                connectedController={proteus.connectedController}
                unityAddEventListener={addEventListener}
                unityRemoveEventListener={removeEventListener}
              />
              <UnityContainer 
                isLoaded={isLoaded}
                loadingProgression={loadingProgression}
                unityProvider={unityProvider}
              />
              <ProteusHints 
                showHints={proteus.settings?.displayHints || true} 
                workspace={activeWorkspace}
                language={'en'}
              />
              <ProteusMapping 
                gamepadReady={proteus.gamepadReady}
                mapping={proteus.mapping} 
                workspace={activeWorkspace}
                language={'en'}
              />
              <ProteusGallery 
                gallery={proteus.gallery}
                galleryLoading={proteus.galleryLoading}
                takeScreenshot={takeScreenshot}
                setNavigationDisabled={setNavigationDisabled}
                controllerConfig={JSON.stringify(proteus.connectedController?.controllerConfiguration?.modules)}
                workspace={activeWorkspace}
                language={'en'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='Proteus-shell-footer'>
        <div className='Proteus-shell-footer-connected'>
          <div style={{paddingRight: '5px'}}>Controller connected: </div>
          <div style={{paddingRight: '10px', paddingTop: '2px'}}>
            <img 
              className={`${proteus.connectedController?.communicating ? 'BlinkMeQuick' : ''}`}
              src={proteus.connectedController?.connected ? ProteusLightGreen : ProteusLightRed} 
              alt="Connected Light" 
              style={{width: '14px'}} 
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProteusShell
