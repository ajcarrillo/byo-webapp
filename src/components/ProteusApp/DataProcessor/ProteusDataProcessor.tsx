import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { 
  ConnectedController, 
  IProteusHidReports, 
  ProteusModuleFirmware
} from '../../../types/proteus-types'
import { Module } from '../../../types/controller-types'
import { sendHidOutputReport } from '../../../utils/hid-utils'
import { 
  HID_REPORT_ID, 
  HID_REPORT_SUBTYPE_CONFIG_HEADER, 
  HID_REPORT_SUBTYPE_CONFIG_NEW, 
  HID_REPORT_TYPE_CONFIG 
} from '../../../utils/constants/hid-constants'
import { 
  connectSerialRequest, 
  setControllerCommunicatingRequest, 
  setControllerConfigRequest, 
  setControllerLightingRequest, 
  setHidConfigDataRequest, 
  setHidConfigDataSuccess, 
  setHidConfigHeaderRequest, 
  setHidFirmwareCheckCompleteRequest, 
  setHidNewFirmwareAvailableRequest, 
  setHidProcessingConfigRequest 
} from '../../../store/proteus/proteus-actions'
import DancingGoo from '../../../assets/images/goobender-dance.gif'
import './ProteusDataProcessor.css'
import { transformHardwareCofiguration, transformLightingSettings } from '../../../utils/proteus-utils'

interface IProteusDataProcessorProps {
  controller: ConnectedController | null,
  hidReports: IProteusHidReports | null,
  latestFirmware: ProteusModuleFirmware | null,
  availableModules: Module[] | null,
}

const ProteusDataProcessor: React.FC<IProteusDataProcessorProps> = (props: IProteusDataProcessorProps) => {
  const dispatch = useDispatch()
  const { 
    controller, 
    hidReports, 
    latestFirmware,
    availableModules 
  } = props
  const { 
    firmwareVersionMajor, 
    firmwareVersionMinor, 
    firmwareVersionPatch 
  } = { ...hidReports?.configHeader as any } as any

  const handleClickConnectSerialPort = () => {
    if(controller) dispatch(connectSerialRequest(controller))
  }

  /**
   * Requests the controller config header
   */
  const requestConfigurationHeader = useCallback(() => {
    if(controller && controller.hidConnected && controller.hidDevice){
      dispatch(setControllerCommunicatingRequest(true))
      dispatch(setHidConfigHeaderRequest())
      sendHidOutputReport(
        controller.hidDevice, 
        HID_REPORT_ID, 
        HID_REPORT_TYPE_CONFIG, 
        HID_REPORT_SUBTYPE_CONFIG_NEW, 
        []
      )
    }
  }, [controller, dispatch])

  useEffect(() => {
    if(hidReports && !hidReports.fetchingConfigHeader && !hidReports.configHeader) 
      requestConfigurationHeader()
  }, [hidReports, requestConfigurationHeader])

  /**
   * Requests the controller config data
   */
  const requestConfigurationData = useCallback(() => {
    if(controller && controller.hidConnected && controller.hidDevice){
      dispatch(setControllerCommunicatingRequest(true))
      dispatch(setHidConfigDataRequest())
      sendHidOutputReport(
        controller.hidDevice, 
        HID_REPORT_ID, 
        HID_REPORT_TYPE_CONFIG, 
        HID_REPORT_SUBTYPE_CONFIG_HEADER, 
        []
      )
    }
  }, [controller, dispatch])

  useEffect(() => {
    if(hidReports && hidReports.configHeaderReceived && !hidReports.fetchingConfigData && !hidReports.configData) 
      requestConfigurationData()
  }, [hidReports, requestConfigurationData])

  /**
   * Compares firmware versions, and sets the newFirmwareAvailable flag in the store
   */
  const compareFirmwareVersion = useCallback(() => {
    dispatch(setHidFirmwareCheckCompleteRequest(true))

    const controllerFirmareVersion = 
      `${firmwareVersionMajor}.${firmwareVersionMinor}.${firmwareVersionPatch}`

    if(latestFirmware && controllerFirmareVersion !== latestFirmware.version){
      dispatch(setHidNewFirmwareAvailableRequest(true))
    } else {
      dispatch(setHidNewFirmwareAvailableRequest(false))
    }

  }, [dispatch, firmwareVersionMajor, firmwareVersionMinor, firmwareVersionPatch, latestFirmware])

  useEffect(() => {
    if(hidReports && hidReports.configHeader && !hidReports.firmwareCheckComplete) compareFirmwareVersion()
  }, [compareFirmwareVersion, hidReports])

  /**
   * Confirms all config data pages have been received, and transforms HID data to configuration data
   * Puts config in store
   * Sets the LED setting in the store
   */
  const confirmAllDataReceived = useCallback(() => {
    if(hidReports && hidReports.configData?.length === hidReports?.configHeader?.configPageLength){
      dispatch(setHidConfigDataSuccess())
      if(hidReports.configData && availableModules){
        const configData = transformHardwareCofiguration(hidReports.configData, availableModules)
        dispatch(setControllerConfigRequest(configData))
      }
      if(hidReports.configHeader){
        const lightingData = transformLightingSettings(hidReports.configHeader)
        dispatch(setControllerLightingRequest(lightingData))
      }

      // TODO: Remove when firmware updating is complete
      //if(!hidReports.newFirmwareAvailable)
      dispatch(setHidProcessingConfigRequest(false))
    }
  }, [availableModules, dispatch, hidReports])

  useEffect(() => {
    if(hidReports && hidReports.configHeader && hidReports.fetchingConfigData) confirmAllDataReceived()
  }, [confirmAllDataReceived, hidReports])

  return (
    <div className='ProteusDataProcessor-container'>
      <div className='ProteusDataProcessor-inner'>
        <img src={DancingGoo} alt='Dancing Goobender' />

        {hidReports?.newFirmwareAvailable && (
          <div>
            <div>New Firmware Required</div>
            <button 
              className='Button-standard' 
              onClick={() => handleClickConnectSerialPort()}
            >
              Click to connect serial
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProteusDataProcessor