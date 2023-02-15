import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter, withRouter } from 'react-router-dom'
import { useMobileOrientation } from 'react-device-detect'

import Header from '../Header'
//import Footer from '../Footer';
// Page Containers
import NotFoundPage from '../Pages/NotFound'
import HomePage from '../Pages/Home'
// import UserProfilePage from '../Pages/UserProfile'
// import DashboardPage from '../Pages/Dashboard'
// import CheckoutPage from '../Pages/Checkout'
// import ProfileSettingsPage from '../Pages/ProfileSettings'
import SignInPage from '../Pages/SignIn'
import SignUpPage from '../Pages/SignUp'
import SignOutPage from '../Pages/SignOut'
// import PasswordResetPage from '../Pages/PasswordReset'
import ProteusAppPage from '../Pages/ProteusApp'

import { IStoreState } from '../../../types/store-types'
import { ShoppingBasketItem } from '../../../types/shop-types'

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
// import { updateBasket } from '../../../utils/ShopUtils'
// import { useObservable } from '../../../utils/Hooks'
// import { shoppingBasketObservable, updateShoppingBasketObservable } from '../../../utils/Events'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPageRouterProps {}

const PageRouter: React.FC<IPageRouterProps> = (props: IPageRouterProps) => {
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
  const device = {
    type: getDeviceType(),
    orientation: isLandscape ? 'landscape' : 'portrait',
    os: getOS(),
    osVersion: getOSVersion(),
    browser: getBrowser(),
    browserVersion: getBrowserVersion(),
    mobileMake: getMobileMake(),
    mobileModel: getMobileModel(),
    locale: getLocale()
  }

  const [basketItems, setBasketItems] = useState<ShoppingBasketItem[]>([])
  // useObservable(shoppingBasketObservable, setBasketItems); // gets the basket
  // useObservable(updateShoppingBasketObservable, updateBasket); // updates the baasket

  // Tools Header Config
  const toolsHeaderConfig = {
    tokenIsValid,
    profileType: userProfileType,
    userAddress: address,
    entitlements: userEntitlements,
    basketItemCount: basketItems.length,
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
          <Route path="/sign-up" render={(p) => <SignUpPage {...p} />} />
          <PrivateRoute path="/sign-out" component={SignOutPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/proteus" component={ProteusAppPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          {/* <Route path="/pass-reset" render={(p) => <PasswordResetPage {...p} />} />
          <Route path="/marketplace" render={(p) => <MarketplacePage {...p} />} />
          <PrivateRoute path="/profile/:address" component={UserProfilePage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/dashboard" component={DashboardPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/checkout" component={CheckoutPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/profile-settings" component={ProfileSettingsPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/module-music" component={ModuleMusicPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} /> 
          <PrivateRoute path="/crypto-tools" component={CryptoToolsPage} validToken={tokenIsValid} headerConfig={toolsHeaderConfig} />  */}

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
          ? React.createElement(component, {...props, ...rest}) 
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
