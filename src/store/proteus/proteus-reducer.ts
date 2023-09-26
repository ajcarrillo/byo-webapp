import * as Constants from './proteus-constants'
import { IProteusState, ProteusHidConfigDataPage } from '../../types/proteus-types'
import { transformModuleListFromDB } from '../../transformers/controller-transformers'
import { transformApplicationSettingsFromDB } from '../../transformers/proteus-transformers'

const initialState = {
  apiError: null,
  unityReady: false,
  gamepadReady: false,
  modulesLoading: false,
  galleryLoading: false,
  settingsLoading: false,
  appVersion: undefined,
  firmware: null,
  modules: null,
  mapping: null,
  gallery: null,
  settings: null,
  controllerConnectionError: null,
  controllerCommunicating: false,
  connectedController: null,
  hidReports: null,
}

const updateFetchedConfigDataPages = (existingPages: ProteusHidConfigDataPage[] | null, newPage: ProteusHidConfigDataPage): ProteusHidConfigDataPage[] => {
  if(!existingPages){
    return [newPage]
  } else {
    const newList = [...existingPages]
    newList.push(newPage)
    return newList
  }
}

export const proteusReducer = (state: IProteusState = initialState, action: any) => {
  switch (action.type) {

  case Constants.PROTEUS_GET_MODULES_REQUEST:
    return { ...state, apiError: null, modulesLoading: true, appVersion: undefined, firmware: null, modules: null }
  case Constants.PROTEUS_GET_MODULES_SUCCESS:
    return { ...state, apiError: null, modulesLoading: false, appVersion: action.payload.appVersion, firmware: action.payload.firmware, modules: transformModuleListFromDB(action.payload.modules) }
  case Constants.PROTEUS_GET_MODULES_FAILURE:
    return { ...state, apiError: action.payload, modulesLoading: false, appVersion: undefined, firmware: null, modules: null }

  case Constants.PROTEUS_GET_GALLERY_ITEMS_REQUEST:
    return { ...state, apiError: null, galleryLoading: true, gallery: null }
  case Constants.PROTEUS_GET_GALLERY_ITEMS_SUCCESS:
    return { ...state, apiError: null, galleryLoading: false, gallery: action.payload.gallery }
  case Constants.PROTEUS_GET_GALLERY_ITEMS_FAILURE:
    return { ...state, apiError: action.payload, galleryLoading: false, gallery: null }

  case Constants.PROTEUS_APPEND_GALLERY_ITEM_REQUEST:
    return { ...state }
  case Constants.PROTEUS_APPEND_GALLERY_ITEM_SUCCESS:
    return { ...state, gallery: {community: state.gallery?.community || [], personal: [action.payload, ...state.gallery?.personal || []]} }

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

  case Constants.PROTEUS_CONNECT_SERIAL_REQUEST:
    return { ...state, controllerConnectionError: null }
  case Constants.PROTEUS_CONNECT_SERIAL_SUCCESS:
    return { ...state, controllerConnectionError: null, connectedController: action.payload }
  case Constants.PROTEUS_CONNECT_SERIAL_FAILURE:
    return { ...state, controllerConnectionError: action.error }

  case Constants.PROTEUS_SET_CONTROLLER_CONFIG_REQUEST:
    return { ...state, connectedController: {...state.connectedController, controllerConfiguration: action.payload} }

  case Constants.PROTEUS_SET_CONTROLLER_LIGHTING_REQUEST:
    return { ...state, connectedController: {...state.connectedController, controllerLights: action.payload} }
  
  case Constants.PROTEUS_SET_CONTROLLER_COMMUNICATING_REQUEST:
    return { ...state, controllerCommunicating: action.payload }

  case Constants.PROTEUS_SET_CONTROLLER_DISCONNECT_REQUEST:
    return { ...state, controllerConnectionError: action.payload, connectedController: null }

  case Constants.PROTEUS_SET_HID_PROCESSING_CONFIG_REQUEST:
    return { ...state, hidReports: {
      processingControllerConfig: action.payload, 
      fetchingConfigHeader: false, 
      configHeaderReceived: false, 
      fetchingConfigData: false, 
      configDataReceived: false, 
      firmwareCheckComplete: false, 
      newFirmwareAvailable: false, 
      configHeader: null, 
      configData: null
    } }

  case Constants.PROTEUS_SET_HID_CONFIG_HEADER_REQUEST:
    return { ...state, hidReports: {...state.hidReports, fetchingConfigHeader: true, configHeaderReceived: false, firmwareCheckComplete: false, configHeader: null} }
  case Constants.PROTEUS_SET_HID_CONFIG_HEADER_SUCCESS:
    return { ...state, hidReports: {...state.hidReports, fetchingConfigHeader: false, configHeaderReceived: true,  configHeader: action.payload} }

  case Constants.PROTEUS_SET_HID_CONFIG_DATA_REQUEST:
    return { ...state, hidReports: {...state.hidReports, fetchingConfigData: true, configDataReceived: false, configData: null} }
  case Constants.PROTEUS_SET_HID_CONFIG_DATA_PAGE_SUCCESS:
    return { ...state, hidReports: {...state.hidReports, configData: updateFetchedConfigDataPages(state.hidReports ? state.hidReports.configData : null, action.payload)} }
  case Constants.PROTEUS_SET_HID_CONFIG_DATA_SUCCESS:
    return { ...state, hidReports: {...state.hidReports, fetchingConfigData: false, configDataReceived: true} }

  case Constants.PROTEUS_SET_HID_FIRMWARE_CHECK_COMPLETE_REQUEST:
    return { ...state, hidReports: {...state.hidReports, firmwareCheckComplete: action.payload} }

  case Constants.PROTEUS_SET_HID_NEW_FIRMWARE_AVAILABLE_REQUEST:
    return { ...state, hidReports: {...state.hidReports, newFirmwareAvailable: action.payload} }

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