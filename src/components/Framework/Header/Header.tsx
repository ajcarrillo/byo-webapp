import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserDeviceType } from '../../../types/global-types'
import { getBurgerMenuItems } from '../../../utils/header-utils'
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
  const { device: { isSmallScreen, browser }, tokenIsValid, userAddress, entitlements, routeProps } = props
  const [burgerOpen, setBurgerOpen] = useState(false)
  const [burgerMenuItems, setBurgerMenuItems] = useState<MenuItem[]>([])
  const moduleIcons = entitlements.map(mod => {
    return <Link key={`module-icon-${mod.name}`} to={`/module-${mod.name.toLowerCase()}`} title={mod.name}>
      <span className="App-header-icon">
        <i className={`${mod.icon}`}></i>
      </span>
    </Link>
  })
  const bT = useRef<NodeJS.Timeout | undefined>()
  
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
    bT.current = setTimeout(() => {
      setBurgerOpen(false)
    }, 200)
  }
  useEffect(() => {
    return () => clearTimeout(bT.current)
  }, [])

  /**
   * Creates the burger menu item
   */
  useEffect(() => {
    const items = getBurgerMenuItems(tokenIsValid, isSmallScreen, userAddress, browser)
    setBurgerMenuItems(items)
  }, [isSmallScreen, tokenIsValid, userAddress, browser])

  /**
   * Hide menu from the Proteus app
   */
  if(routeProps.location.pathname === '/proteus' || routeProps.location.pathname === '/proteus/'){
    return null
  }

  return (
    <>
      <header className="App-header">
        <Link to="/" title="Home">
          <div className="App-header-logo-container">
            <img src={ByoWaveLogo} alt="Byowave Logo" style={{width: '100%'}} />
          </div>
        </Link>

        <div className="App-header-icon-container">
          {isSmallScreen ? (
            <>
              <span>&nbsp;</span>
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
              <div className="App-header-icon-layout">
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

              <div className="App-header-icon-layout">
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
        </div>
      </header>

      {burgerOpen && 
        <HeaderHamburgerMenu menuItems={burgerMenuItems} />
      }
    </>
  )
}
