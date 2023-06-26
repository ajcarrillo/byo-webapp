import React, { useCallback, useEffect, useState } from 'react'
import parse from 'html-react-parser'

import { UserContact } from '../../../types/user-types'
import './AdminOrders.css'
import AdminOrderStatus, { OrderStatus } from './AdminOrderStatus'

type AdminOrderItem = {
  billing_address: string,
  delivery_address: string,
  order_items: string,
  order_shipping: string,
  order_status: string,
  order_subtotal: string,
  order_tax: string,
  order_total: string,
  stripe_exchange_rate: number | null,
  stripe_funds_available_timestamp: number | null,
  stripe_processing_fee: string,
  transaction_id: string,
  transaction_status: string,
  transaction_timestamp: number,
}

interface IAdminOrderItemProps {
  order: AdminOrderItem,
  updateOrderStatus: (orderNumber: string, status: OrderStatus) => void
}

const AdminOrderItem: React.FC<IAdminOrderItemProps> = (props: IAdminOrderItemProps) => {
  const { 
    order,
    updateOrderStatus
  } = props 

  const [orderTransformed, setOrderTransformed] = useState<any | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.order_status as OrderStatus)

  const paymentStatuses = [
    {value: 'payment_requested', label: 'Requested'},
    {value: 'payment_processing', label: 'Processing'},
    {value: 'payment_failed', label: 'Declined'},
    {value: 'payment_succeeded', label: 'Paid'},
    {value: 'payment_refunded', label: 'Refunded'},
  ]

  const doUpdateOrderStatus = (orderNumber: string, status: OrderStatus) => {
    setOrderStatus(status)
    updateOrderStatus(orderNumber, status)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolvePaymentStatus = (status: string) => (paymentStatuses.find(o => o.value === status) || {}).label

  /**
   * Returns a localised date from a Unix timestamp
   * @param unixTimestamp Unix timestamp
   * @returns A date - localised
   */
  const dateFromTimestamp = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleDateString()
  }

  /**
   * Generats and address string
   * @param address The address object
   * @return An address string
   */
  const generateAddress = (address: UserContact) => {
    if(address)
      return `${address.addressLine1}<br />${address.addressLine2 ? address.addressLine2 + '<br />' : ''}${address.townCity}<br />${address.regionCounty}<br />${address.zipPostcode}<br />${address.countryCode}`
    else return ''
  }

  /**
   * Transforms a DB order
   */
  const transformOrder = useCallback((order: AdminOrderItem) => {
    const tOrder = {
      billingAddress: JSON.parse(order.billing_address),
      deliveryAddress: JSON.parse(order.delivery_address),
      items: JSON.parse(order.order_items),
      shipping: order.order_shipping,
      subtotal: order.order_subtotal,
      tax: order.order_tax,
      total: order.order_total,
      orderStatus: order.order_status,
      paymentStatus: resolvePaymentStatus(order.transaction_status),
      stripeExchangeRate: order.stripe_exchange_rate ? order.stripe_exchange_rate : 'n/a',
      stripeFundsAvailable: order.stripe_funds_available_timestamp ? dateFromTimestamp(order.stripe_funds_available_timestamp || 0) : 'Not known',
      stripeProcessingFee: order.stripe_processing_fee ? order.stripe_processing_fee : '0.00',
      orderNumber: order.transaction_id,
      orderDate: dateFromTimestamp(order.transaction_timestamp)
    }
    setOrderTransformed(tOrder)
    setOrderStatus(order.order_status as OrderStatus)
  }, [resolvePaymentStatus])

  useEffect(() => {
    if(!orderTransformed) transformOrder(order)
  }, [order, orderTransformed, transformOrder])

  return (
    <div className='AdminOrdersItem-container'>
      <div className='AdminOrdersItem-product-list-container'>
        <h3 style={{marginBottom: '.6rem'}}>Items</h3>
        {orderTransformed && orderTransformed.items.map((p: any) => (
          <div key={p.productCode} className='AdminOrdersItem-product-container'>
            <div className='AdminOrdersItem-product-inner-container'>
              <div className='AdminOrdersItem-summary-item'>
                <p>Product code:</p><p>{p.productCode}</p>
              </div>
              <div className='AdminOrdersItem-summary-item'>
                <p>Quantity:</p><p>{p.productAmount}</p>
              </div>
            </div>
          </div>
        ))}
        <h3 style={{marginBottom: '.6rem'}}>Addresses</h3>
        <div className='AdminOrdersItem-product-inner-container'>
          <div className='AdminOrdersItem-summary-item'  style={{marginBottom: '.6rem'}}>
            <p>Billing:</p><p>{parse(generateAddress(orderTransformed?.billingAddress))}</p>
          </div>
          <div className='AdminOrdersItem-summary-item'>
            <p>Delivery:</p><p>{parse(generateAddress(orderTransformed?.deliveryAddress))}</p>
          </div>
        </div>
      </div>

      <div className='AdminOrdersItem-summay-container'>
        <h3 style={{marginBottom: '.3rem'}}>Details</h3>
        <div className='AdminOrdersItem-summary-item'>
          <p>Order date:</p><p>{orderTransformed?.orderDate}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Order number:</p><p>{orderTransformed?.orderNumber}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Payment status:</p><p>{orderTransformed?.paymentStatus}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Order status:</p>
          <AdminOrderStatus 
            orderNumber={orderTransformed?.orderNumber}
            status={orderStatus} 
            updateStatus={doUpdateOrderStatus}
          />
        </div>

        <h3 style={{marginTop: '1.4rem', marginBottom: '.3rem'}}>Summary</h3>
        <div className='AdminOrdersItem-summary-item'>
          <p>Subtotal:</p><p>{parse(`&euro;${orderTransformed?.subtotal}`)}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Shipping:</p><p>{parse(`&euro;${orderTransformed?.shipping}`)}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Sales Tax:</p><p>{parse(`&euro;${orderTransformed?.tax}`)}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p><strong>Total:</strong></p><p><strong>{parse(`&euro;${orderTransformed?.total}`)}</strong></p>
        </div>

        <h3 style={{marginTop: '1.4rem', marginBottom: '.3rem'}}>Stripe</h3>
        <div className='AdminOrdersItem-summary-item'>
          <p>Processing fee:</p><p>{parse(`&euro;${orderTransformed?.stripeProcessingFee}`)}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Exchange rate:</p><p>{orderTransformed?.stripeExchangeRate}</p>
        </div>
        <div className='AdminOrdersItem-summary-item'>
          <p>Funds available:</p><p>{orderTransformed?.stripeFundsAvailable}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderItem
