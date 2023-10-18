import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUnityContext } from 'react-unity-webgl'

import { IProteusState, ProteusMappingConfig } from '../../types/proteus-types'
import { 
  resolveHidInputReportConfigDataPage, 
  resolveHidInputReportConfigHeader, 
  resolveHidInputReportXboxInput
} from '../../utils/hid-utils'
import { resolveControllerMappingMode, resolveControllerModuleFromMapping } from '../../utils/proteus-utils'
import { 
  setControllerCommunicatingRequest, 
  setControllerDisconnectRequest, 
  setGamepadReadyRequest, 
  setHidProcessingConfigRequest,
  setMappingModeRequest, 
  setUnityReadyRequest, 
  setHidConfigHeaderSuccess,
  setHidConfigDataPageSuccess
} from '../../store/proteus/proteus-actions'
import ProteusEventHandler from './EventHandler/ProteusEventHandler'
import { transformProteusWebGLFileVersion } from '../../transformers/proteus-transformers'
import { 
  HID_REPORT_ID, 
  HID_REPORT_SUBTYPE_CONFIG_DATA, 
  HID_REPORT_SUBTYPE_CONFIG_HEADER, 
  HID_REPORT_SUBTYPE_CONFIG_NEW, 
  HID_REPORT_TYPE_CONFIG, 
  HID_REPORT_TYPE_FIRMWARE,
  HID_REPORT_TYPE_XBOX
} from '../../utils/constants/hid-constants'
import UnityContainer from './Unity/UnityContainer'
import ProteusHints from './Hints/ProteusHints'
import ProteusScene from './Scene/ProteusScene'
import ProteusMapping from './Mapping/ProteusMapping'
import ProteusGallery from './Gallery/ProteusGallery'
import ProteusSettings from './Settings/ProteusSettings'
import ProteusDataProcessor from './DataProcessor/ProteusDataProcessor'
import ProteusLogo from '../../assets/images/proteus-header-logo.png'
import ProteusLightGreen from '../../assets/images/proteus-footer-light-green.png'
import ProteusLightRed from '../../assets/images/proteus-footer-light-red.png'

interface IProteusShellProps {
  proteus: IProteusState
}

