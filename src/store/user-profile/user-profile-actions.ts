import { APIError, APIResponse } from '../../types/api-types'
import { 
  USER_PROFILE_GET_DETAILS_REQUEST,
  USER_PROFILE_GET_DETAILS_SUCCESS,
  USER_PROFILE_GET_DETAILS_FAILURE
} from './user-profile-constants'

export const getProfileDetailsRequest = (address: string) => ({
  type: USER_PROFILE_GET_DETAILS_REQUEST,
  address,
})

export const getProfileDetailsSuccess = (response: APIResponse) => ({
  type: USER_PROFILE_GET_DETAILS_SUCCESS,
  payload: response,
})

export const getProfileDetailsFailure = (error: APIError) => ({
  type: USER_PROFILE_GET_DETAILS_FAILURE,
  payload: error,
})