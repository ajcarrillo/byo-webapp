import { apiCall } from './api-utils'
import { getStoredAccessToken, updateStoredAccessToken } from './user-utils'
import { shoppingBasketObservable } from './events'
import { ShoppingBasketItem } from '../types/shop-types'

export const updateBasket = async (item: ShoppingBasketItem) => {
  // Stop observable from posting with initial empty object values
  if(!item.itemAddress) return

  const token = getStoredAccessToken().accesToken
  const response = await apiCall(
    `${process.env.REACT_APP_API_BASE_URL}/shop/basket/items/update`,
    'POST',
    token,
    item,
    'json'
  )

  if(response.status === 200){
    shoppingBasketObservable.next(response.data.basketItems)
    updateStoredBasketItems(response.data.basketItems)
  }
  else 
  {
    if(response.status === 401) updateStoredAccessToken('', false)
    console.log(response)
  }
}

////////////////////////////////////////////////////////////////////////

export const isItemInLocalBasket = (
  item: {
    category: string,
    subCategory: string,
    address: string
  }
) => {
  const basketItems = getStoredBasketItems()

  return basketItems.some((i: ShoppingBasketItem) => {
    return i.itemCategory === item.category && i.itemSubCategory === item.subCategory && i.itemAddress === item.address
  })
}

const updateStoredBasketItems = (items?: ShoppingBasketItem[]) => {
  if(items)
    window.localStorage.setItem('shop.basketItems', btoa(JSON.stringify(items)))
  else
    window.localStorage.removeItem('shop.basketItems')
}
  
export const getStoredBasketItems = (): ShoppingBasketItem[] => {
  if(window.localStorage.getItem('shop.basketItems') === null){
    return []
  } else {
    const items = window.localStorage.getItem('shop.basketItems') || ''
    return JSON.parse(atob(items))
  }
}
