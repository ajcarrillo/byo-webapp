import React, { useCallback, useEffect } from 'react'

import { ReactUnityEventParameter } from '../../../types/unity-types'
import { ConnectedController } from '../../../types/proteus-types'
import { resolveInputReport } from '../../../utils/hid-utils'

interface IProteusGalleryProps {
  broadcastUnityEvent: (evt: string, jsonData: string) => void,
  broadcastControllerEvent: (eventType: string, payload: any) => void,
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
   * Handles disconnect event from a HID controller
   * @param payload 
   */
  const handleHIDControllerDisconnect = (evt: HIDConnectionEvent) => {
    console.log(evt)
  }

  /**
   * Handles controller HID input reports
   * @param evt The HID input report event
   * @returns 
   */
  const handleHIDControllerInputReport = useCallback((evt: HIDInputReportEvent) => {
    const { data, device, reportId } = evt

    if(device.productId !== +(process.env.REACT_APP_PROTEUS_CONTROLLER_PRODUCT_ID || '') && reportId !== 0) 
      return

    broadcastControllerEvent('inputReport', resolveInputReport(data))
  }, [broadcastControllerEvent])

  /**
   * Adds event listeners for the Unity app and the Controller
   */
  const addEventHandlers = useCallback(() =>{
    // Unity
    unityAddEventListener('UnityEvent', handleUnityEvent)
    // Controller
    window.navigator.hid.addEventListener('disconnect', handleHIDControllerDisconnect)
    connectedController?.hidDevice?.addEventListener('inputreport', handleHIDControllerInputReport)
  }, [connectedController?.hidDevice, handleHIDControllerInputReport, handleUnityEvent, unityAddEventListener])

  /**
   * Removes event listeners for the Unity app and the Controller
   */
  const removeEventHandlers = useCallback(() => {
    // Unity
    unityRemoveEventListener('UnityEvent', handleUnityEvent)
    // Controller
    window.navigator.hid.removeEventListener('disconnect', handleHIDControllerDisconnect)
    connectedController?.hidDevice?.removeEventListener('inputreport', handleHIDControllerInputReport)
  }, [connectedController?.hidDevice, handleHIDControllerInputReport, handleUnityEvent, unityRemoveEventListener])

  useEffect(() => {
    addEventHandlers()
    return () => {
      removeEventHandlers()
    }
  }, [addEventHandlers, removeEventHandlers])

  return (null)
}

export default ProteusGallery