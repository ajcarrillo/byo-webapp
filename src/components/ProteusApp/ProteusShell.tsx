import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { IProteusState } from '../../types/proteus-types'
import UnityContainer from './Unity/UnityContainer'
import ProteusHints from './Hints/ProteusHints'
import ProteusMapping from './Mapping/ProteusMapping'
import ProteusGallery from './Gallery/ProteusGallery'
import ProteusLogo from '../../assets/images/proteus-header-logo.png'
import ProteusLightGreen from '../../assets/images/proteus-footer-light-green.png'
import ProteusLightRed from '../../assets/images/proteus-footer-light-red.png'
import { getControllerConfigRequest } from '../../store/proteus/proteus-actions'

interface IProteusShellProps {
  proteus: IProteusState
}

const ProteusShell: React.FC<IProteusShellProps> = (props: IProteusShellProps) => {
  const dispatch = useDispatch()
  const { proteus } = props
  const [activeWorkspace, setActiveWorkspace] = useState('home')

  const handleClickWorkspace = (worksapce: string) => {
    setActiveWorkspace(worksapce)
  }

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

  useEffect(() => {
    if(!proteus.connectedController?.controllerConfiguration) requestControllerConfig()
  }, [proteus.connectedController?.controllerConfiguration, requestControllerConfig])
  console.log(proteus.connectedController)
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
                  className={activeWorkspace === 'home' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'}
                  onClick={() => handleClickWorkspace('home')}
                >
                  <i className='fa-solid fa-mask'></i>
                </button>
                <button 
                  className={activeWorkspace === 'mapping' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('mapping')}
                >
                  <i className='fa-solid fa-gamepad'></i>
                </button>
                <button 
                  className={activeWorkspace === 'gallery' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('gallery')}
                >
                  <i className='fa-solid fa-image'></i>
                </button>
                <button 
                  className={activeWorkspace === 'settings' ? 'Proteus-toolbar-button__selected' : 'Proteus-toolbar-button'} 
                  onClick={() => handleClickWorkspace('settings')}
                >
                  <i className='fa-solid fa-gear'></i>
                </button>                  
              </div>
            </div>
            <div className='Proteus-shell-workspace-unity'>
              <UnityContainer 
                loaderUrl={process.env.REACT_APP_PROTEUS_LOADER_URL || ''} 
                dataUrl={process.env.REACT_APP_PROTEUS_DATA_URL || ''} 
                frameworkUrl={process.env.REACT_APP_PROTEUS_FRAMEWORK_URL || ''} 
                codeUrl={process.env.REACT_APP_PROTEUS_CODE_URL || ''} 
                settings={proteus.settings || null}
              />
              <ProteusHints 
                showHints={proteus.settings?.displayHints || true} 
                workspace={activeWorkspace}
                language={'en'}
              />
              <ProteusMapping 
                mappingType={'button'} 
                workspace={activeWorkspace}
                language={'en'}
              />
              <ProteusGallery 
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
