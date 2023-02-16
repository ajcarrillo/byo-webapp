import { APIError, APIResponse } from '../../types/api-types'
import { ControllerConfiguration, Module } from '../../types/controller-types'
import { ConnectedController } from '../../types/proteus-types'
import {
  PROTEUS_GET_MODULES_REQUEST,
  PROTEUS_GET_MODULES_SUCCESS,
  PROTEUS_GET_MODULES_FAILURE,
  PROTEUS_CONNECT_CONTROLLER_REQUEST,
  PROTEUS_CONNECT_CONTROLLER_SUCCESS,
  PROTEUS_CONNECT_CONTROLLER_FAILURE,
  PROTEUS_GET_CONTROLLER_CONFIG_REQUEST,
  PROTEUS_GET_CONTROLLER_CONFIG_SUCCESS,
  PROTEUS_GET_CONTROLLER_CONFIG_FAILURE,
  PROTEUS_GET_APP_SETTINGS_REQUEST,
  PROTEUS_GET_APP_SETTINGS_SUCCESS,
  PROTEUS_GET_APP_SETTINGS_FAILURE
} from './proteus-constants'

export const getControllerConfigRequest = (
  connectType: string,
  deviceInterface: BluetoothDevice | USBDevice | null,
  availableModules: Module[]
) => ({
  type: PROTEUS_GET_CONTROLLER_CONFIG_REQUEST,
  connectType,
  deviceInterface,
  availableModules
})

export const getControllerConfigSuccess = (controller: ControllerConfiguration) => ({
  type: PROTEUS_GET_CONTROLLER_CONFIG_SUCCESS,
  payload: controller,
})

export const getControllerConfigFailure = (error: string) => ({
  type: PROTEUS_GET_CONTROLLER_CONFIG_FAILURE,
  error
})

export const connectControllerRequest = (connectType: string) => ({
  type: PROTEUS_CONNECT_CONTROLLER_REQUEST,
  connectType,
})

export const connectControllerSuccess = (controller: ConnectedController) => ({
  type: PROTEUS_CONNECT_CONTROLLER_SUCCESS,
  payload: controller,
})

export const connectControllerFailure = (error: string) => ({
  type: PROTEUS_CONNECT_CONTROLLER_FAILURE,
  error
})

export const getModulesRequest = () => ({
  type: PROTEUS_GET_MODULES_REQUEST,
})

export const getModulesSuccess = (response: APIResponse) => ({
  type: PROTEUS_GET_MODULES_SUCCESS,
  payload: response,
})

export const getModulesFailure = (error: APIError) => ({
  type: PROTEUS_GET_MODULES_FAILURE,
  payload: error,
})

export const getApplicationSettingsRequest = () => ({
  type: PROTEUS_GET_APP_SETTINGS_REQUEST,
})

export const getApplicationSettingsSuccess = (response: APIResponse) => ({
  type: PROTEUS_GET_APP_SETTINGS_SUCCESS,
  payload: response,
})

export const getApplicationSettingsFailure = (error: APIError) => ({
  type: PROTEUS_GET_APP_SETTINGS_FAILURE,
  payload: error,
})