const ProteusShell: React.FC<IProteusShellProps> = (props: IProteusShellProps) => {
  const dispatch = useDispatch()
  const { proteus } = props
  
  const [activeWorkspace, setActiveWorkspace] = useState('home')
  const [navigationDisabled, setNavigationDisabled] = useState(true)

  const UNITY_GAME_OBJECT = 'ProteusInterface'

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
    codeUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_CODE || '', proteus.appVersion || ''),
    dataUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_DATA || '', proteus.appVersion || ''),
    frameworkUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_FRAMEWORK || '', proteus.appVersion || ''),
    loaderUrl: transformProteusWebGLFileVersion(process.env.REACT_APP_PROTEUS_WEBGL_LOADER || '', proteus.appVersion || ''),
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
    // Unity finsihed rendering the controller
    case'controllerBuilt': 
      sendMessage(
        UNITY_GAME_OBJECT, 
        'WorkspaceChange', 
        activeWorkspace
      )
      setNavigationDisabled(false)
      setGamepadReady(true)
      break
    default:
      break
    }
  }

  const handleControllerRotation = (axis: string) => {
    sendMessage(
      UNITY_GAME_OBJECT, 
      'RotateController', 
      axis
    ) 
  }

  const handleSceneLighting = (scene: string) => {
    sendMessage(
      UNITY_GAME_OBJECT, 
      'LightingChange', 
      scene
    ) 
  }

  const handleNewConfigEvent = async () => {
    setNavigationDisabled(true)
    dispatch(setHidProcessingConfigRequest(true))
  }

  /**
   * Handles a Controller event emitted from the ProteusEventHandler component
   * @param eventType The string name of the event 
   * @param reportId The input report ID
   * @param payload The data contained in the event
   */
  const handleControllerEvent = (eventType: string, reportId: number, payload: DataView) => {
    if(eventType === 'hidDisconnect')
    {
      dispatch(setControllerDisconnectRequest('You disconnected your controller'))
    }
    else if(eventType === 'inputReport' && reportId === HID_REPORT_ID)
    {
      // console.log(payload)
      if(payload !== undefined){
        const reportType = payload.getUint8(0)
        const reportSubtype = payload.getUint8(1)

        if(reportType === HID_REPORT_TYPE_CONFIG)
        {
          if(reportSubtype === HID_REPORT_SUBTYPE_CONFIG_NEW){
            // User will have reconfigured the controller - halt the app - load data precessor
            handleNewConfigEvent()
          }
          else if(reportSubtype === HID_REPORT_SUBTYPE_CONFIG_HEADER){
            const configHeader = resolveHidInputReportConfigHeader(payload)
            dispatch(setHidConfigHeaderSuccess(configHeader))
          }
          else if(reportSubtype === HID_REPORT_SUBTYPE_CONFIG_DATA){
            const configDataPage = resolveHidInputReportConfigDataPage(payload)
            dispatch(setHidConfigDataPageSuccess(configDataPage))
          }
        }
        else if(reportType === HID_REPORT_TYPE_FIRMWARE)
        {
          //
        }
        else if(reportType === HID_REPORT_TYPE_XBOX)
        {
          if(activeWorkspace === 'mapping')
          {
            const inputData = resolveHidInputReportXboxInput(proteus.connectedController?.controllerConfiguration?.modules, payload)
            console.log(inputData)

            if(inputData.module === null) return
            
            //const inputData = resolveInputReport(payload)
            // Ignore duplicate button presses
            if(proteus.mapping){
              if(inputData.control === proteus.mapping.control && inputData.module?.id === proteus.mapping.module?.id)
                return
            }
            //setMappingMode(inputData || '')
            dispatch(setMappingModeRequest(inputData))
          }
        }
      }
    }

    dispatch(setControllerCommunicatingRequest(false))
  }

  /**
   * Tells Unity that a button has been pressed
   */
  useEffect(() => {
    if(proteus.mapping?.control){
      sendMessage(
        UNITY_GAME_OBJECT, 
        'ButtonPress', 
        `${proteus.mapping?.module?.id}:${proteus.mapping?.control}`
      )      
    }
  }, [proteus.mapping?.control, proteus.mapping?.module?.id, sendMessage])

  /**
   * If the data processor has finished, and we have a controller configuration, and Unity is ready, we render
   */
  useEffect(() => {
    if(!proteus.hidReports?.processingControllerConfig){
      if(proteus.unityReady && proteus.connectedController?.controllerConfiguration?.modules){
        setTimeout(() => {
          console.log(JSON.stringify(proteus.connectedController?.controllerConfiguration?.modules).replaceAll('"', '\\"'))
          sendMessage(
            UNITY_GAME_OBJECT, 
            'BuildControllerConfig', 
            JSON.stringify({modules:proteus.connectedController?.controllerConfiguration?.modules})
          )
        }, 1000)
      }      
    }
  }, [proteus.connectedController?.controllerConfiguration, proteus.hidReports?.processingControllerConfig, proteus.unityReady, sendMessage])
 
  //console.log(proteus)
  return (
    <>
      <div className='Proteus-shell'>
        <div className='Proteus-shell-header'>
          <div className='Proteus-shell-header-logo-container'>
            <div className="Proteus-shell-header-logo">
              <img src={ProteusLogo} alt="Proteus Logo" style={{width: '100%'}} />
            </div>          
          </div>
          <div className='Proteus-shell-header-version'>Build Version: {proteus.appVersion}</div>
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

              {proteus.hidReports?.processingControllerConfig && (
                <ProteusDataProcessor 
                  controller={proteus.connectedController}
                  hidReports={proteus.hidReports} 
                  latestFirmware={proteus.firmware} 
                  availableModules={proteus.modules}
                />
              )}

              {!navigationDisabled &&
                <>
                  <ProteusHints 
                    showHints={proteus.settings?.displayHints || true} 
                    workspace={activeWorkspace}
                    language={'en'}
                  />
                  <ProteusScene 
                    rotateController={handleControllerRotation}
                    updateSceneLighting={handleSceneLighting}
                    workspace={activeWorkspace}
                    language={'en'}
                  />
                </>
              }

              {activeWorkspace === 'mapping' && (
                <ProteusMapping 
                  gamepadReady={proteus.gamepadReady}
                  mapping={proteus.mapping} 
                  workspace={activeWorkspace}
                  language={'en'}
                />                
              )}

              {activeWorkspace === 'gallery' && (
                <ProteusGallery 
                  gallery={proteus.gallery}
                  galleryLoading={proteus.galleryLoading}
                  takeScreenshot={takeScreenshot}
                  setNavigationDisabled={setNavigationDisabled}
                  controllerConfig={JSON.stringify(proteus.connectedController?.controllerConfiguration?.modules)}
                  workspace={activeWorkspace}
                  language={'en'}
                />
              )}

              {activeWorkspace === 'settings' && (
                <ProteusSettings 
                  controllerLights={proteus.connectedController?.controllerLights}
                  setNavigationDisabled={setNavigationDisabled}
                  workspace={activeWorkspace}
                  language={'en'}
                />
              )}

            </div>
          </div>
        </div>
      </div>
      <div className='Proteus-shell-footer'>
        <div className='Proteus-shell-footer-connected'>
          <div style={{paddingRight: '5px'}}>Controller connected: </div>
          <div style={{paddingRight: '10px', paddingTop: '2px'}}>
            <img 
              className={`${proteus.controllerCommunicating ? 'BlinkMeQuick' : ''}`}
              src={proteus.connectedController?.hidConnected ? ProteusLightGreen : ProteusLightRed} 
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
