import { 
  ControllerConfiguration, 
  Module
} from '../types/controller-types'
import { ConnectedController } from '../types/proteus-types'
import { transformModuleListFromHardware } from '../transformers/controller-transformers'
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
    const mother = {
      id: 0,
      type: '0x00',
      buttons: [],
      rotation: 0,
      connectsToId: null,
      connectsToFace: null,
    }
    const lAnalog = {
      id: 1,
      type: '0x01',
      buttons: [
        {default: 'leftAnalog', mapping: 'leftAnalog'},
        {default: 'leftAnalogPress', mapping: 'leftAnalogPress'},
        {default: 'analogYStandard', mapping: 'analogYStandard'},
      ],
      rotation: 0,
      connectsToId: 0,
      connectsToFace: 'left',
    }
    const rAnalog = {
      id: 1,
      type: '0x01',
      buttons: [
        {default: 'rightAnalog', mapping: 'rightAnalog'},
        {default: 'rightAnalogPress', mapping: 'rightAnalogPress'},
        {default: 'analogYStandard', mapping: 'analogYInverted'},
      ],
      rotation: 0,
      connectsToId: 0,
      connectsToFace: 'right',
    }
    const byteArr = [mother, lAnalog, rAnalog]

    // Next we transform the byte array into an object of type ControllerConfiguration
    const config: ControllerConfiguration = {
      controller: {
        userAddress: getStoredUserAddress() || '',
        controllerAddress: '',
        imageAddress: '',
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

export {
  connectController,
  requestHardwareCofiguration
}