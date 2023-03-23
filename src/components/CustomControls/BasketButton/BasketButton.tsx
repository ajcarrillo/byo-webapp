import React, { useEffect, useState } from 'react'
import './BasketButton.css'

interface IBasketButtonProps {
    size: string;
    basketItems: number;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange: Function;
  }

export const BasketButton: React.FC<IBasketButtonProps> = (props: IBasketButtonProps) =>{
  const { size,basketItems,onChange } = props
  const [itemCount,setItemCount] = useState(basketItems)
  const [showIncrementer,setIncrementer] = useState(false)
  const transformButton = (): void => {
    setIncrementer(true)
  }

  useEffect(()=>{
    if(itemCount <= 0){
      setIncrementer(false)
    }
    onChange(itemCount)
  },[itemCount])

  useEffect(()=>{
    if(props.basketItems > itemCount){
      setItemCount(props.basketItems)
      setIncrementer(true)
    }
  },[props.basketItems])

  const addToCount = (): void => {
    setItemCount(itemCount + 1)
  }

  const subtractFromCount = (): void => {
    setItemCount(itemCount - 1)
  }
    
  return (
    <div className='BasketButton-container'>
      {showIncrementer ?(
        <div className = 'BasketButton-count-div'>
          <button className={`BasketButton-standard-left__${size}`} onClick={() => subtractFromCount()}>-</button>
          <span className={`BasketButton-count-span__${size}`}>{itemCount}</span>
          <button className={`BasketButton-standard-right__${size}`} onClick={() => addToCount()}>+</button>
        </div>
      )
        :(
          <button className={`BasketButton-standard__${size}`} onClick={() => transformButton()}>
            Add to basket
          </button>
        )}
    </div>
  )
}

export default BasketButton