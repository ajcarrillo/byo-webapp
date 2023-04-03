import { BehaviorSubject } from 'rxjs'

import { ShopBasketItem } from '../types/shop-types'
import { getStoredBasketItems } from './shop-utils'

export const filesUploadProgress = new BehaviorSubject<any>({
  isUploading: false,
  progress: 0,
})

export const shoppingBasketObservable = new BehaviorSubject<ShopBasketItem[]>(
  getStoredBasketItems()
)

export const updateShoppingBasketObservable = new BehaviorSubject<ShopBasketItem>({
  item: {
    productAddress: '',
    productCode: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productImages: [], 
    productDispatchTime: '',
  },
  amount: 0
})
