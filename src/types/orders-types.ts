import { Modify } from './global-types'
import { ShopCheckoutSummary, ShopProduct } from './shop-types'
import { UserContact } from './user-types'

export type OrdersItem = {
  products: OrdersProductItem[],
  paymentStatus: 'Pending' | 'Processing' | 'Failed' | 'Paid' | 'Refunded',
  orderStatus: 'Processing' | 'Dispatched' | 'Returned' | 'Refunded',
  orderDate: string,
  orderTransactionId: string,
  orderPaymentSummary: ShopCheckoutSummary,
  deliveryAddress: UserContact
}

export type OrdersProductItem = Modify<ShopProduct, {
  amount: string
}>
