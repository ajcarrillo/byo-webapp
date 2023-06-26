import React from 'react'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'

import { ShopBasketItem } from '../../types/shop-types'
import { BasketButton } from '../CustomControls'
import './Shop.css'

interface IShopBasketProductProps {
  basketItem: ShopBasketItem,
  allowQuantityUpdates: boolean,
}

const ShopBasketProduct: React.FC<IShopBasketProductProps> = (props: IShopBasketProductProps) => {
  const { amount, trackers, item, item: {productAddress, productCode, productName, productImages, productPrice} } = props.basketItem
  return (
    <div className='ShopBasketProduct-container'>
      <div className='ShopBasketProduct-image-container'><img src={productImages[0]} alt={productName} /></div>
      <div className='ShopBasketProduct-text-container'>
        <Link to={`/product/${productAddress}`} title={productName}>
          {productName}
        </Link>
        <p>Product code: {productCode}</p>
        <div className='ShopBasketProduct-price-container'>
          <p>{parse(`&euro;${productPrice}`)}</p>
          {props.allowQuantityUpdates ? (
            <BasketButton basketItemCount={amount} product={item} trackers={trackers} size='tiny' />
          ) : (
            <p>Quantity: {amount}</p>
          )}        
        </div>
      </div>
    </div>
  )
}

export default ShopBasketProduct