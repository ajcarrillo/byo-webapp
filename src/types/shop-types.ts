import { APIError } from './api-types'
import { User, UserContact } from './user-types'

export interface IShopState {
  apiError: APIError | null,
  productsLoading: boolean,
  customerDetailaLoading: boolean,
  products: ShopProduct[] | null,
  customerDetails: ShopCustomer | null,
  basketItems: ShopBasketItem[] | null,
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