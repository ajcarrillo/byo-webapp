import { APIError, APIResponse } from '../../types/api-types'
import { Controller, ControllerConfiguration, ControllerLights } from '../../types/controller-types'
import { ConnectedController, ProteusHidConfigDataPage, ProteusHidConfigHeader, ProteusMappingConfig } from '../../types/proteus-types'
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
  PROTEUS_SET_CONTROLLER_CONFIG_REQUEST,
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
  PROTEUS_APPEND_GALLERY_ITEM_SUCCESS,
  PROTEUS_CONNECT_SERIAL_REQUEST,
  PROTEUS_CONNECT_SERIAL_SUCCESS,
  PROTEUS_CONNECT_SERIAL_FAILURE,
  PROTEUS_SET_CONTROLLER_COMMUNICATING_REQUEST,
  PROTEUS_SET_CONTROLLER_DISCONNECT_REQUEST,
  PROTEUS_SET_HID_PROCESSING_CONFIG_REQUEST,
  PROTEUS_SET_HID_CONFIG_HEADER_REQUEST,
  PROTEUS_SET_HID_CONFIG_HEADER_SUCCESS,
  PROTEUS_SET_HID_NEW_FIRMWARE_AVAILABLE_REQUEST,
  PROTEUS_SET_HID_FIRMWARE_CHECK_COMPLETE_REQUEST,
  PROTEUS_SET_HID_CONFIG_DATA_REQUEST,
  PROTEUS_SET_HID_CONFIG_DATA_SUCCESS,
  PROTEUS_SET_HID_CONFIG_DATA_PAGE_SUCCESS,
  PROTEUS_SET_CONTROLLER_LIGHTING_REQUEST
} from './proteus-constants'

export const setHidProcessingConfigRequest = (available: boolean) => ({
  type: PROTEUS_SET_HID_PROCESSING_CONFIG_REQUEST,
  payload: available,
})

export const setHidConfigHeaderRequest = () => ({
  type: PROTEUS_SET_HID_CONFIG_HEADER_REQUEST,
})

export const setHidConfigHeaderSuccess = (header: ProteusHidConfigHeader | null) => ({
  type: PROTEUS_SET_HID_CONFIG_HEADER_SUCCESS,
  payload: header,
})

export const setHidConfigDataRequest = () => ({
  type: PROTEUS_SET_HID_CONFIG_DATA_REQUEST,
})

export const setHidConfigDataSuccess = () => ({
  type: PROTEUS_SET_HID_CONFIG_DATA_SUCCESS,
})

export const setHidConfigDataPageSuccess = (page: ProteusHidConfigDataPage | null) => ({
  type: PROTEUS_SET_HID_CONFIG_DATA_PAGE_SUCCESS,
  payload: page,
})

export const setHidFirmwareCheckCompleteRequest = (complete: boolean) => ({
  type: PROTEUS_SET_HID_FIRMWARE_CHECK_COMPLETE_REQUEST,
  payload: complete,
})

export const setHidNewFirmwareAvailableRequest = (available: boolean) => ({
  type: PROTEUS_SET_HID_NEW_FIRMWARE_AVAILABLE_REQUEST,
  payload: available,
})

export const setControllerCommunicatingRequest = (communicating: boolean) => ({
  type: PROTEUS_SET_CONTROLLER_COMMUNICATING_REQUEST,
  payload: communicating,
})

export const setControllerDisconnectRequest = (message: string) => ({
  type: PROTEUS_SET_CONTROLLER_DISCONNECT_REQUEST,
  payload: message,
})

export const setControllerConfigRequest = (config: ControllerConfiguration) => ({
  type: PROTEUS_SET_CONTROLLER_CONFIG_REQUEST,
  payload: config,
})

export const setControllerLightingRequest = (lights: ControllerLights) => ({
  type: PROTEUS_SET_CONTROLLER_LIGHTING_REQUEST,
  payload: lights,
})

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

export const connectSerialRequest = (controller: ConnectedController) => ({
  type: PROTEUS_CONNECT_SERIAL_REQUEST,
  controller,
})

export const connectSerialSuccess = (controller: ConnectedController) => ({
  type: PROTEUS_CONNECT_SERIAL_SUCCESS,
  payload: controller,
})

export const connectSerialFailure = (error: string) => ({
  type: PROTEUS_CONNECT_SERIAL_FAILURE,
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
