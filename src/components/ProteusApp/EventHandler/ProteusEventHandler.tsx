import React, { useCallback, useEffect } from 'react'

import { ReactUnityEventParameter } from '../../../types/unity-types'
import { ConnectedController } from '../../../types/proteus-types'

interface IProteusGalleryProps {
  broadcastUnityEvent: (evt: string, jsonData: string) => void,
  broadcastControllerEvent: (evt: string, payload: string) => void,
  connectedController: ConnectedController | null,
  unityAddEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => void) => void,
  unityRemoveEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => void) => void,
}

const ProteusGallery: React.FC<IProteusGalleryProps> = (props: IProteusGalleryProps) => {
  const {
    broadcastControllerEvent, 
    broadcastUnityEvent, 
    connectedController, 
    unityAddEventListener, 
    unityRemoveEventListener
  } = props

  /**
   * Handles events from Unity
   * @param parameters 
   */
  const handleUnityEvent = useCallback((...parameters: ReactUnityEventParameter[]) => {
    broadcastUnityEvent(parameters[0] as string, parameters[1] as string)
  }, [broadcastUnityEvent])

  /**
 * Handles event from a USB connected controller when there is a configuration change
 * @param payload 
 */
  const handleUSBControllerConfigUpdate = (payload: any) => {
    //
  }

  /**
   * Handles event from a USB connected controller when it is disconnected
   * @param payload 
   */
  const handleUSBControllerDisconnect = (evt: USBConnectionEvent) => {
    console.log(evt)
  }

  /**
   * Handles event from a Bluetooth connected controller when there is a configuration change
   * @param payload 
   */
  const handleBluetoothControllerConfigUpdate = (payload: any) => {
    //
  }

  /**
   * Handles event from a Bluetooth connected controller when it is disconnected
   * @param payload 
   */
  const handleBluetoothControllerDisconnect = (evt: Event) => {
    console.log(evt)
  }

  /**
   * Adds event listeners for the Unity app and the Controller
   */
  const addEventHandlers = useCallback(() =>{
    // Unity
    unityAddEventListener('UnityEvent', handleUnityEvent)
    // Controller
    if(connectedController?.connectionType === 'usb'){
      window.navigator.usb.addEventListener('NEW_CUBE_MATRIX_AVAILABLE', handleUSBControllerConfigUpdate)
      window.navigator.usb.addEventListener('disconnect', handleUSBControllerDisconnect)
    } else {
      connectedController?.bluetoothDevice?.addEventListener('NEW_CUBE_MATRIX_AVAILABLE', handleBluetoothControllerConfigUpdate)
      connectedController?.bluetoothDevice?.addEventListener('gattserverdisconnected', handleBluetoothControllerDisconnect)
    }
  }, [connectedController?.bluetoothDevice, connectedController?.connectionType, handleUnityEvent, unityAddEventListener])

  /**
   * Removes event listeners for the Unity app and the Controller
   */
  const removeEventHandlers = useCallback(() => {
    // Unity
    unityRemoveEventListener('UnityEvent', handleUnityEvent)
    // Controller
    if(connectedController?.connectionType === 'usb'){
      window.navigator.usb.removeEventListener('NEW_CUBE_MATRIX_AVAILABLE', handleUSBControllerConfigUpdate)
      window.navigator.usb.removeEventListener('disconnect', handleUSBControllerDisconnect)
    } else {
      connectedController?.bluetoothDevice?.removeEventListener('NEW_CUBE_MATRIX_AVAILABLE', handleBluetoothControllerConfigUpdate)
      connectedController?.bluetoothDevice?.removeEventListener('gattserverdisconnected', handleBluetoothControllerDisconnect)
    }
  }, [connectedController?.bluetoothDevice, connectedController?.connectionType, handleUnityEvent, unityRemoveEventListener])

  useEffect(() => {
    addEventHandlers()
    return () => {
      removeEventHandlers()
    }
  }, [addEventHandlers, removeEventHandlers])

  return (null)
}

export default ProteusGallery