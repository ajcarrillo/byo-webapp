import * as Constants from './shop-constants'
import { IShopState } from '../../types/shop-types'
import { transformCountriesFromDB } from '../../transformers/shop-transformers'

const initialState = {
  apiError: null,
  productsLoading: false,
  customerDetailaLoading: false,
  countriesLoading: false,
  countries: null,
  products: null,
  customerDetails: null,
  basketItems: null,
}

export const shopReducer = (state: IShopState = initialState, action: any) => {
  switch (action.type) {
  case Constants.SHOP_GET_CUSTOMER_DETAILS_REQUEST:
    return { ...state, apiError: null, customerDetailaLoading: true, customerDetails: null }
  case Constants.SHOP_GET_CUSTOMER_DETAILS_SUCCESS:
    return { ...state, apiError: null, customerDetailaLoading: false, customerDetails: action.payload.customer }
  case Constants.SHOP_GET_CUSTOMER_DETAILS_FAILURE:
    return { ...state, apiError: action.payload, customerDetailaLoading: false, customerDetails: null }

  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_REQUEST:
    return { ...state, apiError: null, customerDetailaLoading: true }
  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_SUCCESS:
    return { ...state, apiError: null, customerDetailaLoading: false, customerDetails: action.payload.customer }
  case Constants.SHOP_SAVE_CUSTOMER_DETAILS_FAILURE:
    return { ...state, apiError: action.payload, customerDetailaLoading: false, customerDetails: null }

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

  case Constants.SHOP_UPDATE_BASKET_REQUEST:
    return { ...state, basketItems: action.payload }

  case Constants.SHOP_RESET_API_ERRORS:
    return { ...state, apiError: null }

  default:
    return state
  }
}