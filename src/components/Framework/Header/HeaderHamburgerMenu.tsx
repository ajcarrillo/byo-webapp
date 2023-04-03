import React from 'react'
import { Link } from 'react-router-dom'

import { MenuItem } from './Header'
import './HeaderHamburgerMenu.css'

interface IHeaderHamburgerMenuProps {
  menuItems: MenuItem[]
}

export const HeaderHamburgerMenu: React.FC<IHeaderHamburgerMenuProps> = (props: IHeaderHamburgerMenuProps) => {
  return (
    <div className='HeaderHamburgerMenu-container'>
      {props.menuItems.map((item, index) => (
        <Link key={index} to={item.url} title={item.title}>
          <div className='HeaderHamburgerMenu-item'>
            <button className='HeaderHamburgerMenu-item-button'>
              <span className='HeaderHamburgerMenu-item-icon'>
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </span>
            </button>
          </div>
        </Link>
      ))}
    </div>
  )
}
