import * as Constants from './proteus-constants'
import { IProteusState } from '../../types/proteus-types'
import { transformModuleListFromDB } from '../../transformers/controller-transformers'
import { transformApplicationSettingsFromDB } from '../../transformers/proteus-transformers'

const initialState = {
  apiError: null,
  unityReady: false,
  gamepadReady: false,
  modulesLoading: false,
  galleryLoading: false,
  settingsLoading: false,
  version: undefined,
  firmwareVersion: undefined,
  modules: null,
  mapping: null,
  gallery: null,
  settings: null,
  controllerConnectionError: null,
  connectedController: null,
}

export const proteusReducer = (state: IProteusState = initialState, action: any) => {
  switch (action.type) {

  case Constants.PROTEUS_GET_MODULES_REQUEST:
    return { ...state, apiError: null, modulesLoading: true, version: undefined, firmwareVersion: undefined, modules: null }
  case Constants.PROTEUS_GET_MODULES_SUCCESS:
    return { ...state, apiError: null, modulesLoading: false, version: action.payload.version, firmwareVersion: action.payload.firmwareVersion, modules: transformModuleListFromDB(action.payload.modules) }
  case Constants.PROTEUS_GET_MODULES_FAILURE:
    return { ...state, apiError: action.payload, modulesLoading: false, version: undefined, firmwareVersion: undefined, modules: null }

  case Constants.PROTEUS_GET_APP_SETTINGS_REQUEST:
    return { ...state, apiError: null, settingsLoading: true, settings: null }
  case Constants.PROTEUS_GET_APP_SETTINGS_SUCCESS:
    return { ...state, apiError: null, settingsLoading: false, settings: transformApplicationSettingsFromDB(action.payload.settings) }
  case Constants.PROTEUS_GET_APP_SETTINGS_FAILURE:
    return { ...state, apiError: action.payload, settingsLoading: false, settings: null }

  case Constants.PROTEUS_CONNECT_CONTROLLER_REQUEST:
    return { ...state, controllerConnectionError: null, connectedController: null }
  case Constants.PROTEUS_CONNECT_CONTROLLER_SUCCESS:
    return { ...state, controllerConnectionError: null, connectedController: action.payload }
  case Constants.PROTEUS_CONNECT_CONTROLLER_FAILURE:
    return { ...state, controllerConnectionError: action.error, connectedController: null }

  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_REQUEST:
    return { ...state, controllerConnectionError: undefined, connectedController: {...state.connectedController, communicating: true} }
  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_SUCCESS:
    return { ...state, controllerConnectionError: undefined, connectedController: {...state.connectedController, communicating: false, controllerConfiguration: action.payload} }
  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_FAILURE:
    return { ...state, controllerConnectionError: action.error, connectedController: {...state.connectedController, communicating: false} }

  case Constants.PROTEUS_SET_UNITY_READY_REQUEST:
    return { ...state, unityReady: false }
  case Constants.PROTEUS_SET_UNITY_READY_SUCCESS:
    return { ...state, unityReady: action.payload }

  case Constants.PROTEUS_SET_GAMEPAD_READY_REQUEST:
    return { ...state, gamepadReady: false }
  case Constants.PROTEUS_SET_GAMEPAD_READY_SUCCESS:
    return { ...state, gamepadReady: action.payload }

  case Constants.PROTEUS_SET_MAPPING_MODE_REQUEST:
    return { ...state, mapping: null }
  case Constants.PROTEUS_SET_MAPPING_MODE_SUCCESS:
    return { ...state, mapping: action.payload }

  default:
    return state
  }
}