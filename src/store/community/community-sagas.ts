import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { 
  getStoredAccessToken,
  updateStoredAccessToken
} from '../../utils/user-utils'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { getCommunityPostsFailure, getCommunityPostsSuccess, isAdminFailure, isAdminSuccess } from './community-actions'
import { 
  COMMUNITY_GET_POSTS_API_ERROR_MESSAGES,
  COMMUNITY_GET_POSTS_REQUEST,
  COMMUNITY_IS_ADMIN_API_ERROR_MESSAGES, 
  COMMUNITY_IS_ADMIN_REQUEST 
} from './community-constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* isCommunityAdminSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/admin/access`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(isAdminSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(isAdminFailure(generateApiError('community/isCommunityAdminSaga', response, COMMUNITY_IS_ADMIN_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(isAdminFailure(generateApiError('community/isCommunityAdminSaga', undefined, COMMUNITY_IS_ADMIN_API_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getCommunityPostsSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/community/posts`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      yield put(getCommunityPostsSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getCommunityPostsFailure(generateApiError('community/getCommunityPostsSaga', response, COMMUNITY_GET_POSTS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getCommunityPostsFailure(generateApiError('community/getCommunityPostsSaga', undefined, COMMUNITY_GET_POSTS_API_ERROR_MESSAGES)))
  }
}

export function* isCommunityAdminSagaWatcher(){
  yield takeLatest(COMMUNITY_IS_ADMIN_REQUEST, isCommunityAdminSaga)
}

export function* getCommunityPostsSagaWatcher(){
  yield takeLatest(COMMUNITY_GET_POSTS_REQUEST, getCommunityPostsSaga)
}