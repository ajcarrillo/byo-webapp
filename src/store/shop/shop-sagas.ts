import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { 
  getStoredAccessToken,
  updateStoredAccessToken
} from '../../utils/user-utils'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { getCustomerDetailsFailure, getCustomerDetailsSuccess, getShopProductsFailure, getShopProductsSuccess } from './shop-actions'
import { 
  SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES,
  SHOP_GET_CUSTOMER_DETAILS_REQUEST,
  SHOP_GET_PRODUCTS_API_ERROR_MESSAGES, 
  SHOP_GET_PRODUCTS_REQUEST 
} from './shop-constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getShopProductsSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/shop/products`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      yield put(getShopProductsSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getShopProductsFailure(generateApiError('shop/getShopProductsSaga', response, SHOP_GET_PRODUCTS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getShopProductsFailure(generateApiError('shop/getShopProductsSaga', undefined, SHOP_GET_PRODUCTS_API_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getShopCustomerDetailsSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/shop/customer/details`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      yield put(getCustomerDetailsSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getCustomerDetailsFailure(generateApiError('shop/getCustomerDetailsSaga', response, SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getCustomerDetailsFailure(generateApiError('shop/getCustomerDetailsSaga', undefined, SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
  }
}

export function* getShopProductsSagaWatcher(){
  yield takeLatest(SHOP_GET_PRODUCTS_REQUEST, getShopProductsSaga)
}

export function* getShopCustomerDetailsSagaWatcher(){
  yield takeLatest(SHOP_GET_CUSTOMER_DETAILS_REQUEST, getShopCustomerDetailsSaga)
}