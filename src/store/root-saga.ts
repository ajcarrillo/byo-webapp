/* istanbul ignore file */
import { fork } from '@redux-saga/core/effects'

import { 
  getUserSagaWatcher,
  saveUserDetailsSagaWatcher,
  signInSagaWatcher, 
  signUpSagaWatcher, 
  resendEmailSagaWatcher, 
  confirmEmailSagaWatcher,
  rquestPasswordResetSagaWatcher,
  changePasswordSagaWatcher
} from './authentication/authentication-sagas'
import { 
  getProteusModulesSagaWatcher,
  connectControllerSagaWatcher,
  getProteusSettingsSagaWatcher,
  getControllerConfigSagaWatcher,
  setUnityReadySagaWatcher,
  setGamepadReadySagaWatcher,
  setMappingModeSagaWatcher,
  getProteusGalleryItemsSagaWatcher,
  appendGalleryItemSagaWatcher
} from './proteus/proteus-sagas'
import { 
  createSalesTransactionSagaWatcher,
  getShopAmericanStateListSagaWatcher,
  getShopCountryListSagaWatcher,
  getShopCustomerDetailsSagaWatcher, 
  getShopCustomerOrdersSagaWatcher, 
  getShopProductsSagaWatcher, 
  saveShopCustomerDetailsSagaWatcher
} from './shop/shop-sagas'

export function* rootSaga(){
  yield fork(getUserSagaWatcher)
  yield fork(saveUserDetailsSagaWatcher)
  yield fork(signInSagaWatcher)
  yield fork(signUpSagaWatcher)
  yield fork(resendEmailSagaWatcher)
  yield fork(confirmEmailSagaWatcher)
  yield fork(rquestPasswordResetSagaWatcher)
  yield fork(changePasswordSagaWatcher)
  yield fork(getProteusModulesSagaWatcher)
  yield fork(connectControllerSagaWatcher)
  yield fork(getProteusSettingsSagaWatcher)
  yield fork(getControllerConfigSagaWatcher)
  yield fork(setUnityReadySagaWatcher)
  yield fork(setGamepadReadySagaWatcher)
  yield fork(setMappingModeSagaWatcher)
  yield fork(getProteusGalleryItemsSagaWatcher)
  yield fork(appendGalleryItemSagaWatcher)
  yield fork(getShopProductsSagaWatcher)
  yield fork(getShopCustomerDetailsSagaWatcher)
  yield fork(getShopCustomerOrdersSagaWatcher)
  yield fork(getShopCountryListSagaWatcher)
  yield fork(getShopAmericanStateListSagaWatcher)
  yield fork(saveShopCustomerDetailsSagaWatcher)
  yield fork(createSalesTransactionSagaWatcher)
}
