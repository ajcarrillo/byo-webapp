import React from 'react'

import { RadioButton } from '../../CustomControls'
import './AdminOrders.css'

export type OrderStatus = 'processing' | 'dispatched' | 'returned' | 'refunded'

interface IAdminOrderStatusProps {
  orderNumber: string,
  status: OrderStatus,
  updateStatus: (orderNumber: string, status: OrderStatus) => void
}

const AdminOrderStatus: React.FC<IAdminOrderStatusProps> = (props: IAdminOrderStatusProps) => {
  const { 
    orderNumber,
    status,
    updateStatus
  } = props 

  return (
    <div className='AdminOrderStatus-container'>
      <RadioButton
        size='small'
        value="processing"
        selected={status}
        text="Processing"
        onChange={(val: string) => updateStatus(orderNumber, val as OrderStatus)} 
      />

      <RadioButton
        size='small'
        value="dispatched"
        selected={status}
        text="Dispatched"
        onChange={(val: string) => updateStatus(orderNumber, val as OrderStatus)} 
      />

      <RadioButton
        size='small'
        value="returned"
        selected={status}
        text="Returned"
        onChange={(val: string) => updateStatus(orderNumber, val as OrderStatus)} 
      />

      <RadioButton
        size='small'
        value="refunded"
        selected={status}
        text="Refunded"
        onChange={(val: string) => updateStatus(orderNumber, val as OrderStatus)} 
      />
    </div>
  )
}

export default AdminOrderStatus
