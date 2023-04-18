import { APIError, APIResponse } from '../../types/api-types'
import { ShopBasketItem, ShopBasketItemLite } from '../../types/shop-types'
import { UserContactExtended } from '../../types/user-types'
import { 
  SHOP_CREATE_SALES_TRANSACTION_FAILURE,
  SHOP_CREATE_SALES_TRANSACTION_REQUEST,
  SHOP_CREATE_SALES_TRANSACTION_SUCCESS,
  SHOP_GET_AMERICA_STATE_LIST_FAILURE,
  SHOP_GET_AMERICA_STATE_LIST_REQUEST,
  SHOP_GET_AMERICA_STATE_LIST_SUCCESS,
  SHOP_GET_COUNTRY_LIST_FAILURE,
  SHOP_GET_COUNTRY_LIST_REQUEST,
  SHOP_GET_COUNTRY_LIST_SUCCESS,
  SHOP_GET_CUSTOMER_DETAILS_FAILURE, 
  SHOP_GET_CUSTOMER_DETAILS_REQUEST, 
  SHOP_GET_CUSTOMER_DETAILS_SUCCESS,
  SHOP_GET_CUSTOMER_ORDERS_FAILURE, 
  SHOP_GET_CUSTOMER_ORDERS_REQUEST, 
  SHOP_GET_CUSTOMER_ORDERS_SUCCESS,
  SHOP_GET_PRODUCTS_FAILURE,
  SHOP_GET_PRODUCTS_REQUEST,
  SHOP_GET_PRODUCTS_SUCCESS,
  SHOP_SAVE_CUSTOMER_DETAILS_FAILURE,
  SHOP_SAVE_CUSTOMER_DETAILS_REQUEST,
  SHOP_SAVE_CUSTOMER_DETAILS_SUCCESS,
  SHOP_UPDATE_BASKET_REQUEST,
  SHOP_UPDATE_SALES_TRANSACTION_STATUS_REQUEST
} from './shop-constants'

export const createSalesTransactionRequest = (
  basket: ShopBasketItemLite[], 
  deliveryAddress: string,
  stripeClientSecret?: string
) => ({
  type: SHOP_CREATE_SALES_TRANSACTION_REQUEST,
  basket,
  deliveryAddress,
  stripeClientSecret,
})

export const createSalesTransactionSuccess = (response: APIResponse) => ({
  type: SHOP_CREATE_SALES_TRANSACTION_SUCCESS,
  payload: response,
})

export const createSalesTransactionFailure = (error: APIError) => ({
  type: SHOP_CREATE_SALES_TRANSACTION_FAILURE,
  payload: error,
})

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

export const saveCustomerDetailsRequest = (contacts: UserContactExtended[]) => ({
  type: SHOP_SAVE_CUSTOMER_DETAILS_REQUEST,
  contacts,
})

export const saveCustomerDetailsSuccess = (response: APIResponse) => ({
  type: SHOP_SAVE_CUSTOMER_DETAILS_SUCCESS,
  payload: response,
})

export const saveCustomerDetailsFailure = (error: APIError) => ({
  type: SHOP_SAVE_CUSTOMER_DETAILS_FAILURE,
  payload: error,
})

export const getCustomerOrdersRequest = () => ({
  type: SHOP_GET_CUSTOMER_ORDERS_REQUEST,
})

export const getCustomerOrdersSuccess = (response: APIResponse) => ({
  type: SHOP_GET_CUSTOMER_ORDERS_SUCCESS,
  payload: response,
})

export const getCustomerOrdersFailure = (error: APIError) => ({
  type: SHOP_GET_CUSTOMER_ORDERS_FAILURE,
  payload: error,
})

export const getCountryListRequest = () => ({
  type: SHOP_GET_COUNTRY_LIST_REQUEST,
})

export const getCountryListSuccess = (response: APIResponse) => ({
  type: SHOP_GET_COUNTRY_LIST_SUCCESS,
  payload: response,
})

export const getCountryListFailure = (error: APIError) => ({
  type: SHOP_GET_COUNTRY_LIST_FAILURE,
  payload: error,
})

export const getAmericaStateListRequest = () => ({
  type: SHOP_GET_AMERICA_STATE_LIST_REQUEST,
})

export const getAmericaStateListSuccess = (response: APIResponse) => ({
  type: SHOP_GET_AMERICA_STATE_LIST_SUCCESS,
  payload: response,
})

export const getAmericaStateListFailure = (error: APIError) => ({
  type: SHOP_GET_AMERICA_STATE_LIST_FAILURE,
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

export const updateShopSalesTransactionStatusRequest = (status: string) => ({
  type: SHOP_UPDATE_SALES_TRANSACTION_STATUS_REQUEST,
  status,
})
