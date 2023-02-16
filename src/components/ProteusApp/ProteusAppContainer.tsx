import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { 
  connectControllerRequest, 
  getApplicationSettingsRequest,
  getModulesRequest 
} from '../../store/proteus/proteus-actions'
import { IStoreState } from '../../types/store-types'
import ProteusShell from './ProteusShell'
import Spinner from '../Spinner'
import SplashScreen from '../../assets/images/proteus-splash-screen.png'
import './ProteusApp.css'

interface IProteusAppProps {
  device: any,
}

const ProteusAppContainer: React.FC<IProteusAppProps> = (props: IProteusAppProps) => {
  const dispatch = useDispatch()
  const { 
    proteus
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const connectController = useCallback((connectType: string) => {
    dispatch(connectControllerRequest(connectType))
  }, [dispatch])

  const loadModules = useCallback(() => {
    dispatch(getModulesRequest())
  }, [dispatch])

  const loadSettings = useCallback(() => {
    dispatch(getApplicationSettingsRequest())
  }, [dispatch])

  useEffect(() => {
    if(!proteus.modules) loadModules()
  }, [proteus.modules, loadModules])

  useEffect(() => {
    if(!proteus.settings) loadSettings()
  }, [proteus.settings, loadSettings])

  const handleClickConnectDevice = (connectType: string) => {
    connectController(connectType)
  }

  return (
    <div className={'App-container'}>
      <div className='Proteus-container'>
        {proteus.modulesLoading || proteus.settingsLoading ? (
          <Spinner />
        ) : (
          <>
            {!proteus.connectedController?.connected ? (
              <div className="Proteus-splashscreen-container">
                <img src={SplashScreen} alt="Proteus Splash Screen" />
                <div className="Proteus-splashscreen-version">Version: {proteus.version}</div>
                <div className="Proteus-splashscreen-buttons">
                  <button className='Button-proteus' onClick={() => handleClickConnectDevice('bluetooth')}>
                    <span className="Button-proteus-icon">
                      <i className={'fa-brands fa-bluetooth'}></i>
                      <span>Connect your controller using Bluetooth</span>
                    </span>
                  </button>
                  <button className='Button-proteus' onClick={() => handleClickConnectDevice('usb')}>
                    <span className="Button-proteus-icon">
                      <i className={'fa-brands fa-usb'}></i>
                      <span>Connect your controller using USB</span>
                    </span>
                  </button>
                </div>

                {proteus.controllerConnectionError && (
                  <div className={'Proteus-connect-error-panel'} style={{marginTop: '2rem'}}>
                    <i className={'fa-solid fa-face-frown'} style={{fontSize: '3rem', marginRight: '.6rem'}}></i>
                    <div style={{width: '100%'}}>
                      <div style={{marginBottom: '.3rem', fontSize: '1.2rem', }}>Whoops</div>
                      <div style={{fontSize: '1rem', color: 'rgb(160,160,160)'}}>{proteus.controllerConnectionError}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ProteusShell 
                proteus={proteus} 
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProteusAppContainer