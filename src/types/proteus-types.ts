import { APIError } from './api-types'
import { Controller, ControllerConfiguration, Module } from './controller-types'

export type ConnectedController = {
  communicating: boolean,
  connected: boolean,
  connectionType: 'usb' | 'bluetooth',
  usbDevice?: USBDevice,
  bluetoothDevice?: BluetoothDevice,
  controllerConfiguration?: ControllerConfiguration,
}

export type ProteusSettings = {
  firmwareVersion: string | undefined,
  displayHints: boolean,
  antialiasing: boolean,
  sixteenBit: boolean,
  gpuHighPerformance: boolean,
  multipass: boolean,
  depthTesting: boolean,
}

export interface IProteusState {
  modulesLoading: boolean,
  galleryLoading: boolean,
  settingsLoading: boolean,
  unityReady: boolean,
  apiError: APIError | null;
  version: string | undefined,
  firmwareVersion: string | undefined,
  modules: Module[] | null,
  gallery: Controller[] | null,
  settings: ProteusSettings | null,
  controllerConnectionError: string | null,
  connectedController: ConnectedController | null,
}
