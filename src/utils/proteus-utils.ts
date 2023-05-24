import { 
  ControllerConfiguration, 
  IModule, 
  Module
} from '../types/controller-types'
import { ConnectedController } from '../types/proteus-types'
import { getXBoxButtonParamFromString, transformModuleListFromHardware } from '../transformers/controller-transformers'
import { getStoredUserAddress } from './user-utils'
import { intArray2Hex, serialRead, serialWrite, validateResponseArray } from './serial-utils'
import { COM_END_REQUEST, COM_END_RESPONSE, COM_GET_APP_01_VERSION_REQUEST, COM_START_REQUEST, COM_START_RESPONSE } from './constants/serial-constants'

/**
 * Connects a HID device
 * @returns The connected controller object
 */
const connectHidDevice = async (pairedDevice: HIDDevice | undefined):  Promise<ConnectedController> => {
  const connection: ConnectedController = {
    communicating: false,
    hidConnected: false,
    serialConnected: false,
  }
  const deviceFilter = { 
    vendorId: +(process.env.REACT_APP_PROTEUS_CONTROLLER_VENDOR_ID || ''), 
    productId: +(process.env.REACT_APP_PROTEUS_CONTROLLER_PRODUCT_ID || '') 
  }
  const requestParams = { filters: [deviceFilter] }

  try {
    let connectedDevice = undefined
    if(pairedDevice){
      connectedDevice = pairedDevice
    }else{
      const [device] = await navigator.hid.requestDevice(requestParams)
      connectedDevice = device
    }

    if(connectedDevice){
      await connectedDevice.open()
      connection.hidDevice = connectedDevice
      connection.hidConnected = true
    }else{
      throw new Error('UNKOWN_ERROR')
    }

    return connection
  }
  catch(e) {
    return connection
  }
}

/**
 * Checks to see if a device is already paired, and returns the device interface
 * @param deviceArr An array of paired HID devices
 * @returns The device interface if paired
 */
const findPairedHidDevice = (deviceArr: HIDDevice[]): HIDDevice | undefined => {
  return deviceArr.find(d => 
    d.productId === +(process.env.REACT_APP_PROTEUS_CONTROLLER_PRODUCT_ID || '') && 
    d.vendorId === +(process.env.REACT_APP_PROTEUS_CONTROLLER_VENDOR_ID || '')
  )
}

/**
 * 
 */
const connectSerialPort = async () => {
  try {
    const port = await navigator.serial.requestPort()
    await port.open({ baudRate: 9600 })
    
    if(port && port.writable && port.readable){
      const reader = port.readable.getReader()
      const writer = port.writable.getWriter()

      /*
      Start Communication
      */
      console.log('--- writing COM_START_REQUEST')
      await serialWrite(writer, COM_START_REQUEST)

      console.log('--- reading COM_START_REQUEST response')
      const startResponse = await serialRead(reader)
      if(startResponse && !startResponse.error){
        if(!validateResponseArray(intArray2Hex(startResponse.value), COM_START_RESPONSE))
          throw new Error('COM_START_REQUEST: Failed')        
      }else{
        throw new Error(`COM_START_REQUEST: Failed - ${startResponse?.error}`) 
      }

      /*
      Get App 1 Version
      */
      console.log('--- writing COM_GET_APP_01_VERSION_REQUEST')
      await serialWrite(writer, COM_GET_APP_01_VERSION_REQUEST)

      console.log('--- reading COM_GET_APP_01_VERSION_REQUEST response')
      const appVerResponse = await serialRead(reader)
      if(appVerResponse && !appVerResponse.error){
        console.log(intArray2Hex(appVerResponse.value))
        console.log('App 01 Version is: ' + intArray2Hex(appVerResponse.value)[10])
      }else{
        throw new Error(`COM_GET_APP_01_VERSION_REQUEST: Failed - ${startResponse?.error}`) 
      }

      /*
      End Communication
      */
      console.log('--- writing COM_END_REQUEST')
      await serialWrite(writer, COM_END_REQUEST)
      writer.releaseLock()

      console.log('--- reading COM_END_REQUEST response')
      const endResponse = await serialRead(reader)
      if(endResponse && !endResponse.error){
        if(!validateResponseArray(intArray2Hex(endResponse.value), COM_END_RESPONSE))
          throw new Error('COM_END_REQUEST: Failed')
      }else{
        throw new Error(`COM_END_REQUEST: Failed - ${endResponse?.error}`) 
      }
    }

    //await port.close() 
  }
  catch(e) {
    console.log(e)
  }
}

/**
 * Requests the controller configuration from the hardware
 * @param connectionType As string 'bluetooth' or 'usb'
 * @param deviceInterface The correct web device interface
 * @param availableModules An array of available modules from the database/Redux
 * @returns Returns a controller configuration which can be used to render a visual representation
 */
