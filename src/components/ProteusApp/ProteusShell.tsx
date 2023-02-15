import React, { useState } from 'react'

import { IProteusState } from '../../types/proteus-types'
import UnityContainer from './Unity/UnityContainer'
import ProteusHints from './Hints/ProteusHints'
import ProteusLogo from '../../assets/images/proteus-header-logo.png'
import ProteusLightGreen from '../../assets/images/proteus-footer-light-green.png'
import ProteusLightRed from '../../assets/images/proteus-footer-light-red.png'

interface IProteusShellProps {
  proteus: IProteusState
}

const ProteusShell: React.FC<IProteusShellProps> = (props: IProteusShellProps) => {
  const { proteus } = props

  const [activeWorkspace, setActiveWorkspace] = useState('home')

  const handleClickWorkspace = (worksapce: string) => {
    setActiveWorkspace(worksapce)
  }

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
            <div className='Proteus-shell-workspace-unity'>
              <UnityContainer 
                loaderUrl={process.env.REACT_APP_PROTEUS_LOADER_URL || ''} 
                dataUrl={process.env.REACT_APP_PROTEUS_DATA_URL || ''} 
                frameworkUrl={process.env.REACT_APP_PROTEUS_FRAMEWORK_URL || ''} 
                codeUrl={process.env.REACT_APP_PROTEUS_CODE_URL || ''} 
              />
              <ProteusHints 
                showHints={proteus.settings?.displayHints || true} 
                workspace={activeWorkspace}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='Proteus-shell-footer'>
        <div className='Proteus-shell-footer-connected'>
          <div style={{paddingRight: '5px'}}>Controller connected: </div>
          <div style={{paddingRight: '10px', paddingTop: '2px'}}>
            <img src={proteus.connectedController?.connected ? ProteusLightGreen : ProteusLightRed} alt="Connected Light" style={{width: '14px'}} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProteusShell