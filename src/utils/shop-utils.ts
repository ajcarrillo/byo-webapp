import { shoppingBasketObservable } from './events'
import { ShopBasketItem } from '../types/shop-types'

export const updateBasket = async (item: ShopBasketItem) => {
  // Stop observable from posting with initial empty object values
  if(!item.item.productAddress) return
  
  const basketItems = getStoredBasketItems()
  let newBasket: ShopBasketItem[] = []
  if(basketItems.length > 0){
    // Item already in basket
    if(basketItems.some(bE => bE.item.productAddress === item.item.productAddress)){
      if(item.amount === 0){
        // remove it
        newBasket = basketItems.filter(b => b.item.productAddress !== item.item.productAddress)
      }else{
        // update the amount
        newBasket = basketItems.map(b => {
          if(b.item.productAddress === item.item.productAddress){
            b.amount = item.amount
          }
          return b
        })
      }      
    }
    // Item not in basket - add it
    else {
      newBasket = [...basketItems, item]
    }
  }else{
    // add it to empty basket
    if(item.amount > 0)
      newBasket = [...basketItems, item]
    else
      newBasket = basketItems
  }

  updateStoredBasketItems(newBasket)  // Local Storage
  shoppingBasketObservable.next(newBasket) // Observable
}

////////////////////////////////////////////////////////////////////////

const updateStoredBasketItems = (items?: ShopBasketItem[]) => {
  if(items)
    window.localStorage.setItem('shop.basketItems', btoa(JSON.stringify(items)))
  else
    window.localStorage.removeItem('shop.basketItems')
}
  
export const getStoredBasketItems = (): ShopBasketItem[] => {
  if(window.localStorage.getItem('shop.basketItems') === null){
    return []
  } else {
    const items = window.localStorage.getItem('shop.basketItems') || ''
    return JSON.parse(atob(items))
  }
}
