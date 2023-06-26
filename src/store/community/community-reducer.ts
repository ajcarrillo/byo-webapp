import * as Constants from './community-constants'
import { ICommunityState } from '../../types/community-types'

const initialState = {
  apiError: null,
  postsLoading: false,
  adminLoading: false,
  posts: null,
  isAdmin: false,
}

export const communityReducer = (state: ICommunityState = initialState, action: any) => {
  switch (action.type) {
  case Constants.COMMUNITY_IS_ADMIN_REQUEST:
    return { ...state, apiError: null, adminLoading: true, isAdmin: false }
  case Constants.COMMUNITY_IS_ADMIN_SUCCESS:
    return { ...state, apiError: null, adminLoading: false, isAdmin: action.payload.isAdmin }
  case Constants.COMMUNITY_IS_ADMIN_FAILURE:
    return { ...state, apiError: action.payload, adminLoading: false, isAdmin: false }

  case Constants.COMMUNITY_GET_POSTS_REQUEST:
    return { ...state, apiError: null, postsLoading: true, posts: null }
  case Constants.COMMUNITY_GET_POSTS_SUCCESS:
    return { ...state, apiError: null, postsLoading: false, posts: action.payload.posts }
  case Constants.COMMUNITY_GET_POSTS_FAILURE:
    return { ...state, apiError: action.payload, postsLoading: false, posts: null }

  default:
    return state
  }
}