import * as Constants from './proteus-constants'
import { IProteusState } from '../../types/controller-types'

const initialState = {
  apiError: null,
  modulesLoading: false,
  version: undefined,
  modules: null,
  controllerConnectionError: null,
  connectedController: null,
}

export const proteusReducer = (state: IProteusState = initialState, action: any) => {
  switch (action.type) {

  case Constants.PROTEUS_GET_MODULES_REQUEST:
    return { ...state, apiError: null, modulesLoading: true, version: undefined, modules: null }
  case Constants.PROTEUS_GET_MODULES_SUCCESS:
    return { ...state, apiError: null, modulesLoading: false, version: action.payload.version, modules: action.payload.modules }
  case Constants.PROTEUS_GET_MODULES_FAILURE:
    return { ...state, apiError: action.payload, modulesLoading: false, version: undefined, modules: null }

  case Constants.PROTEUS_CONNECT_CONTROLLER_REQUEST:
    return { ...state, controllerConnectionError: null, connectedController: null }
  case Constants.PROTEUS_CONNECT_CONTROLLER_SUCCESS:
    return { ...state, controllerConnectionError: null, connectedController: action.payload }
  case Constants.PROTEUS_CONNECT_CONTROLLER_FAILURE:
    return { ...state, controllerConnectionError: action.error, connectedController: null }

  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_REQUEST:
    return { ...state, controllerConnectionError: undefined, connectedController: null }
  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_SUCCESS:
    return { ...state, controllerConnectionError: undefined, connectedController: action.payload }
  case Constants.PROTEUS_GET_CONTROLLER_CONFIG_FAILURE:
    return { ...state, controllerConnectionError: action.error, connectedController: null }

  default:
    return state
  }
}