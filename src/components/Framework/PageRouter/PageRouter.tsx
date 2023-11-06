import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter, withRouter } from 'react-router-dom'
import { useMobileOrientation } from 'react-device-detect'
import { useMediaQuery } from 'react-responsive'

import Header from '../Header'
//import Footer from '../Footer'

// Page Containers
import AccessibilityPage from '../Pages/Accessibility'
import AdminPage from '../Pages/Admin'
import BasketPage from '../Pages/Basket'
import CheckoutPage from '../Pages/Checkout'
import CommunityPage from '../Pages/Community'
import DownloadsPage from '../Pages/Downloads'
import HomePage from '../Pages/Home'
import NotFoundPage from '../Pages/NotFound'
import OrdersPage from '../Pages/Orders'
import PasswordResetPage from '../Pages/PasswordReset'
import ProductPage from '../Pages/Product'
import ProteusAppPage from '../Pages/ProteusApp'
import ShopGroupPage from '../Pages/ShopGroup'
import ShopPage from '../Pages/Shop'
import SignInPage from '../Pages/SignIn'
import SignOutPage from '../Pages/SignOut'
import SignUpPage from '../Pages/SignUp'
import UserProfilePage from '../Pages/UserProfile'
import UserSettingsPage from '../Pages/UserSettings'
import StyleGuidePage from '../Pages/StyleGuide'

import { IStoreState } from '../../../types/store-types'
import { ShopBasketItem } from '../../../types/shop-types'
import { UserDeviceType } from '../../../types/global-types'
import {
  getStoredAccessToken,
  isAccessTokenValid,
  getStoredUserAddress,
  getStoredUserEntitlements,
  getStoredUserProfileType
} from '../../../utils/user-utils'
import {
  getDeviceType,
  getOS,
  getOSVersion,
  getBrowser,
  getBrowserVersion,
  getMobileMake,
  getMobileModel,
  getLocale
} from '../../../utils/device-utils'
import { updateBasket } from '../../../utils/shop-utils'
import { useObservable } from '../../../utils/hooks'
import { shoppingBasketObservable, updateShoppingBasketObservable } from '../../../utils/events'
import { updateShopBasketRequest } from '../../../store/shop/shop-actions'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPageRouterProps { }

const PageRouter: React.FC<IPageRouterProps> = (props: IPageRouterProps) => {
  const dispatch = useDispatch()
  const {
    authentication: {
      accessTokenValid,
      userAddress
    }
  } = useSelector<IStoreState, IStoreState>((state) => state)

  const storedAccessToken = getStoredAccessToken()
  const tokenIsValid = isAccessTokenValid(accessTokenValid, storedAccessToken)
  const address = userAddress || getStoredUserAddress()
  const userEntitlements = tokenIsValid ? getStoredUserEntitlements() : []
  const userProfileType = tokenIsValid ? getStoredUserProfileType() : ''

  const { isLandscape } = useMobileOrientation()
  const device: UserDeviceType = {
    type: getDeviceType(),
    orientation: isLandscape ? 'landscape' : 'portrait',
    os: getOS(),
    osVersion: getOSVersion(),
    browser: getBrowser(),
    browserVersion: getBrowserVersion(),
    mobileMake: getMobileMake(),
    mobileModel: getMobileModel(),
    locale: getLocale(),
    isSmallScreen: useMediaQuery({ query: '(max-width: 480px)' }),
  }

  const [basketItems, setBasketItems] = useState<ShopBasketItem[]>([])
  useObservable(shoppingBasketObservable, setBasketItems) // gets the basket
  useObservable(updateShoppingBasketObservable, updateBasket) // updates the baasket
  useEffect(() => {
    if (basketItems)
      dispatch(updateShopBasketRequest(basketItems))  // Redux Store
  }, [basketItems, dispatch])

  // Tools Header Config
  const toolsHeaderConfig = {
    tokenIsValid,
    profileType: userProfileType,
    userAddress: address,
    entitlements: userEntitlements,
    basketItemCount: basketItems.length > 0 ? basketItems.map(item => item.amount).reduce((prev, next) => prev + next) : 0,
    device,
  }

  const HeaderWithRoute = withRouter((routeProps) => <Header {...toolsHeaderConfig} routeProps={routeProps} />)

  return (
    <BrowserRouter>
      <>
        <HeaderWithRoute />
        <Switch>
          <Route exact path="/" render={(p: any) => <HomePage {...p} />} />
          <Route path="/home" component={HomePage} />
          <Route path="/sign-in" render={(p) => <SignInPage {...p} tokenIsValid={tokenIsValid} />} />
          <Route path="/sign-up" render={(p) => <SignUpPage {...p} locale={toolsHeaderConfig.device.locale} />} />
          <Route path="/pass-reset" render={(p) => <PasswordResetPage {...p} />} />
          <Route path="/shop" render={(p) => <ShopPage {...p} />} />
          <Route path="/basket" render={(p) => <BasketPage {...p} tokenIsValid={tokenIsValid} />} />
          <Route path="/checkout" render={(p) => <CheckoutPage {...p} tokenIsValid={tokenIsValid} />} />
          <Route path="/downloads" render={(p) => <DownloadsPage {...p} tokenIsValid={tokenIsValid} />} />
          <Route path="/product/:address" render={(p) => <ProductPage {...p} />} />
          <Route path="/shop-group/:address" render={(p) => <ShopGroupPage {...p} />} />
          <Route path="/accessibility" render={(p) => <AccessibilityPage {...p} />} />
          <Route path="/style-guide" component={StyleGuidePage} />
          <PrivateRoute path="/profile/:address" component={UserProfilePage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/settings" component={UserSettingsPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/sign-out" component={SignOutPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/proteus" component={ProteusAppPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/orders" component={OrdersPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/community" component={CommunityPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <PrivateRoute path="/admin" component={AdminPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />
          <Route path="/404" component={(p: any) => <NotFoundPage {...p} />} />
          <Redirect from='*' to='/404' />
        </Switch>
        {/* <Footer /> */}
      </>
    </BrowserRouter>
  )
}

const PrivateRoute = ({
  component, validToken, ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        validToken === true
          ? React.createElement(component, { ...props, ...rest })
          : (
            <Redirect to={{
              pathname: '/sign-in',
              state: { from: props.location },
            }}
            />
          )
      )}
    />
  )
}

export default PageRouter
