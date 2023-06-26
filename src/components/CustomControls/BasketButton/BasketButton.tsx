import React from 'react'

import { ShopBasketItem, ShopProduct, ShopSaleTracker } from '../../../types/shop-types'
import { updateShoppingBasketObservable } from '../../../utils/events'
import './BasketButton.css'

interface IBasketButtonProps {
    size: string,
    product: ShopProduct | undefined;
    basketItemCount: number;
    trackers: ShopSaleTracker[]
  }

export const BasketButton: React.FC<IBasketButtonProps> = (props: IBasketButtonProps) =>{
  const { basketItemCount, product, size, trackers } = props

  /**
   * Handles button clicks to update the basket amount
   * @param amount The amount of items that should be in the basket
   */
  const handleClickUpdateBasket = (amount: number) => {
    if(product){
      const item: ShopBasketItem = {
        item: product,
        amount: amount < 0 ? 0 : amount,
        trackers,
      }
      updateShoppingBasketObservable.next(item)      
    }
  }
    
  return (
    <>
      {basketItemCount > 0 ? (
        <div className = 'BasketButton-container'>
          <button className={`Button-standard BasketButton-decrement__${size}`} onClick={() => handleClickUpdateBasket(basketItemCount - 1)}>-</button>
          <div className={`BasketButton-amount__${size}`}>{basketItemCount}</div>
          <button className={`Button-standard BasketButton-increment__${size}`} onClick={() => handleClickUpdateBasket(basketItemCount + 1)}>+</button>
        </div>
      ) : (
        <button className='Button-standard' onClick={() => handleClickUpdateBasket(1)}>
          Add to basket
        </button>
      )}
    </>
  )
}

export default BasketButton