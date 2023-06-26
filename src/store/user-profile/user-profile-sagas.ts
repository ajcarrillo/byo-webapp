import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { 
  getStoredAccessToken,
  updateStoredAccessToken
} from '../../utils/user-utils'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { USER_PROFILE_GET_DETAILS_API_ERROR_MESSAGES, USER_PROFILE_GET_DETAILS_REQUEST } from './user-profile-constants'
import { getProfileDetailsFailure, getProfileDetailsSuccess } from './user-profile-actions'

export function* getUserProfileDetailsSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/user/profile/details/${action.address}`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(getProfileDetailsSuccess(response.data.profile))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getProfileDetailsFailure(generateApiError('user-profile/getUserProfileDetailsSaga', response, USER_PROFILE_GET_DETAILS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getProfileDetailsFailure(generateApiError('user-profile/getUserProfileDetailsSaga', undefined, USER_PROFILE_GET_DETAILS_API_ERROR_MESSAGES)))
  }
}

export function* getUserProfileDetailsSagaWatcher(){
  yield takeLatest(USER_PROFILE_GET_DETAILS_REQUEST, getUserProfileDetailsSaga)
}