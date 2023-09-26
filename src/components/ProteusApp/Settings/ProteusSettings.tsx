import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RgbColorPicker } from 'react-colorful'

import { 
  HID_REPORT_ID, 
  HID_REPORT_SUBTYPE_LED_SETTINGS, 
  HID_REPORT_TYPE_LED 
} from '../../../utils/constants/hid-constants'
import { serialTestWrite } from '../../../utils/proteus-utils'
import { sendHidOutputReport } from '../../../utils/hid-utils'
import { connectSerialRequest, setControllerLightingRequest } from '../../../store/proteus/proteus-actions'
import { ConnectedController } from '../../../types/proteus-types'
import { ControllerLights } from '../../../types/controller-types'
import { IStoreState } from '../../../types/store-types'
import { RGBColour } from '../../../types/global-types'
import './ProteusSettings.css'

interface IProteusGalleryProps {
  workspace: string,
  setNavigationDisabled: (disabled: boolean) => void,
  language: string,
  controllerLights: ControllerLights | undefined
}

const ProteusSettings: React.FC<IProteusGalleryProps> = (props: IProteusGalleryProps) => {
  const dispatch = useDispatch()
  const { 
    proteus
  } = useSelector<IStoreState, IStoreState>((store) => store)
  const { controllerLights } = props
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [selectedLightColour, setSelectedLightColour] = useState<RGBColour | undefined>(undefined)

  /**
   * Handles the light colour change
   * @param value 
   */
  const handleColourChange = (value: RGBColour) => {
    setSelectedLightColour(value)
  }

  const setInitialLedValues = useCallback(() => {
    const col: RGBColour = {
      r: parseInt(controllerLights?.red || '255'),
      g: parseInt(controllerLights?.green || '255'),
      b: parseInt(controllerLights?.blue || '255')
    }
    setSelectedLightColour(col)
  }, [controllerLights?.blue, controllerLights?.green, controllerLights?.red])

  useEffect(() => {
    if(!selectedLightColour) setInitialLedValues()
  }, [selectedLightColour, setInitialLedValues])

  const handleClickUpdateControllerLIghts = () => {
    if(selectedLightColour){
      const hidValues: number[] = [selectedLightColour.r, selectedLightColour.g, selectedLightColour.b, 255]
      const storeValues: ControllerLights = {
        red: selectedLightColour.r.toString(), 
        green: selectedLightColour.g.toString(), 
        blue: selectedLightColour.b.toString(), 
        brightness: '255'
      }
      dispatch(setControllerLightingRequest(storeValues))
      sendHidOutputReport(
        proteus.connectedController?.hidDevice, 
        HID_REPORT_ID, 
        HID_REPORT_TYPE_LED, 
        HID_REPORT_SUBTYPE_LED_SETTINGS, 
        hidValues
      )      
    }
  }

  // const connectSerialPort = useCallback((connectedController: ConnectedController) => {
  //   dispatch(connectSerialRequest(connectedController))
  // }, [dispatch])

  // const handleClickConnectSerial = () => {
  //   if(proteus.connectedController) connectSerialPort(proteus.connectedController)
  // }

  // const handleClickWriteSerial = () => {
  //   if(proteus.connectedController?.serialPort) serialTestWrite(proteus.connectedController?.serialPort)
  // }

  /**
   * Shows the settings
   */
  useEffect(() => {
    setSettingsVisible(props.workspace === 'settings')

    return () => {
      if(props.workspace !== 'settings') {
        //
      }
    }
  }, [props.workspace])

  return (
    <>
      {props.workspace === 'settings' ? (
        <div className={`Proteus-settings-container ${settingsVisible ? 'open' : ''}`}>
          <div className='Proteus-settings-header'>Settings</div>
          {/* <button 
            className='Button-standard' 
            onClick={() => handleClickConnectSerial()}
          >
            Connect Serial
          </button>
          <button 
            className='Button-standard' 
            onClick={() => handleClickWriteSerial()}
          >
            Write to Serial
          </button> */}

          <div className='Proteus-settings-inner-container'>
            <div className='Proteus-settings-text'>Use the colour picker to change your controller&apos;s lights.</div>
            <div className='Proteus-settings-picker-container'>
              <RgbColorPicker color={selectedLightColour} onChange={handleColourChange} />
            </div>
            <button 
              className='Button-standard' 
              style={{width: '100%'}}
              onClick={() => handleClickUpdateControllerLIghts()}
            >
              Update Lights
            </button>            
          </div>

        </div>
      ) : (
        null
      )}
    </>
  )
}

export default ProteusSettings