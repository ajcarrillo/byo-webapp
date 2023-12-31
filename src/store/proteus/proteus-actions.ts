import { APIError, APIResponse } from '../../types/api-types'
import { Controller, ControllerConfiguration, Module } from '../../types/controller-types'
import { ConnectedController, ProteusMappingConfig } from '../../types/proteus-types'
import {
  PROTEUS_GET_MODULES_REQUEST,
  PROTEUS_GET_MODULES_SUCCESS,
  PROTEUS_GET_MODULES_FAILURE,
  PROTEUS_GET_GALLERY_ITEMS_REQUEST,
  PROTEUS_GET_GALLERY_ITEMS_SUCCESS,
  PROTEUS_GET_GALLERY_ITEMS_FAILURE,
  PROTEUS_CONNECT_CONTROLLER_REQUEST,
  PROTEUS_CONNECT_CONTROLLER_SUCCESS,
  PROTEUS_CONNECT_CONTROLLER_FAILURE,
  PROTEUS_GET_CONTROLLER_CONFIG_REQUEST,
  PROTEUS_GET_CONTROLLER_CONFIG_SUCCESS,
  PROTEUS_GET_CONTROLLER_CONFIG_FAILURE,
  PROTEUS_GET_APP_SETTINGS_REQUEST,
  PROTEUS_GET_APP_SETTINGS_SUCCESS,
  PROTEUS_GET_APP_SETTINGS_FAILURE,
  PROTEUS_SET_UNITY_READY_REQUEST,
  PROTEUS_SET_UNITY_READY_SUCCESS,
  PROTEUS_SET_GAMEPAD_READY_REQUEST,
  PROTEUS_SET_GAMEPAD_READY_SUCCESS,
  PROTEUS_SET_MAPPING_MODE_REQUEST,
  PROTEUS_SET_MAPPING_MODE_SUCCESS,
  PROTEUS_APPEND_GALLERY_ITEM_REQUEST,
  PROTEUS_APPEND_GALLERY_ITEM_SUCCESS
} from './proteus-constants'

export const setMappingModeRequest = (mapping: ProteusMappingConfig) => ({
  type: PROTEUS_SET_MAPPING_MODE_REQUEST,
  mapping,
})

export const setMappingModeSuccess = (mapping: ProteusMappingConfig) => ({
  type: PROTEUS_SET_MAPPING_MODE_SUCCESS,
  payload: mapping,
})

export const setUnityReadyRequest = (ready: boolean) => ({
  type: PROTEUS_SET_UNITY_READY_REQUEST,
  ready,
})

export const setUnityReadySuccess = (ready: boolean) => ({
  type: PROTEUS_SET_UNITY_READY_SUCCESS,
  payload: ready,
})

export const setGamepadReadyRequest = (ready: boolean) => ({
  type: PROTEUS_SET_GAMEPAD_READY_REQUEST,
  ready,
})

export const setGamepadReadySuccess = (ready: boolean) => ({
  type: PROTEUS_SET_GAMEPAD_READY_SUCCESS,
  payload: ready,
})

export const getControllerConfigRequest = (
  deviceInterface: HIDDevice | null,
  availableModules: Module[]
) => ({
  type: PROTEUS_GET_CONTROLLER_CONFIG_REQUEST,
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

export const connectControllerRequest = (device: HIDDevice | undefined) => ({
  type: PROTEUS_CONNECT_CONTROLLER_REQUEST,
  device,
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

export const getGalleryItemsRequest = () => ({
  type: PROTEUS_GET_GALLERY_ITEMS_REQUEST,
})

export const getGalleryItemsSuccess = (response: APIResponse) => ({
  type: PROTEUS_GET_GALLERY_ITEMS_SUCCESS,
  payload: response,
})

export const getGalleryItemsFailure = (error: APIError) => ({
  type: PROTEUS_GET_GALLERY_ITEMS_FAILURE,
  payload: error,
})

export const appendGalleryItemRequest = (controller: Controller) => ({
  type: PROTEUS_APPEND_GALLERY_ITEM_REQUEST,
  controller,
})

export const appendGalleryItemSuccess = (controller: Controller) => ({
  type: PROTEUS_APPEND_GALLERY_ITEM_SUCCESS,
  payload: controller,
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
