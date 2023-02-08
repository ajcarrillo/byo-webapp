import { APIError, APIResponse } from '../../types/api-types'
import {
  PROTEUS_GET_MODULES_REQUEST,
  PROTEUS_GET_MODULES_SUCCESS,
  PROTEUS_GET_MODULES_FAILURE,
} from './proteus-constants'

export const getModulesRequest = () => ({
  type: PROTEUS_GET_MODULES_REQUEST,
})

export const getModulesSuccess = (response: APIResponse) => ({
  type: PROTEUS_GET_MODULES_SUCCESS,
  payload: response,
})

export const getModulesFailure = (error: APIError) => ({
  type: PROTEUS_GET_MODULES_FAILURE,
  payload: error,
})
