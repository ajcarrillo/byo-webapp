import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IStoreState } from '../../types/store-types'
import { getCustomerOrdersRequest } from '../../store/shop/shop-actions'
import OrdersListItem from './OrdersListItem'
import Spinner from '../Spinner'
import './Orders.css'

interface IOrdersContainerProps {
  tokenIsValid: boolean,
}

const OrdersContainer: React.FC<IOrdersContainerProps> = (props: IOrdersContainerProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const loadOrders = useCallback(() => {
    dispatch(getCustomerOrdersRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!shop.orders && !shop.ordersLoading){
      loadOrders()
    }
  }, [loadOrders, shop.orders, shop.ordersLoading])

  return (
    <>
      {(shop.ordersLoading) && (
        <Spinner />
      )}

      <div className='Orders-container'>
        {shop.orders?.length === 0 ? (
          <div className='Orders-empty-container'>
            <div className='Orders-empty-leftCol'>
              <i className="fa-solid fa-face-sad-tear"></i>
            </div>
            <div className='Orders-empty-rightCol'>
              <h1>Whoops!</h1>
              <h3 style={{marginTop: '1rem'}}>You haven&apos;t made any purchases yet.</h3>
              <p style={{marginTop: '2rem'}}>Why not visit our shop, load up on goodies, then check back here for updates on your orders.</p>
            </div>
          </div>
        ) : (
          <>
            <h1><span className="Colour-blue-bright">Orders</span></h1>
            <div className='OrdersList-container'>
              {shop.orders?.map(order => (
                <OrdersListItem 
                  key={order.orderTransactionId} 
                  order={order}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default OrdersContainer