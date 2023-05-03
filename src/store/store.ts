/* istanbul ignore file */

import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import createSagaMiddleware from '@redux-saga/core'

import { authenticationReducer } from './authentication/authentication-reducer'
import { userProfileReducer } from './user-profile/user-profile-reducer'
import { proteusReducer } from './proteus/proteus-reducer'
import { shopReducer } from './shop/shop-reducer'
import { rootSaga } from './root-saga'

const middleware = createSagaMiddleware()

export const store = createStore(combineReducers({
  authentication: authenticationReducer,
  proteus: proteusReducer,
  shop: shopReducer,
  userProfile: userProfileReducer
}), applyMiddleware(middleware))

middleware.run(rootSaga)
