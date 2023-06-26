import { APIError, APIResponse } from '../../types/api-types'
import { 
  COMMUNITY_GET_POSTS_FAILURE,
  COMMUNITY_GET_POSTS_REQUEST,
  COMMUNITY_GET_POSTS_SUCCESS,
  COMMUNITY_IS_ADMIN_FAILURE, 
  COMMUNITY_IS_ADMIN_REQUEST, 
  COMMUNITY_IS_ADMIN_SUCCESS 
} from './community-constants'

export const isAdminRequest = () => ({
  type: COMMUNITY_IS_ADMIN_REQUEST,
})

export const isAdminSuccess = (response: APIResponse) => ({
  type: COMMUNITY_IS_ADMIN_SUCCESS,
  payload: response,
})

export const isAdminFailure = (error: APIError) => ({
  type: COMMUNITY_IS_ADMIN_FAILURE,
  payload: error,
})

export const getCommunityPostsRequest = () => ({
  type: COMMUNITY_GET_POSTS_REQUEST,
})

export const getCommunityPostsSuccess = (response: APIResponse) => ({
  type: COMMUNITY_GET_POSTS_SUCCESS,
  payload: response,
})

export const getCommunityPostsFailure = (error: APIError) => ({
  type: COMMUNITY_GET_POSTS_FAILURE,
  payload: error,
})