import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IStoreState } from '../../../types/store-types'
import { Pagination, RadioButton } from '../../CustomControls'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { apiCall } from '../../../utils/api-utils'
import AdminOrderItem from './AdminOrderItem'
import './AdminOrders.css'
import { OrderStatus } from './AdminOrderStatus'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminOrdersProps {}

const AdminOrders: React.FC<IAdminOrdersProps> = (props: IAdminOrdersProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [searchBy, setSearchBy] = useState('order')
  const [searchText, setSearchText] = useState('')

  const [pagesPerGroup, setPagesPerGroup] = useState(2)
  const [rowStart, setRowStart] = useState('0')
  const [ordersList, setOrdersList] = useState<any[]>([])
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const [ordersTotal, setOrdersTotal] = useState('0')

  const handleClickSearch = () => {
    getOrdersList('0')
  }

  const handleClickUpdateOrderStatus = (orderNumber: string, status: OrderStatus) => {
    updateOrderStatus(orderNumber, status)
  }

  /**
   * Creates placeholder text for the search field
   * @returns Placeholder text
   */
  const getPlaceholderText = () => {
    let txt = ''
    if(searchBy === 'order')
      txt = 'Order number'
    else if(searchBy === 'email')
      txt = 'Customer email address'
    else
      txt = 'Not required'

    return txt
  }

  /**
   * Requests orders
   */
  const getOrdersList = useCallback(async (start?: string) => {
    if(start) setRowStart(start)
    const token = getStoredAccessToken().accesToken
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/orders?rowStart=${start ? start : rowStart}&limit=${itemsPerPage}&searchType=${searchBy}&searchText=${searchText}`,
      'GET',
      token,
      undefined,
      'json'
    )

    if(response.status === 200){
      setOrdersList(response.data.orders)
      setOrdersTotal(response.data.total)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      //
    }
  },[itemsPerPage, rowStart, searchBy, searchText])

  /**
   * Updates an order's status
   */
  const updateOrderStatus = useCallback(async (orderNumber: string, orderStatus: OrderStatus) => {
    const token = getStoredAccessToken().accesToken
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/order/status/update`,
      'POST',
      token,
      {orderNumber, orderStatus},
      'json'
    )

    if(response.status === 200){
      const orders = [...ordersList]
      const index = orders.findIndex(o => o.transaction_id === response.data.orderNumber)
      orders[index].order_status = response.data.orderStatus
      setOrdersList(orders)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      //
    }
  },[ordersList])

  return (
    <>
      <div className='AdminOrders-container'>

        <div className='AdminOrders-header-container'>

          <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)'}}>
            <div>Search by</div>

            <div style={{display: 'flex', marginTop: '.6rem'}}>
              <RadioButton
                size='small'
                value="order"
                selected={searchBy}
                text="Order Number"
                onChange={(val: string) => setSearchBy(val)} 
              />

              <RadioButton
                size='small'
                value="email"
                selected={searchBy}
                text="Customer Email"
                onChange={(val: string) => setSearchBy(val)} 
              />

              <RadioButton
                size='small'
                value="processing"
                selected={searchBy}
                text="Processing"
                onChange={(val: string) => setSearchBy(val)} 
              />

              <RadioButton
                size='small'
                value="declined"
                selected={searchBy}
                text="Payment Declined"
                onChange={(val: string) => setSearchBy(val)} 
              />
            </div>       

            <div style={{display: 'flex', marginTop: '.8rem'}}>
              <input
                disabled={searchBy !== 'order' && searchBy !== 'email'}
                className={searchBy !== 'order' && searchBy !== 'email' ? 'Textfield-dark-disabled' : 'Textfield-dark'}
                type='text' 
                onChange={(e) => setSearchText(e.target.value)} 
                value={searchText}
                placeholder={getPlaceholderText()}
                style={{ width: '100%' }}
                data-lpignore="true"
                autoComplete='off'
              />
              
              <button
                className="Button-standard" 
                style={{marginLeft:'.6rem'}}
                onClick={() => handleClickSearch()}
              >
                Search
              </button>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
            <Pagination 
              datasetName={searchBy} 
              totalRecords={Number(ordersTotal)} 
              itemsPerPage={Number(itemsPerPage)} 
              pagesPerGroup={Number(pagesPerGroup)} 
              callbackPageLoad={getOrdersList}
            />
          </div>
        </div>

        <div>
          {ordersList.map(o => 
            <AdminOrderItem 
              key={o.transaction_id} 
              order={o} 
              updateOrderStatus={handleClickUpdateOrderStatus} 
            />
          )}
        </div>

      </div>
    </>
  )
}

export default AdminOrders
