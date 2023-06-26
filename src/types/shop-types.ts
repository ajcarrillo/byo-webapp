import { APIError } from './api-types'
import { OrdersItem } from './orders-types'
import { User, UserContact } from './user-types'

export interface IShopState {
  apiError: APIError | null,
  productsLoading: boolean,
  groupsLoading: boolean,
  customerDetailsLoading: boolean,
  countriesLoading: boolean,
  americanStatesLoading: boolean,
  salesTransactionLoading: boolean,
  ordersLoading: boolean,
  americanStates: ShopAmericanState[] | null,
  countries: ShopCountry[] | null,
  products: ShopProduct[] | null,
  groups: ShopGroup[] | null,
  groupsFetched: string[] | null,
  customerDetails: ShopCustomer | null,
  basketItems: ShopBasketItem[] | null,
  salesTransaction: ShopSalesTransaction | null,
  orders: OrdersItem[] | null,
}

export type ShopAmericanState = {
  code: string,
  name: string,
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

export type ShopGroup = {
  groupAddress: string,
  groupName: string,
  groupDescription: string,
  groupImage: string, 
}

export type ShopProduct = {
  productMetaTitle: string,
  productMetaDescription: string,
  productMetaKeywords: string,
  productAddress: string,
  productCode: string,
  productName: string,
  productDescription: string,
  productPrice: string,
  productImages: string[], 
  productDispatchTime: string,
  productStockLevel: string,
  productGroups: string[],
}

export type ShopBasketItem = {
  item: ShopProduct,
  amount: number,
  trackers: ShopSaleTracker[],
}

export type ShopBasketItemLite = {
  productCode: string,
  productAmount: number,
  trackers?: ShopSaleTracker[],
}

export type ShopSaleTracker = {
  trackerType: 'campaign' | 'affiliate',
  trackerCode: string,
}

export type ShopCheckoutSummary = {
  sub: string,
  tax: string,
  shipping: string,
  total: string,
}

export type ShopSalesTransaction = {
  stripeClientSecret: string,
  salesAmount: ShopCheckoutSummary,
  transactionStatus: 'new' | 'update',
  transactionId: string,
  taxAddress: UserContact,
}
