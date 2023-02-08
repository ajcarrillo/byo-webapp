import React from 'react'

import './NotFound.css'

const NotFoundContainer: React.FC = () => {
  return (
    <div className='NotFound-container'>
      <div className='NotFound-leftCol'>
        <i className="fa-solid fa-face-sad-tear"></i>
      </div>
      <div className='NotFound-rightCol'>
        <h1>Whoops!</h1>
        <h3 style={{marginTop: '1rem'}}>Terribly sorry, but that page isn&apos;t available.</h3>
        <p>Try clicking your browser&apos;s back button, and have another go.</p>
      </div>
    </div>
  )
}

export default NotFoundContainer