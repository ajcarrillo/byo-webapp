import { call, put, takeLatest } from 'redux-saga/effects'

import { APIResponse } from '../../types/api-types'
import { 
  getStoredAccessToken,
  updateStoredAccessToken
} from '../../utils/user-utils'
import { apiCall } from '../../utils/api-utils'
import { generateApiError } from '../../utils/error-utils'
import { 
  getCountryListFailure, 
  getCountryListSuccess, 
  getCustomerDetailsFailure, 
  getCustomerDetailsSuccess, 
  getShopProductsFailure, 
  getShopProductsSuccess, 
  saveCustomerDetailsFailure, 
  saveCustomerDetailsSuccess
} from './shop-actions'
import { 
  SHOP_GET_COUNTRY_LIST_API_ERROR_MESSAGES,
  SHOP_GET_COUNTRY_LIST_REQUEST,
  SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES,
  SHOP_GET_CUSTOMER_DETAILS_REQUEST,
  SHOP_GET_PRODUCTS_API_ERROR_MESSAGES, 
  SHOP_GET_PRODUCTS_REQUEST, 
  SHOP_SAVE_CUSTOMER_DETAILS_API_ERROR_MESSAGES,
  SHOP_SAVE_CUSTOMER_DETAILS_REQUEST
} from './shop-constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* getShopCountryListSaga(action: any){
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/shop/countries`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      yield put(getCountryListSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(getCountryListFailure(generateApiError('shop/getShopCountryListSaga', response, SHOP_GET_COUNTRY_LIST_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getCountryListFailure(generateApiError('shop/getShopCountryListSaga', undefined, SHOP_GET_COUNTRY_LIST_API_ERROR_MESSAGES)))
  }
}

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
      yield put(getCustomerDetailsFailure(generateApiError('shop/getShopCustomerDetailsSaga', response, SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(getCustomerDetailsFailure(generateApiError('shop/getShopCustomerDetailsSaga', undefined, SHOP_GET_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function* saveShopCustomerDetailsSaga(action: any){
  const token = getStoredAccessToken().accesToken
  try {
    const response: APIResponse = yield call(
      apiCall, 
      `${process.env.REACT_APP_API_BASE_URL}/shop/customer/details`,
      'POST',
      token,
      {contactDetails: action.contacts},
      'json'
    )

    if(response.status === 200){
      yield put(saveCustomerDetailsSuccess(response.data))
    }
    else {
      if(response.status === 401) updateStoredAccessToken('', false)
      yield put(saveCustomerDetailsFailure(generateApiError('shop/saveShopCustomerDetailsSaga', response, SHOP_SAVE_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
    }
  } 
  catch(e) {
    yield put(saveCustomerDetailsFailure(generateApiError('shop/saveShopCustomerDetailsSaga', undefined, SHOP_SAVE_CUSTOMER_DETAILS_API_ERROR_MESSAGES)))
  }
}

export function* getShopProductsSagaWatcher(){
  yield takeLatest(SHOP_GET_PRODUCTS_REQUEST, getShopProductsSaga)
}

export function* getShopCustomerDetailsSagaWatcher(){
  yield takeLatest(SHOP_GET_CUSTOMER_DETAILS_REQUEST, getShopCustomerDetailsSaga)
}

export function* saveShopCustomerDetailsSagaWatcher(){
  yield takeLatest(SHOP_SAVE_CUSTOMER_DETAILS_REQUEST, saveShopCustomerDetailsSaga)
}

export function* getShopCountryListSagaWatcher(){
  yield takeLatest(SHOP_GET_COUNTRY_LIST_REQUEST, getShopCountryListSaga)
}

