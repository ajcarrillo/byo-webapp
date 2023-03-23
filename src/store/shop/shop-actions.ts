import { APIError, APIResponse } from '../../types/api-types'
import { ShopBasketItem } from '../../types/shop-types'
import { 
  SHOP_GET_CUSTOMER_DETAILS_FAILURE, 
  SHOP_GET_CUSTOMER_DETAILS_REQUEST, 
  SHOP_GET_CUSTOMER_DETAILS_SUCCESS,
  SHOP_GET_PRODUCTS_FAILURE,
  SHOP_GET_PRODUCTS_REQUEST,
  SHOP_GET_PRODUCTS_SUCCESS,
  SHOP_UPDATE_BASKET_REQUEST
} from './shop-constants'

export const getCustomerDetailsRequest = () => ({
  type: SHOP_GET_CUSTOMER_DETAILS_REQUEST,
})

export const getCustomerDetailsSuccess = (response: APIResponse) => ({
  type: SHOP_GET_CUSTOMER_DETAILS_SUCCESS,
  payload: response,
})

export const getCustomerDetailsFailure = (error: APIError) => ({
  type: SHOP_GET_CUSTOMER_DETAILS_FAILURE,
  payload: error,
})

export const getShopProductsRequest = () => ({
  type: SHOP_GET_PRODUCTS_REQUEST,
})

export const getShopProductsSuccess = (response: APIResponse) => ({
  type: SHOP_GET_PRODUCTS_SUCCESS,
  payload: response,
})

export const getShopProductsFailure = (error: APIError) => ({
  type: SHOP_GET_PRODUCTS_FAILURE,
  payload: error,
})

export const updateShopBasketRequest = (basket: ShopBasketItem[]) => ({
  type: SHOP_UPDATE_BASKET_REQUEST,
  payload: basket,
})
