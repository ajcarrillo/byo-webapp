import { BehaviorSubject } from 'rxjs'

import { ShoppingBasketItem } from '../types/shop-types'
import { getStoredBasketItems } from './shop-utils'

export const filesUploadProgress = new BehaviorSubject<any>({
  isUploading: false,
  progress: 0,
})

export const shoppingBasketObservable = new BehaviorSubject<ShoppingBasketItem[]>(
  getStoredBasketItems()
)

export const updateShoppingBasketObservable = new BehaviorSubject<ShoppingBasketItem>({
  sellerAddress: '',
  itemCategory: '',
  itemSubCategory: '',
  itemParentAddress: '',
  itemAddress: '',
  itemName: '',
  itemImage: '',
  itemPriceCurrency: '',
  itemPriceMoney: '0',
  itemPriceYango: '0',
  amount: '0',
  payWith: ''
})