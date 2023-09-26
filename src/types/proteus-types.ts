import { APIError } from './api-types'
import { 
  Controller, 
  ControllerConfiguration, 
  ControllerLights, 
  IModule, 
  Module, 
  ModuleType 
} from './controller-types'

export type ConnectedController = {
  hidConnected: boolean,
  serialConnected: boolean,
  hidDevice?: HIDDevice,
  serialPort?: SerialPort,
  controllerConfiguration?: ControllerConfiguration,
  controllerLights?: ControllerLights, 
}

export type ProteusUserSettings = {
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

export type ProteusModuleFirmware = {
  module: 'combined' | 'mother' | 'charger',
  version: string,
  fileAddress: string,
}

export type ProteusHidConfigHeader = {
  firmwareVersionMajor: string,
  firmwareVersionMinor: string,
  firmwareVersionPatch: string,
  ledRValue: string,
  ledGValue: string,
  ledBValue: string,
  ledBrightness: string,
  configPageLength: number,
}

export type ProteusHidConfigDataPage = {
  pageId: number,
  modules: ProteusHidConfigDataPageModule[],
}

export type ProteusHidConfigDataPageModule = {
  moduleId: number,
  moduleType: number,
  moduleRotation: number,
  connectsToModuleId: number,
  connectsToModuleFaceId: number,
  buttonMapping01: number,
  buttonMapping02: number,
  buttonMapping03: number,
  buttonMapping04: number,
  buttonMapping05: number,
  buttonMapping06: number,
}

export interface IProteusHidReports {
  processingControllerConfig: boolean,
  fetchingConfigHeader: boolean,
  configHeaderReceived: boolean,
  fetchingConfigData: boolean,
  configDataReceived: boolean,
  firmwareCheckComplete: boolean,
  newFirmwareAvailable: boolean,
  configHeader: ProteusHidConfigHeader | null,
  configData: ProteusHidConfigDataPage[] | null,
}

export interface IProteusState {
  modulesLoading: boolean,
  galleryLoading: boolean,
  settingsLoading: boolean,
  unityReady: boolean,
  gamepadReady: boolean,
  apiError: APIError | null;
  appVersion: string | undefined,
  firmware: ProteusModuleFirmware | null,
  modules: Module[] | null,
  mapping: ProteusMappingConfig | null,
  gallery: {personal: Controller[], community: Controller[]} | null,
  settings: ProteusUserSettings | null,
  controllerConnectionError: string | null,
  controllerCommunicating: boolean,
  connectedController: ConnectedController | null,
  hidReports: IProteusHidReports | null,
}
