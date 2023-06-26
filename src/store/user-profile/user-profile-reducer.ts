import * as Constants from './user-profile-constants'
import { IUserProfileState } from '../../types/user-types'

const initialState = {
  apiError: null,
  userProfileLoading: false,
  profile: null,
}

export const userProfileReducer = (state: IUserProfileState = initialState, action: any) => {
  switch(action.type){
  case Constants.USER_PROFILE_GET_DETAILS_REQUEST:
    return {...state, apiError: null, userProfileLoading: true, profile: null}
  case Constants.USER_PROFILE_GET_DETAILS_SUCCESS:
    return {...state, apiError: null, userProfileLoading: false, profile: action.payload}
  case Constants.USER_PROFILE_GET_DETAILS_FAILURE:
    return {...state, apiError: action.payload, userProfileLoading: false, profile: null}

  default:
    return state
  }
}