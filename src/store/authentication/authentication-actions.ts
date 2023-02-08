import { APIError, APIResponse } from '../../types/api-types'
import {
  AUTH_GET_USER_REQUEST,
  AUTH_GET_USER_SUCCESS,
  AUTH_GET_USER_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_SIGNUP_REQUEST,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILURE,
  AUTH_RESEND_EMAIL_REQUEST,
  AUTH_RESEND_EMAIL_SUCCESS,
  AUTH_RESEND_EMAIL_FAILURE,
  AUTH_CONFIRM_EMAIL_REQUEST,
  AUTH_CONFIRM_EMAIL_SUCCESS,
  AUTH_CONFIRM_EMAIL_FAILURE,
  AUTH_RESET_PASSWORD_REQUEST,
  AUTH_RESET_PASSWORD_SUCCESS,
  AUTH_RESET_PASSWORD_FAILURE,
  AUTH_PASSWORD_CHANGE_REQUEST,
  AUTH_PASSWORD_CHANGE_SUCCESS,
  AUTH_PASSWORD_CHANGE_FAILURE,
  AUTH_SAVE_USER_FAILURE,
  AUTH_SAVE_USER_SUCCESS,
  AUTH_SAVE_USER_REQUEST,
  AUTH_SAVE_USER_CLEAR_API_RESPONSE
} from './authentication-constants'

export const getUserRequest = () => ({
  type: AUTH_GET_USER_REQUEST,
})

export const getUserSuccess = (response: APIResponse) => ({
  type: AUTH_GET_USER_SUCCESS,
  payload: response,
})

export const getUserFailure = (error: APIError) => ({
  type: AUTH_GET_USER_FAILURE,
  payload: error,
})

export const saveUserDetailsRequest = (details: FormData) => ({
  type: AUTH_SAVE_USER_REQUEST,
  details,
})

export const saveUserDetailsSuccess = (response: APIError) => ({
  type: AUTH_SAVE_USER_SUCCESS,
  payload: response,
})

export const saveUserDetailsFailure = (error: APIError) => ({
  type: AUTH_SAVE_USER_FAILURE,
  payload: error,
})

export const saveUserDetailsClearApiResponse = () => ({
  type: AUTH_SAVE_USER_CLEAR_API_RESPONSE,
})

export const signInRequest = (credentials: FormData) => ({
  type: AUTH_LOGIN_REQUEST,
  credentials,
})

export const signInSuccess = (response: APIResponse) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: response,
})

export const signInFailure = (error: APIError) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
})

export const signUpRequest = (credentials: FormData) => ({
  type: AUTH_SIGNUP_REQUEST,
  credentials,
})

export const signUpSuccess = (response: APIResponse) => ({
  type: AUTH_SIGNUP_SUCCESS,
  payload: response,
})

export const signUpFailure = (error: APIError) => ({
  type: AUTH_SIGNUP_FAILURE,
  payload: error,
})

export const resendEmailRequest = (credentials: FormData) => ({
  type: AUTH_RESEND_EMAIL_REQUEST,
  credentials,
})

export const resendEmailSuccess = (response: APIResponse) => ({
  type: AUTH_RESEND_EMAIL_SUCCESS,
  payload: response,
})

export const resendEmailFailure = (error: APIError) => ({
  type: AUTH_RESEND_EMAIL_FAILURE,
  payload: error,
})

export const confirmEmailRequest = (confCode: string, email: string) => ({
  type: AUTH_CONFIRM_EMAIL_REQUEST,
  confCode,
  email,
})

export const confirmEmailSuccess = (response: APIResponse) => ({
  type: AUTH_CONFIRM_EMAIL_SUCCESS,
  payload: response,
})

export const confirmEmailFailure = (error: APIError) => ({
  type: AUTH_CONFIRM_EMAIL_FAILURE,
  payload: error,
})

export const resetPasswordRequest = (email: string) => ({
  type: AUTH_RESET_PASSWORD_REQUEST,
  email,
})

export const resetPasswordSuccess = (response: APIResponse) => ({
  type: AUTH_RESET_PASSWORD_SUCCESS,
  payload: response,
})

export const resetPasswordFailure = (error: APIError) => ({
  type: AUTH_RESET_PASSWORD_FAILURE,
  payload: error,
})

export const passwordChangeRequest = (credentials: FormData) => ({
  type: AUTH_PASSWORD_CHANGE_REQUEST,
  credentials,
})

export const passwordChangeSuccess = (response: APIResponse) => ({
  type: AUTH_PASSWORD_CHANGE_SUCCESS,
  payload: response,
})

export const passwordChangeFailure = (error: APIError) => ({
  type: AUTH_PASSWORD_CHANGE_FAILURE,
  payload: error,
})