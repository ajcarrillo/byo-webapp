import { Disability } from './disability-types'
import { Controller } from './controller-types'
import { APIError } from './api-types'
import { Modify, SelectType } from './global-types'
import { SingleValue } from 'react-select'

export type User = {
  address: string,
  email: string,
  firstName: string,
  lastName: string,
  languageCode: string,
  hasDisabilities: boolean,
}

export type UserContact = {
  address?: string,
  name?: string,
  addressLine1?: string,
  addressLine2?: string,
  townCity?: string,
  regionCounty?: string,
  zipPostcode?: string,
  countryCode?: string,
  telephone?: string,
}

export type UserContactExtended = Modify<UserContact, {
  firstName?: string, 
  lastName?: string,
  countryCodeSelect?: SingleValue<SelectType>
}>

export type UserProfile = {
  address: string,
  name: string,
  biography: string,
  avatarImage: string,
  bannerImage: string,
}

export type UserDisabilities = {
  list: Disability[],
}

export interface IUserState {
  user: User,
  profile: UserProfile,
  disabilities: UserDisabilities,
  controllers: Controller[],
  contacts: UserContact[],
}

export interface IUserProfileState {
  userProfileLoading: boolean;
  apiError: APIError | null;
  saveApiError: APIError | null;
  uploadImageApiError: APIError | null;
  profileDetails: UserProfile | null;
  userOnboardingLoading: boolean;
  //onboardingDetails: UserOnboardingDetails | null;
  //stripeAccountLinkURL: string | null;
}