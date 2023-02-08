import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getModulesRequest } from '../../store/proteus/proteus-actions'
import { IStoreState } from '../../types/store-types'
import { UnityContainer } from './WebGL/UnityContainer'
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

  const [hardwareConnected, setHardwareConnected] = useState(false)
  const [hardwareConnectionType, setHardwareConnectionType] = useState<string>('none')

  const loadModules = useCallback(() => {
    dispatch(getModulesRequest())
  }, [dispatch])

  useEffect(() => {
    if(!proteus.modules) loadModules()
  }, [proteus.modules, loadModules])

  const handleClickConnectDevice = (connectType: string) => {
    setHardwareConnectionType(connectType)
    setHardwareConnected(true)
  }

  return (
    <div className={'App-container'}>
      <div className='Proteus-container'>
        {proteus.modulesLoading ? (
          <Spinner />
        ) : (
          <>
            {!hardwareConnected ? (
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
              </div>
            ) : (
              <UnityContainer 
                loaderUrl={process.env.REACT_APP_PROTEUS_LOADER_URL || ''} 
                dataUrl={process.env.REACT_APP_PROTEUS_DATA_URL || ''} 
                frameworkUrl={process.env.REACT_APP_PROTEUS_FRAMEWORK_URL || ''} 
                codeUrl={process.env.REACT_APP_PROTEUS_CODE_URL || ''} 
              />                
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProteusAppContainer