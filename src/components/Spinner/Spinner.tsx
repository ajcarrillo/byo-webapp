import React from 'react'

import SpinnerImage from '../../assets/images/spinner-large.gif'
import './Spinner.css'

export const Spinner: React.FC = () => {
  return (
    <div className='Spinner-container'>
      <div className='Spinner-image'>
        <img src={SpinnerImage} alt="spinning mango" style={{ width: '300px' }} />
      </div>
    </div>
  )
}
