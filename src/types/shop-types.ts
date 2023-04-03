import { SingleValue } from 'react-select'

import { APIError } from './api-types'
import { User, UserContact } from './user-types'

export interface IShopState {
  apiError: APIError | null,
  productsLoading: boolean,
  customerDetailaLoading: boolean,
  countriesLoading: boolean,
  countries: ShopCountry[] | null,
  products: ShopProduct[] | null,
  customerDetails: ShopCustomer | null,
  basketItems: ShopBasketItem[] | null,
}

export type ShopCountry = {
  phonePrefix: string,
  code: string,
  name: string,
  currenySymbol: string,
  currency: string,
  iso: string,
  supported: boolean
}

export type ShopCustomer = {
  user: User,
  contacts: UserContact[],
}

export type ShopProduct = {
  productAddress: string,
  productCode: string,
  productName: string,
  productDescription: string,
  productPrice: string,
  productImages: string[], 
  productDispatchTime: string,
}

export type ShopBasketItem = {
  item: ShopProduct,
  amount: number,
}

export type ShopCheckoutSummary = {
  sub: string,
  tax: string,
  shipping: string,
  total: string,
}

type SelectType = {
  readonly label: string,
  readonly value: string,
}