import { ConnectedController } from '../types/controller-types'

/**
 * Connects the controller by Bluetooth or USB
 * @param connectionType The type of connection - bluetooth or usb
 * @returns A connected controller object
 */
const connectController = async (connectionType: string):  Promise<ConnectedController> => {
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

export {
  connectController
}