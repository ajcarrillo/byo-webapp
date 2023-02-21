import { APIError } from './api-types'
import { IUserProfileState, User } from './user-types'
import { IProteusState } from './proteus-types'

export interface IStoreState {
  authentication: IAuthenticationState,
  userProfile: IUserProfileState,
  proteus: IProteusState,
  //site: ISiteState,
  //shop: IShopState,
}

export interface IAuthenticationState {
  signupComplete: boolean;
  emailResent: boolean; 
  confirmingEmail: boolean; 
  emailConfirmed: boolean; 
  passwordResetRequested: boolean; 
  passwordChanged: boolean; 
  userAddress: string | undefined;
  accessToken: string | undefined;
  accessTokenValid: boolean;
  authenticationLoading: boolean;
  apiError: APIError | null;
  saveUserDetailsApiError: APIError | null;
  userDetails: User | null;
}