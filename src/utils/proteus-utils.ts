import { 
  ControllerConfiguration, 
  IModule, 
  Module
} from '../types/controller-types'
import { ConnectedController } from '../types/proteus-types'
import { getXBoxButtonParamFromString, transformModuleListFromHardware } from '../transformers/controller-transformers'
import { getStoredUserAddress } from './user-utils'

/**
 * Connects the controller by Bluetooth or USB
 * @param connectionType The type of connection - bluetooth or usb
 * @returns A connected controller object
 */
const connectController = async (connectionType: 'usb' | 'bluetooth'):  Promise<ConnectedController> => {
  const connection: ConnectedController = {
    communicating: false,
    connected: false,
    connectionType,
  }

  try {
    if(connectionType === 'usb'){
      const usbDevice: USBDevice = await window.navigator.usb.requestDevice({ 
        filters: [{ 
          vendorId: +(process.env.REACT_APP_PROTEUS_CONTROLLER_USB_VENDOR_ID || '')  
        }],
      })

      if(usbDevice){
        await usbDevice.open()
        connection.usbDevice = usbDevice
        connection.connected = true
      }else{
        throw new Error('UNKOWN_ERROR')
      }
    }else{
      const bluetoothDevice: BluetoothDevice = await window.navigator.bluetooth.requestDevice({
        // TODO: Use filter here
        acceptAllDevices: true,
        // filters: [{
        //   services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        // }],
        optionalServices: [process.env.REACT_APP_PROTEUS_CONTROLLER_BLUETOOTH_PRIMARY_SERVICE || ''],
      })

      if(bluetoothDevice){
        connection.bluetoothDevice = bluetoothDevice
        connection.connected = true
      }else{
        throw new Error('UNKOWN_ERROR')
      }
    }
    return connection
  } catch(e) {
    return connection
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
  connectionType: 'usb' | 'bluetooth', 
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
      rotation: 180,
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
      rotation: 180,
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
      connectsToId: 1,
      connectsToFace: 'front',
    }
    const triggerLeft = {
      id: 4,
      type: '0x12',
      buttons: [
        {defaultMapping: 'leftButton', mappedTo: 'leftButton'},
        {defaultMapping: 'leftTrigger', mappedTo: 'leftTrigger'},
      ],
      rotation: 0,
      connectsToId: 1,
      connectsToFace: 'back',
    }
    const triggerRight = {
      id: 5,
      type: '0x11',
      buttons: [
        {defaultMapping: 'rightButton', mappedTo: 'rightButton'},
        {defaultMapping: 'rightTrigger', mappedTo: 'rightTrigger'},
      ],
      rotation: 0,
      connectsToId: 2,
      connectsToFace: 'back',
    }
    const edge = {
      id: 6,
      type: '0x03',
      buttons: [],
      rotation: 2,
      connectsToId: 2,
      connectsToFace: 'right',
    }
    const dPad = {
      id: 7,
      type: '0x07',
      buttons: [],
      rotation: 0,
      connectsToId: 6,
      connectsToFace: 'top',
    }
    const byteArr = [motherMaster, lAnalog, rAnalog, fourButton, triggerLeft, triggerRight, edge, dPad]

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
  connectController,
  requestHardwareCofiguration,
  resolveControllerMappingMode,
  resolveControllerModuleFromMapping
}