const requestHardwareCofiguration = async (
  deviceInterface: BluetoothDevice | USBDevice | null,
  availableModules: Module[]
): Promise<ControllerConfiguration | null> => {
  try {
    // TODO: Remove this - it just simulates communication with the hardware
    await new Promise(r => setTimeout(r, 2000))
    
    // Using the correct interface, we request a byte array containing the hardware configuration
    const motherMaster = {
      id: 0,
      type: '0x00',
      buttons: [],
      rotation: 0,
      connectsToId: null,
      connectsToFace: null,
    }
    const lAnalog = {
      id: 1,
      type: '0x06',
      buttons: [
        {defaultMapping: 'leftAnalog', mappedTo: 'leftAnalog'},
        {defaultMapping: 'leftAnalogPress', mappedTo: 'leftAnalogPress'},
        {defaultMapping: 'leftAnalogYStandard', mappedTo: 'leftAnalogYStandard'},
      ],
      rotation: 8,
      connectsToId: 0,
      connectsToFace: 'left',
    }
    const rAnalog = {
      id: 2,
      type: '0x05',
      buttons: [
        {defaultMapping: 'rightAnalog', mappedTo: 'rightAnalog'},
        {defaultMapping: 'rightAnalogPress', mappedTo: 'rightAnalogPress'},
        {defaultMapping: 'rightAnalogYStandard', mappedTo: 'rightAnalogYInverted'},
      ],
      rotation: 8,
      connectsToId: 0,
      connectsToFace: 'right',
    }
    const fourButton = {
      id: 3,
      type: '0x08',
      buttons: [
        {defaultMapping: 'y', mappedTo: 'y'},
        {defaultMapping: 'b', mappedTo: 'b'},
        {defaultMapping: 'a', mappedTo: 'a'},
        {defaultMapping: 'x', mappedTo: 'x'},
      ],
      rotation: 0,
      connectsToId: 0,
      connectsToFace: 'front',
    }
    const triggerLeft = {
      id: 4,
      type: '0x12',
      buttons: [
        {defaultMapping: 'leftButton', mappedTo: 'leftButton'},
        {defaultMapping: 'leftTrigger', mappedTo: 'leftTrigger'},
      ],
      rotation: 12,
      connectsToId: 1,
      connectsToFace: 'left',
    }
    const triggerRight = {
      id: 5,
      type: '0x11',
      buttons: [
        {defaultMapping: 'rightButton', mappedTo: 'rightButton'},
        {defaultMapping: 'rightTrigger', mappedTo: 'rightTrigger'},
      ],
      rotation: 4,
      connectsToId: 2,
      connectsToFace: 'right',
    }
    const edge = {
      id: 6,
      type: '0x03',
      buttons: [],
      rotation: 0,
      connectsToId: 1,
      connectsToFace: 'right',
    }
    const dPad = {
      id: 7,
      type: '0x07',
      buttons: [
        {defaultMapping: 'dPadUp', mappedTo: 'dPadUp'},
        {defaultMapping: 'dPadDown', mappedTo: 'dPadDown'},
        {defaultMapping: 'dPadLeft', mappedTo: 'dPadLeft'},
        {defaultMapping: 'dPadRight', mappedTo: 'dPadRight'},
      ],
      rotation: 4,
      connectsToId: 6,
      connectsToFace: 'back',
    }
    const xBox = {
      id: 8,
      type: '0x13',
      buttons: [],
      rotation: 0,
      connectsToId: 0,
      connectsToFace: 'back',
    }
    const twoButton = {
      id: 9,
      type: '0x09',
      buttons: [
        {defaultMapping: 'tB01', mappedTo: 'tB01'},
        {defaultMapping: 'tB02', mappedTo: 'tB02'},
      ],
      rotation: 0,
      connectsToId: 6,
      connectsToFace: 'front',
    }
    const joystick = {
      id: 10,
      type: '0x14',
      buttons: [
        {defaultMapping: 'stick', mappedTo: 'stick'},
      ],
      rotation: 0,
      connectsToId: 2,
      connectsToFace: 'bottom',
    }
    const spacer = {
      id: 11,
      type: '0x02',
      buttons: [],
      rotation: 0,
      connectsToId: 0,
      connectsToFace: 'bottom',
    }
    const charger = {
      id: 12,
      type: '0x04',
      buttons: [],
      rotation: 0,
      connectsToId: 11,
      connectsToFace: 'bottom',
    }
    const oneButton = {
      id: 13,
      type: '0x10',
      buttons: [
        {defaultMapping: 'oB01', mappedTo: 'oB01'},
      ],
      rotation: 0,
      connectsToId: 2,
      connectsToFace: 'left',
    }
    const byteArr = [motherMaster, lAnalog, rAnalog, fourButton, triggerLeft, triggerRight, edge, dPad, xBox, twoButton, joystick, spacer, charger, oneButton]

    // Next we transform the byte array into an object of type ControllerConfiguration
    const config: ControllerConfiguration = {
      controller: {
        userAddress: getStoredUserAddress() || '',
        userProfileName: '',
        controllerAddress: '',
        image: '',
        name: '',
        rating: 0,
      },
      modules: transformModuleListFromHardware(byteArr, availableModules),
    }
    //throw new Error('CONTROLLER_CONFIG_REQUEST_FAILED')
    return config
  } catch(e) {
    return null
  }
}

/**
 * Resolves which mode the mapping component should display
 * @param control A control type
 * @returns A mapping mode
 */
const resolveControllerMappingMode = (control: string): string => {
  let request = ''

  switch(control){
  case'leftAnalog':
  case'rightAnalog':
    request = 'analog'
    break
  case'leftTrigger':
  case'rightTrigger':
    request = 'trigger'
    break
  default:
    request = 'button'
    break
  }

  return request
}

/**
 * Returns the module in the controller configuration which contains a control with the passed mapping
 * @param controllerConfig 
 * @param controlMapping 
 * @returns 
 */
const resolveControllerModuleFromMapping = (controllerConfig: ControllerConfiguration | undefined, controlMapping: string): IModule | null => {
  if(controllerConfig){
    const xBoxButton = getXBoxButtonParamFromString(controlMapping)
    let module = null
    controllerConfig.modules.forEach(m => {
      for(const b of m.module.buttons){
        if(b.mappedTo === xBoxButton){
          module = m
          break
        }
      }
    })
    return module 
  }else{
    return null
  }
}

export {
  connectHidDevice,
  connectSerialPort,
  findPairedHidDevice,
  requestHardwareCofiguration,
  resolveControllerMappingMode,
  resolveControllerModuleFromMapping
}
