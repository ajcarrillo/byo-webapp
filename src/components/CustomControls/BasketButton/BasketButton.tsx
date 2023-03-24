import React from 'react'
import { ShopBasketItem, ShopProduct } from '../../../types/shop-types'
import { updateShoppingBasketObservable } from '../../../utils/events'
import './BasketButton.css'

interface IBasketButtonProps {
    selectedProduct: ShopProduct | undefined;
    basketItemCount: number;
  }

export const BasketButton: React.FC<IBasketButtonProps> = (props: IBasketButtonProps) =>{
  const { basketItemCount, selectedProduct } = props

  /**
   * Handles button clicks to update the basket amount
   * @param amount The amount of items that should be in the basket
   */
  const handleClickUpdateBasket = (amount: number) => {
    if(selectedProduct){
      const item: ShopBasketItem = {
        item: selectedProduct,
        amount: amount < 0 ? 0 : amount,
      }
      updateShoppingBasketObservable.next(item)      
    }
  }
    
  return (
    <>
      {basketItemCount > 0 ? (
        <div className = 'BasketButton-container'>
          <button className='Button-standard BasketButton-decrement' onClick={() => handleClickUpdateBasket(basketItemCount - 1)}>-</button>
          <div className='BasketButton-amount'>{basketItemCount}</div>
          <button className='Button-standard BasketButton-increment' onClick={() => handleClickUpdateBasket(basketItemCount + 1)}>+</button>
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