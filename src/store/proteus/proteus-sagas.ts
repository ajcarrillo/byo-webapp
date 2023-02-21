import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { ControllerConfiguration } from '../../types/controller-types'
import { ConnectedController } from '../../types/proteus-types'
import { apiCall } from '../../utils/api-utils'
import { generateApiError, generateControllerConnectionError } from '../../utils/error-utils'
import { connectController, requestHardwareCofiguration } from '../../utils/proteus-utils'
import { 
  getStoredAccessToken, 
  updateStoredAccessToken
} from '../../utils/user-utils'
import {
  PROTEUS_CONNECT_CONTROLLER_REQUEST,
  PROTEUS_CONNECT_CONTROLLER_ERROR_MESSAGES,
  PROTEUS_GET_MODULES_REQUEST,
  PROTEUS_MODULES_API_ERROR_MESSAGES,
  PROTEUS_GET_APP_SETTINGS_REQUEST,
  PROTEUS_APP_SETTINGS_API_ERROR_MESSAGES,
  PROTEUS_GET_CONTROLLER_CONFIG_REQUEST,
  PROTEUS_GET_CONTROLLER_CONFIG_ERROR_MESSAGES,
  PROTEUS_SET_UNITY_READY_REQUEST
} from './proteus-constants'
import { 
  getModulesFailure,
  getModulesSuccess,
  connectControllerFailure,
  connectControllerSuccess,
  getApplicationSettingsFailure,
  getApplicationSettingsSuccess,
  getControllerConfigFailure,
  getControllerConfigSuccess,
  setUnityReadySuccess
} from './proteus-actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* setUnityReadySaga(action: any){
  yield put(setUnityReadySuccess(action.ready))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getProteusSettingsSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/proteus/application-settings`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(getApplicationSettingsSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getApplicationSettingsFailure(generateApiError('proteus/getProteusSettingsSaga', response, PROTEUS_APP_SETTINGS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getApplicationSettingsFailure(generateApiError('proteus/getProteusSettingsSaga', undefined, PROTEUS_APP_SETTINGS_API_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getProteusModulesSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/controllers/module-list`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(getModulesSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getModulesFailure(generateApiError('proteus/getProteusModulesSaga', response, PROTEUS_MODULES_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getModulesFailure(generateApiError('proteus/getProteusModulesSaga', undefined, PROTEUS_MODULES_API_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* connectControllerSaga(action: any){
  try {
    const response: ConnectedController = yield call(
      connectController, 
      action.connectType
    )

    if(response.connected){
      yield put(connectControllerSuccess(response))
    }
    else {
      yield put(connectControllerFailure(generateControllerConnectionError('CONNECT_CANCELLED', PROTEUS_CONNECT_CONTROLLER_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    const message = e instanceof Error ? e.message : 'UNKNOWN_ERROR'
    yield put(connectControllerFailure(generateControllerConnectionError(message, PROTEUS_CONNECT_CONTROLLER_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* getControllerConfigSaga(action: any){
  try {
    const response: ControllerConfiguration = yield call(
      requestHardwareCofiguration, 
      action.connectType,
      action.deviceInterface,
      action.availableModules
    )

    if(response){
      yield put(getControllerConfigSuccess(response))
    }
    else {
      yield put(getControllerConfigFailure(generateControllerConnectionError('UNKOWN_ERROR', PROTEUS_GET_CONTROLLER_CONFIG_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    const message = e instanceof Error ? e.message : 'UNKNOWN_ERROR'
    yield put(getControllerConfigFailure(generateControllerConnectionError(message, PROTEUS_GET_CONTROLLER_CONFIG_ERROR_MESSAGES)))
  }
}

export function* getProteusModulesSagaWatcher(){
  yield takeLatest(PROTEUS_GET_MODULES_REQUEST, getProteusModulesSaga)
}

export function* connectControllerSagaWatcher(){
  yield takeLatest(PROTEUS_CONNECT_CONTROLLER_REQUEST, connectControllerSaga)
}

export function* getProteusSettingsSagaWatcher(){
  yield takeLatest(PROTEUS_GET_APP_SETTINGS_REQUEST, getProteusSettingsSaga)
}

export function* getControllerConfigSagaWatcher(){
  yield takeLatest(PROTEUS_GET_CONTROLLER_CONFIG_REQUEST, getControllerConfigSaga)
}

export function* setUnityReadySagaWatcher(){
  yield takeLatest(PROTEUS_SET_UNITY_READY_REQUEST, setUnityReadySaga)
}
