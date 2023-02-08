import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Select, { SingleValue } from 'react-select'

// import { updateConnectedWalletAddressRequest, updateConnectedWalletChainIdRequest, updateConnectedWalletRequest } from "../../../store/blockchain/blockchain-actions"
// import { ConnectedWallet } from "../../../types/store-types";
// import { truncateEthereumAddress, blockchainNetworks, connectWallet, requestWalletNetworkChange } from "../../../utils/BlockchainUtils";
// import { reactSelectCustomStyles } from "../../CustomControls/SelectDropdown/custom-styles";
import ByoWaveLogo from '../../../assets/images/byowave-logo-header.png'
import './Header.css'

export interface IHeaderProps {
  tokenIsValid: boolean,
  device: any,
  userAddress: string | null,
  entitlements: any[],
  profileType: string | null,
  basketItemCount: number,
}

type SelectionType = {
  readonly value: string,
  readonly label: string,
};

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { tokenIsValid, userAddress, entitlements, profileType } = props

  const dispatch = useDispatch()

  // const userAccountType = profileType?.split('-')[0];
  const profileAddress = `/profile/${userAddress}`

  const moduleIcons = entitlements.map(mod => {
    return <Link key={`module-icon-${mod.name}`} to={`/module-${mod.name.toLowerCase()}`} title={mod.name}>
      <span className="App-header-icon">
        <i className={`${mod.icon}`}></i>
      </span>
    </Link>
  })

  return (
    <header className="App-header">
      <div className="App-header-icon-container">
        <Link to="/" title="Home">
          <div className="App-header-logo-container">
            <img src={ByoWaveLogo} alt="iYango Logo" style={{width: '100%'}} />
          </div>
        </Link>

        {!tokenIsValid && (
          <>
            {/* <Link to="/sign-up" title="Sign Up">
              <button className='Button-header'>
                <span className="App-header-icon">
                  <i className={'fa-solid fa-arrow-up-from-bracket'}></i>
                  <span>Sign Up</span>
                </span>
              </button>
            </Link> */}

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
                
        {tokenIsValid && (
          <>
            <Link to={profileAddress} title='Profile'>
              <button className='Button-header'>
                <span className='App-header-icon'>
                  <i className={'fa-solid fa-user'}></i>
                  <span>Profile</span>
                </span>
              </button>
            </Link>

            <Link to='/profile-settings' title={'Profile Settings'}>
              <button className='Button-header'>
                <span className="App-header-icon">
                  <i className={'fa-solid fa-user-gear'}></i>
                  <span>Profile Settings</span>
                </span>
              </button>
            </Link>

            <Link to="/dashboard" title="Dashboard">
              <button className='Button-header'>
                <span className="App-header-icon">
                  <i className={'fa-solid fa-rectangle-list'}></i>
                  <span>Dashboard</span>
                </span>
              </button>
            </Link> 

            {moduleIcons}

            <Link to="/checkout" title="Shopping Basket">
              <button className='Button-header'>
                <span className="App-header-icon">
                  <i className={'fa-solid fa-basket-shopping'}></i>
                  <span>Basket</span>
                </span>
              </button>
              {/* {props.basketItemCount > 0 && <div className="App-header-basket-icon-badge">{props.basketItemCount}</div>} */}
            </Link>

            <Link to="/sign-out" title="Sign Out">
              <button className='Button-header'>
                <span className="App-header-icon">
                  <i className={'fa-solid fa-arrow-right-to-bracket'} style={{transform: 'rotate(180deg)'}}></i>
                  <span>Sign Out</span>
                </span>
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
