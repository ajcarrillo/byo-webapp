import { APIError } from './api-types'
import { Controller, ControllerConfiguration, IModule, Module } from './controller-types'

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

export type ProteusMappingConfig = {
  mode: 'button' | 'analog' | 'trigger',
  control: string,
  module: IModule | null,
}

export interface IProteusState {
  modulesLoading: boolean,
  galleryLoading: boolean,
  settingsLoading: boolean,
  unityReady: boolean,
  gamepadReady: boolean,
  apiError: APIError | null;
  version: string | undefined,
  firmwareVersion: string | undefined,
  modules: Module[] | null,
  mapping: ProteusMappingConfig | null,
  gallery: {personal: Controller[], community: Controller[]} | null,
  settings: ProteusSettings | null,
  controllerConnectionError: string | null,
  connectedController: ConnectedController | null,
}
