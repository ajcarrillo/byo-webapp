import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { 
  getStoredAccessToken, 
  updateStoredAccessToken
} from '../../utils/user-utils'
import {
  PROTEUS_GET_MODULES_REQUEST,
  PROTEUS_MODULES_API_ERROR_MESSAGES
} from './proteus-constants'
import { 
  getModulesFailure,
  getModulesSuccess
} from './proteus-actions'

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

export function* getProteusModulesSagaWatcher(){
  yield takeLatest(PROTEUS_GET_MODULES_REQUEST, getProteusModulesSaga)
}
