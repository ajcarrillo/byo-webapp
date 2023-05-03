import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserDeviceType } from '../../../types/global-types'
import { HeaderHamburgerMenu } from './HeaderHamburgerMenu'
import ByoWaveLogo from '../../../assets/images/byowave-logo-header.png'
import './Header.css'

export interface IHeaderProps {
  tokenIsValid: boolean,
  device: UserDeviceType,
  userAddress: string | null,
  entitlements: any[],
  profileType: string | null,
  basketItemCount: number,
  routeProps: any,
}

export type MenuItem = {
  url: string,
  icon: string,
  title: string
}

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { tokenIsValid, userAddress, entitlements, routeProps } = props
  const [burgerOpen, setBurgerOpen] = useState(false)
  const [burgerMenuItems, setBurgerMenuItems] = useState<MenuItem[]>([])
  const moduleIcons = entitlements.map(mod => {
    return <Link key={`module-icon-${mod.name}`} to={`/module-${mod.name.toLowerCase()}`} title={mod.name}>
      <span className="App-header-icon">
        <i className={`${mod.icon}`}></i>
      </span>
    </Link>
  })
  
  /**
   * Click handler to open/close the burger menu
   */
  const handleClickBurgerMenu = () => {
    setBurgerOpen((prev) => {
      return !prev
    })
  }

  /**
   * OnBlur event handler to close the burger menu
   */
  const closeBurgerMenu = () => {
    setTimeout(() => {
      setBurgerOpen(false)
    }, 200)
  }

  /**
   * Creates the burger menu item
   */
  const updateBurgerMenuItems = useCallback(() => {
    const items: MenuItem[] = [
      {url: `/profile/${userAddress}`, title: 'Profile', icon: 'fa-solid fa-user'},
      {url: '/profile-settings', title: 'Profile Settings', icon: 'fa-solid fa-user-gear'},
      {url: '/orders', title: 'Orders', icon: 'fa-solid fa-truck-fast'},
      {url: '/sign-out', title: 'Sign Out', icon: 'fa-solid fa-arrow-right-to-bracket'},
    ]
    setBurgerMenuItems(items)
  }, [userAddress])

  useEffect(() => {
    if(burgerMenuItems.length === 0)
      updateBurgerMenuItems()
  }, [burgerMenuItems.length, updateBurgerMenuItems])

  useEffect(() => {
    if(props.device.isSmallScreen)
    {
      let items: MenuItem[]
      if(tokenIsValid)
      {
        items = [
          {url: '/accessibility', title: 'Accessibility', icon: 'fa-solid fa-palette'},
          {url: '/shop', title: 'Shop', icon: 'fa-solid fa-cart-shopping'},
          {url: '/orders', title: 'Orders', icon: 'fa-solid fa-truck-fast'},
          {url: '/basket', title: 'Basket', icon: 'fa-solid fa-basket-shopping'},
          {url: `/profile/${userAddress}`, title: 'Profile', icon: 'fa-solid fa-user'},
          {url: '/profile-settings', title: 'Profile Settings', icon: 'fa-solid fa-user-gear'},
          {url: '/sign-out', title: 'Sign Out', icon: 'fa-solid fa-arrow-right-to-bracket'},
        ]
      }
      else
      {
        items = [
          {url: '/shop', title: 'Shop', icon: 'fa-solid fa-cart-shopping'},
          {url: '/accessibility', title: 'Accessibility', icon: 'fa-solid fa-palette'},
          {url: '/basket', title: 'Basket', icon: 'fa-solid fa-basket-shopping'},
          {url: '/sign-up', title: 'Sign Up', icon: 'fa-solid fa-user'},
          {url: '/sign-in', title: 'Sign In', icon: 'fa-solid fa-arrow-right-to-bracket'},
        ]
      }
      setBurgerMenuItems(items)
    }
  }, [props.device.isSmallScreen,tokenIsValid,userAddress])

  /**
   * Hide menu from the Proteus app
   */
  if(routeProps.location.pathname === '/proteus' || routeProps.location.pathname === '/proteus/'){
    return null
  }

  return (
    <>
      <header className="App-header">
        {props.device.isSmallScreen ? (
          <>
            <div className="App-header-icon-container">
              <Link to="/" title="Home">
                <div className="App-header-logo-container">
                  <img src={ByoWaveLogo} alt="Byowave Logo" style={{width: '100%'}} />
                </div>
              </Link>
            </div>
            <button 
              className='Button-header' 
              onPointerDown ={() => handleClickBurgerMenu()}
              onBlur={() => closeBurgerMenu()}
            >
              <span className="App-header-icon">
                <i className={'fa-solid fa-bars'}></i>
              </span>
            </button>
          </>
        ):(
          <>
            <div className="App-header-icon-container">
              <Link to="/" title="Home">
                <div className="App-header-logo-container">
                  <img src={ByoWaveLogo} alt="Byowave Logo" style={{width: '100%'}} />
                </div>
              </Link>
              <Link to="/shop" title="Shop">
                <button className='Button-header'>
                  <span className="App-header-icon">
                    <i className={'fa-solid fa-cart-shopping'}></i>
                    <span>Shop</span>
                  </span>
                </button>
              </Link>
              <Link to="/accessibility" title="Accessibility">
                <button className='Button-header'>
                  <span className="App-header-icon">
                    <i className={'fa-solid fa-palette'}></i>
                    <span>Accessibility</span>
                  </span>
                </button>
              </Link>
              {tokenIsValid && (
                <>
                  {moduleIcons}
                </>
              )}
            </div>
            <div className="App-header-icon-container">
              <Link to="/basket" title="Shopping Basket">
                <div style={{position: 'relative'}}>
                  <button className='Button-header'>
                    <span className="App-header-icon">
                      <i className={'fa-solid fa-basket-shopping'}></i>
                      <span>Basket</span>
                    </span>
                  </button>
                  {props.basketItemCount > 0 && <div className="App-header-basket-icon-badge">{props.basketItemCount}</div>}            
                </div>
              </Link>
              {tokenIsValid ? (
                <button 
                  className='Button-header' 
                  onClick={() => handleClickBurgerMenu()}
                  onBlur={() => closeBurgerMenu()}
                >
                  <span className="App-header-icon">
                    <i className={'fa-solid fa-bars'}></i>
                  </span>
                </button>
              ) : (
                <>
                  <Link to="/sign-up" title="Sign Up">
                    <button className='Button-header'>
                      <span className="App-header-icon">
                        <i className={'fa-solid fa-user'}></i>
                        <span>Sign Up</span>
                      </span>
                    </button>
                  </Link>
                  <Link to="/sign-in" title="Sign In">
                    <button className='Button-header'>
                      <span className="App-header-icon">
                        <i className={'fa-solid fa-arrow-right-to-bracket'}></i>
                        <span>Sign In</span>
                      </span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </header>
      {burgerOpen && 
        <HeaderHamburgerMenu menuItems={burgerMenuItems} />
      }
    </>
  )
}
