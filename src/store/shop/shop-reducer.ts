import * as Constants from './shop-constants'
import { IShopState } from '../../types/shop-types'
import { transformAmericanStatesFromDB, transformCountriesFromDB, transformStripeSalesTransaction } from '../../transformers/shop-transformers'

const initialState = {
  apiError: null,
  productsLoading: false,
  customerDetailsLoading: false,
  countriesLoading: false,
  americanStatesLoading: false,
  salesTransactionLoading: false,
  ordersLoading: false,
  countries: null,
  americanStates: null,
  products: null,
  customerDetails: null,
  basketItems: null,
  salesTransaction: null,
  orders: null,
}

export const shopReducer = (state: IShopState = initialState, action: any) => {
  switch (action.type) {
  case Constants.SHOP_GET_CUSTOMER_ORDERS_REQUEST:
    return { ...state, apiError: null, ordersLoading: true, orders: null }
  case Constants.SHOP_GET_CUSTOMER_ORDERS_SUCCESS:
    return { ...state, apiError: null, ordersLoading: false, orders: action.payload.orders }
  case Constants.SHOP_GET_CUSTOMER_ORDERS_FAILURE:
    return { ...state, apiError: action.payload, ordersLoading: false, orders: null }

  case Constants.SHOP_GET_CUSTOMER_DETAILS_REQUEST:
    return { ...state, apiError: null, customerDetailsLoading: true, customerDetails: null }
  case Constants.SHOP_GET_CUSTOMER_DETAILS_SUCCESS:
    return { ...state, apiError: null, customerDetailsLoading: false, customerDetails: action.payload.customer }
  case Constants.SHOP_GET_CUSTOMER_DETAILS_FAILURE:
    return { ...state, apiError: action.payload, customerDetailsLoading: false, customerDetails: null }

  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_REQUEST:
    return { ...state, apiError: null, customerDetailsLoading: true }
  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_SUCCESS:
    return { ...state, apiError: null, customerDetailsLoading: false, customerDetails: action.payload.customer }
  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_FAILURE:
    return { ...state, apiError: action.payload, customerDetailsLoading: false, customerDetails: null }

  case Constants.SHOP_GET_PRODUCTS_REQUEST:
    return { ...state, apiError: null, productsLoading: true, products: null }
  case Constants.SHOP_GET_PRODUCTS_SUCCESS:
    return { ...state, apiError: null, productsLoading: false, products: action.payload.products }
  case Constants.SHOP_GET_PRODUCTS_FAILURE:
    return { ...state, apiError: action.payload, productsLoading: false, products: null }

  case Constants.SHOP_GET_COUNTRY_LIST_REQUEST:
    return { ...state, apiError: null, countriesLoading: true, countries: null }
  case Constants.SHOP_GET_COUNTRY_LIST_SUCCESS:
    return { ...state, apiError: null, countriesLoading: false, countries: transformCountriesFromDB(action.payload.countries) }
  case Constants.SHOP_GET_COUNTRY_LIST_FAILURE:
    return { ...state, apiError: action.payload, countriesLoading: false, countries: null }

  case Constants.SHOP_GET_AMERICA_STATE_LIST_REQUEST:
    return { ...state, apiError: null, americanStatesLoading: true, americanStates: null }
  case Constants.SHOP_GET_AMERICA_STATE_LIST_SUCCESS:
    return { ...state, apiError: null, americanStatesLoading: false, americanStates: transformAmericanStatesFromDB(action.payload.states) }
  case Constants.SHOP_GET_AMERICA_STATE_LIST_FAILURE:
    return { ...state, apiError: action.payload, americanStatesLoading: false, americanStates: null }

  case Constants.SHOP_CREATE_SALES_TRANSACTION_REQUEST:
    return { ...state, apiError: null, salesTransactionLoading: true, salesTransaction: null }
  case Constants.SHOP_CREATE_SALES_TRANSACTION_SUCCESS:
    return { ...state, apiError: null, salesTransactionLoading: false, salesTransaction: transformStripeSalesTransaction(action.payload.transaction) }
  case Constants.SHOP_CREATE_SALES_TRANSACTION_FAILURE:
    return { ...state, apiError: action.payload, salesTransactionLoading: false, salesTransaction: null }

  case Constants.SHOP_UPDATE_BASKET_REQUEST:
    return { ...state, basketItems: action.payload }

  case Constants.SHOP_UPDATE_SALES_TRANSACTION_STATUS_REQUEST:
    return { ...state, salesTransaction: {...state.salesTransaction, transactionStatus: action.status} }

  case Constants.SHOP_RESET_API_ERRORS:
    return { ...state, apiError: null }

  default:
    return state
  }
}