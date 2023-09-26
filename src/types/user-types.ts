import { APIError } from './api-types'
import { Modify, SelectType } from './global-types'
import { SingleValue } from 'react-select'

/**
 * Details
 *************************************/

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
  countryCodeSelect?: SingleValue<SelectType>,
  americaStateCodeSelect?: SingleValue<SelectType>
}>

/**
 * Profile
 *************************************/

export type UserProfile = {
  address: string,
  name: string,
  biography: string,
  avatarImage: string,
  bannerImage: string,
}

export type UserProfileAddress = {
  address: string,
}

export interface IUserProfileState {
  apiError: APIError | null;
  userProfileLoading: boolean;
  profile: UserProfile | null;
}

/**
 * GDPR
 *************************************/

export interface IUserGDPRData {
  user: {
    contacts: UserContact[],
    details: User,
    profile: {
      name: string,
      biography: string,
    },
    orders: UserGDPRShopOrder[],
  }
  proteus: {
    controllerConfigs: UserGDPRProteusConfigItem[]
  }
}

export type UserGDPRProteusConfigItem = {
  configName: string,
  configImage: string,
}

export type UserGDPRShopOrderItem = {
  productCode: string,
  productName: string,
  productDescription: string,
  productPrice: string,
  amount: string,
}

export type UserGDPRShopOrder = {
  orderNumber: string,
  orderDate: string,
  orderCost: string,
  orderItems: UserGDPRShopOrderItem[]
}