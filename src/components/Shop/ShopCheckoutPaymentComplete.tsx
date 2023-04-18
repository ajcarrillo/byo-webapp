import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as _ from 'lodash'

import { ShopBasketItem } from '../../types/shop-types'
import { OrdersItem } from '../../types/orders-types'
import { getCustomerOrdersRequest } from '../../store/shop/shop-actions'
import { updateShoppingBasketObservable } from '../../utils/events'
import ShopCheckoutPaymentStatus from './ShopCheckoutPaymentStatus'
import { OrdersListItem } from '../Orders'
import './Shop.css'

interface IShopCheckoutPaymentCompleteProps {
  updateCheckoutStage: (stage: string) => void,
  stripeClientSecret: string,
  transactionId: string,
  basketItems: ShopBasketItem[],
  orders: OrdersItem[] | null,
  ordersLoading: boolean,
}

const ShopCheckoutPaymentComplete: React.FC<IShopCheckoutPaymentCompleteProps> = (props: IShopCheckoutPaymentCompleteProps) => {
  const dispatch = useDispatch()
  const { 
    updateCheckoutStage,
    stripeClientSecret,
    basketItems,
    transactionId,
    orders,
    ordersLoading
  } = props

  const [payStatus, setPayStatus] = useState('')
  const [orderItems, setOrderItems] = useState<ShopBasketItem[]>([])

  const loadCustomerOrders = useCallback(() => {
    if(!ordersLoading) dispatch(getCustomerOrdersRequest())
  }, [dispatch, ordersLoading])

  /**
   * Removes basket items when payment status succeeds or is processing
   */
  const removeSoldBasketItems = useCallback(async (items: ShopBasketItem[]) => {
    for(let i = 0; i < items.length; i++){
      updateShoppingBasketObservable.next({
        item: {
          productAddress: items[i].item.productAddress,
          productCode: items[i].item.productCode,
          productName: items[i].item.productName,
          productDescription: items[i].item.productDescription,
          productPrice: items[i].item.productPrice,
          productImages: items[i].item.productImages, 
          productDispatchTime: items[i].item.productDispatchTime,
        },
        amount: 0
      })
      await sleep(200)
    }
  }, [])

  useEffect(() => {
    if(payStatus === 'Succeeded' || payStatus === 'Processing'){
      if(orderItems.length === 0) setOrderItems(_.cloneDeep(basketItems))

      removeSoldBasketItems(basketItems)

      if(!orders) loadCustomerOrders()
    }
  }, [basketItems, loadCustomerOrders, orderItems.length, orders, payStatus, removeSoldBasketItems])

  /**
   * Sleeps for <time> milliseconds
   * @param time 
   * @returns 
   */
  const sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  return (
    <div className='ShopPaymentComplete-container'>

      <div>
        {payStatus === 'Failed' ? (
          <div className='PaymentComplete-error-message-container'>
            <i className='fa-solid fa-face-rolling-eyes'></i>
            <div>
              <h2>Aww</h2>
              <p>Unfortunately your payment failed. Please try a different payment method.</p>
              <button 
                className='Button-standard' 
                title='Back to Payment' 
                onClick={() => updateCheckoutStage('payment')} 
              >
                Back to Payment
              </button>
            </div>
          </div>
        ) : (
          <>
            {payStatus === 'Processing' ? (
              <div className='PaymentComplete-success-message-container'>
                <i className='fa-solid fa-face-smile-wink'></i>
                <div>
                  <h2>So..</h2>
                  <p>Your payment is showing a status of <strong>processing</strong>. This could be due to your bank taking time to process your payment. Until we receive confirmation from your bank that payment has been made, we cannot ship your purchase items. Please check the orders page for updates.</p>
                  <Link to="/orders" title="Orders">
                    <button 
                      className='Button-standard' 
                      title='My Orders' 
                    >
                      My Orders
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className='PanelAlert ShopPaymentComplete-success-container'>
                  <i className='fa-solid fa-face-grin-tongue-wink'></i>
                  <div style={{paddingLeft: '1rem'}}>
                    <h2>Boo-ya</h2>
                    <p style={{marginTop: '.4rem'}}>Thank you so much for your order, which is listed below. See you again soon!</p>
                  </div>
                </div>

                <div className='FadeInAfterDelay' style={{opacity: 0}}>
                  <OrdersListItem 
                    order={orders?.find(o => o.orderTransactionId === transactionId)}
                  />
                </div>

                <div style={{marginTop: '2rem'}}>
                  <Link to="/orders" title="Your Orders">
                    <button 
                      className='Button-standard' 
                      title='Your Orders' 
                    >
                      Your Orders
                    </button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <ShopCheckoutPaymentStatus stripeClientSecret={stripeClientSecret} updatePayStatus={setPayStatus} />
    </div>
  )
}

export default ShopCheckoutPaymentComplete