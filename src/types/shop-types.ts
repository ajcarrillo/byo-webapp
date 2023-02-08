import { APIError } from './api-types'

export interface IShopState {
  loading: boolean;
  apiError: APIError | null;
  exchangeRates: ExchangeRate[] | null;
  productCategoryDescriptions: ProductCategoryDescriptor[] | null;
  basketItems: ShoppingBasketItem[] | null;
  userCredits: any | null;
  paymentDetails: any | null;
}

export type ProductCategoryDescriptor = {
  category: string,
  subCategory: string,
  productType: string,
  paymentType: string,
  deliveryMethod: string,
}

export type ExchangeRate = {
  isBase: boolean,
  currency: string,
  price: string,
  timestamp: string,
}

export type ShoppingBasketItem = {
  sellerAddress: string,
  itemCategory: string,
  itemSubCategory: string,
  itemParentAddress?: string,
  itemAddress: string,
  itemName: string,
  itemImage: string,
  itemPriceCurrency?: string,
  itemPriceMoney?: string,
  itemPriceYango?: string,
  amount: string,
  payWith: string,
}