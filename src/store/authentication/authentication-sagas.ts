import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { 
  getStoredAccessToken, 
  updateStoredAccessToken, 
  updateStoredOnboardingSummary, 
  updateStoredUserAddress,
  updateStoredUserEntitlements,
  updateStoredUserLocalisation,
  updateStoredUserName,
  updateStoredUserProfileType
} from '../../utils/user-utils'
import { 
  AUTH_GET_USER_REQUEST,
  AUTH_LOGIN_REQUEST, 
  AUTH_SIGNUP_REQUEST, 
  AUTH_RESEND_EMAIL_REQUEST, 
  AUTH_CONFIRM_EMAIL_REQUEST, 
  AUTH_RESET_PASSWORD_REQUEST, 
  AUTH_PASSWORD_CHANGE_REQUEST, 
  GET_USER_API_ERROR_MESSAGES, 
  SIGNIN_API_ERROR_MESSAGES, 
  SIGNUP_API_ERROR_MESSAGES,
  RESEND_EMAIL_API_ERROR_MESSAGES,
  CONFIRM_EMAIL_API_ERROR_MESSAGES,
  RESET_PASSWORD_API_ERROR_MESSAGES,
  PASSWORD_CHANGE_API_ERROR_MESSAGES,
  SAVE_USER_API_ERROR_MESSAGES,
  AUTH_SAVE_USER_REQUEST
} from './authentication-constants'
import { 
  getUserFailure,
  getUserSuccess,
  signInFailure, 
  signInSuccess, 
  signUpFailure, 
  signUpSuccess,
  resendEmailFailure,
  resendEmailSuccess,
  confirmEmailFailure,
  confirmEmailSuccess,
  resetPasswordFailure,
  resetPasswordSuccess,
  passwordChangeFailure,
  passwordChangeSuccess,
  saveUserDetailsSuccess,
  saveUserDetailsFailure
} from './authentication-actions'

export function* getUserSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/user`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(getUserSuccess(response.data.userDetails))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getUserFailure(generateApiError('autentication/getUserSaga', response, GET_USER_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getUserFailure(generateApiError('autentication/getUserSaga', undefined, GET_USER_API_ERROR_MESSAGES)))
  }
}

export function* saveUserDetailsSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/user`,
      'POST',
      token,
      {
        countryCode: action.details.get('countryCode'),
        emailAddress: action.details.get('emailAddress'),
        firstName: action.details.get('firstName'),
        lastName: action.details.get('lastName'),
        password: action.details.get('password')
      },
      'json'
    )

    if(response.status === 200){
      if(response.data.updatedToken) updateStoredAccessToken(response.data.updatedToken, true)
      updateStoredUserLocalisation(response.data.localisation)
      updateStoredUserName(response.data.userName)
      yield put(saveUserDetailsSuccess(generateApiError('autentication/saveUserDetailsSaga', response, SAVE_USER_API_ERROR_MESSAGES)))
    } else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(saveUserDetailsFailure(generateApiError('autentication/saveUserDetailsSaga', response, SAVE_USER_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(saveUserDetailsFailure(generateApiError('autentication/saveUserDetailsSaga', undefined, SAVE_USER_API_ERROR_MESSAGES)))
  }
}

export function* signInSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/sign-in`,
      'POST',
      undefined,
      {
        email: action.credentials.get('email'),
        password: action.credentials.get('password')
      },
      'json'
    )

    if(response.status === 200){
      updateStoredAccessToken(response.data.token, true)
      updateStoredUserAddress(response.data.address)
      updateStoredUserEntitlements(response.data.entitlements)
      updateStoredUserProfileType(response.data.profileType)
      updateStoredOnboardingSummary(response.data.onboardingSummary)
      updateStoredUserLocalisation(response.data.localisation)
      updateStoredUserName(response.data.userName)
      yield put(signInSuccess(response.data))
    }
    else {
      updateStoredAccessToken('', false)
      yield put(signInFailure(generateApiError('autentication/signInSaga', response, SIGNIN_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    updateStoredAccessToken('', false)
    yield put(signInFailure(generateApiError('autentication/signInSaga', undefined, SIGNIN_API_ERROR_MESSAGES)))
  }
}

export function* signUpSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/sign-up`,
      'POST',
      undefined,
      {
        email: action.credentials.get('email'),
        password: action.credentials.get('password'),
        accountType: action.credentials.get('accountType'),
      },
      'json'
    )

    if(response.status === 200)
      yield put(signUpSuccess(response))
    else
      yield put(signUpFailure(generateApiError('autentication/signUpSaga', response, SIGNUP_API_ERROR_MESSAGES)))
  } 
  catch(e) {
    yield put(signUpFailure(generateApiError('autentication/signUpSaga', undefined, SIGNUP_API_ERROR_MESSAGES )))
  }
}

