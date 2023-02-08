import * as Constants from './authentication-constants'
import { IAuthenticationState } from '../../types/store-types'

const initialState = {
  apiError: null,
  authenticationLoading: false,
  userAddress: undefined,
  accessToken: undefined,
  accessTokenValid: false,
  signupComplete: false,
  emailResent: false,
  confirmingEmail: false,
  emailConfirmed: false,
  passwordResetRequested: false,
  passwordChanged: false,
  saveUserDetailsApiError: null,
  userDetails: null,
}

export const authenticationReducer = (state: IAuthenticationState = initialState, action: any) => {
  switch (action.type) {
  case Constants.AUTH_GET_USER_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true, userDetails: null }
  case Constants.AUTH_GET_USER_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, userDetails: action.payload }
  case Constants.AUTH_GET_USER_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, userDetails: null }

  case Constants.AUTH_SAVE_USER_REQUEST:
    return { ...state, saveUserDetailsApiError: null, authenticationLoading: true }
  case Constants.AUTH_SAVE_USER_SUCCESS:
    return { ...state, saveUserDetailsApiError: action.payload, authenticationLoading: false, userDetails: null }
  case Constants.AUTH_SAVE_USER_FAILURE:
    return { ...state, saveUserDetailsApiError: action.payload, authenticationLoading: false, userDetails: null }
  case Constants.AUTH_SAVE_USER_CLEAR_API_RESPONSE:
    return { ...state, saveUserDetailsApiError: null }

  case Constants.AUTH_LOGIN_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true }
  case Constants.AUTH_LOGIN_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, accessToken: action.payload.token, userAddress: action.payload.address, accessTokenValid: true }
  case Constants.AUTH_LOGIN_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, accessToken: undefined, userAddress: undefined, accessTokenValid: false }

  case Constants.AUTH_SIGNUP_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true }
  case Constants.AUTH_SIGNUP_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, signupComplete: true }
  case Constants.AUTH_SIGNUP_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, signupComplete: false }

  case Constants.AUTH_RESEND_EMAIL_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true, signupComplete: true, emailResent: false }
  case Constants.AUTH_RESEND_EMAIL_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, signupComplete: true, emailResent: true }
  case Constants.AUTH_RESEND_EMAIL_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, signupComplete: true, emailResent: false }

  case Constants.AUTH_CONFIRM_EMAIL_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true, confirmingEmail: true, emailConfirmed: false }
  case Constants.AUTH_CONFIRM_EMAIL_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, confirmingEmail: true, emailConfirmed: true }
  case Constants.AUTH_CONFIRM_EMAIL_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, confirmingEmail: true, emailConfirmed: false }

  case Constants.AUTH_RESET_PASSWORD_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true, passwordResetRequested: false }
  case Constants.AUTH_RESET_PASSWORD_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, passwordResetRequested: true }
  case Constants.AUTH_RESET_PASSWORD_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, passwordResetRequested: false }

  case Constants.AUTH_PASSWORD_CHANGE_REQUEST:
    return { ...state, apiError: null, authenticationLoading: true, passwordChanged: false }
  case Constants.AUTH_PASSWORD_CHANGE_SUCCESS:
    return { ...state, apiError: null, authenticationLoading: false, passwordChanged: true }
  case Constants.AUTH_PASSWORD_CHANGE_FAILURE:
    return { ...state, apiError: action.payload, authenticationLoading: false, passwordChanged: false }

  default:
    return state
  }
}