export function* resendEmailSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/resend-confirm-email`,
      'POST',
      undefined,
      {
        email: action.credentials.get('email'),
        password: action.credentials.get('password')
      },
      'json'
    )

    if(response.status === 200)
      yield put(resendEmailSuccess(response))
    else
      yield put(resendEmailFailure(generateApiError('autentication/resendEmailSaga', response, RESEND_EMAIL_API_ERROR_MESSAGES)))
  } 
  catch(e) {
    yield put(resendEmailFailure(generateApiError('autentication/resendEmailSaga', undefined, RESEND_EMAIL_API_ERROR_MESSAGES )))
  }
}

export function* confirmEmailSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/confirm-email`,
      'POST',
      undefined,
      {
        email: action.email,
        confCode: action.confCode
      },
      'json'
    )

    if(response.status === 200)
      yield put(confirmEmailSuccess(response))
    else
      yield put(confirmEmailFailure(generateApiError('autentication/confirmEmailSaga', response, CONFIRM_EMAIL_API_ERROR_MESSAGES)))
  } 
  catch(e) {
    yield put(confirmEmailFailure(generateApiError('autentication/confirmEmailSaga', undefined, CONFIRM_EMAIL_API_ERROR_MESSAGES )))
  }
}

export function* rquestPasswordResetSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/request-password-reset`,
      'POST',
      undefined,
      {
        email: action.email,
      },
      'json'
    )

    if(response.status === 200)
      yield put(resetPasswordSuccess(response))
    else
      yield put(resetPasswordFailure(generateApiError('autentication/rquestPasswordResetSaga', response, RESET_PASSWORD_API_ERROR_MESSAGES)))
  } 
  catch(e) {
    yield put(resetPasswordFailure(generateApiError('autentication/rquestPasswordResetSaga', undefined, RESET_PASSWORD_API_ERROR_MESSAGES )))
  }
}

export function* changePasswordSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/auth/change-password`,
      'POST',
      undefined,
      {
        email: action.credentials.get('email'),
        password: action.credentials.get('password'),
        resetCode: action.credentials.get('resetCode')
      },
      'json'
    )

    if(response.status === 200)
      yield put(passwordChangeSuccess(response))
    else
      yield put(passwordChangeFailure(generateApiError('autentication/changePasswordSaga', response, PASSWORD_CHANGE_API_ERROR_MESSAGES)))
  } 
  catch(e) {
    yield put(passwordChangeFailure(generateApiError('autentication/changePasswordSaga', undefined, PASSWORD_CHANGE_API_ERROR_MESSAGES)))
  }
}

export function* getUserSagaWatcher(){
  yield takeLatest(AUTH_GET_USER_REQUEST, getUserSaga)
}

export function* saveUserDetailsSagaWatcher(){
  yield takeLatest(AUTH_SAVE_USER_REQUEST, saveUserDetailsSaga)
}

export function* signInSagaWatcher(){
  yield takeLatest(AUTH_LOGIN_REQUEST, signInSaga)
}

export function* signUpSagaWatcher(){
  yield takeLatest(AUTH_SIGNUP_REQUEST, signUpSaga)
}

export function* resendEmailSagaWatcher(){
  yield takeLatest(AUTH_RESEND_EMAIL_REQUEST, resendEmailSaga)
}

export function* confirmEmailSagaWatcher(){
  yield takeLatest(AUTH_CONFIRM_EMAIL_REQUEST, confirmEmailSaga)
}

export function* rquestPasswordResetSagaWatcher(){
  yield takeLatest(AUTH_RESET_PASSWORD_REQUEST, rquestPasswordResetSaga)
}

export function* changePasswordSagaWatcher(){
  yield takeLatest(AUTH_PASSWORD_CHANGE_REQUEST, changePasswordSaga)
}