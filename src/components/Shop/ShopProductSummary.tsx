import React from 'react'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'

import './Shop.css'

interface IShopProductSummaryProps {
  name: string,
  desc: string,
  image: string,
  price: string,
  address: string,
}

const ShopProductSummary: React.FC<IShopProductSummaryProps> = (props: IShopProductSummaryProps) => {
  const { desc, name, address, image, price } = props
  return (
    <Link to={`/product/${address}`} title={name}>
      <div className='ShopProductSummary-container'>
        <div className='ShopProductSummary-image-container'><img src={image} alt={name} /></div>
        <div className='ShopProductSummary-text-container'>
          <h3>{name}</h3>
          <p>{parse(desc)}</p>
          <div className='ShopProductSummary-text-price'>{parse(`&euro;${price}`)}</div>
        </div>
      </div>
    </Link>
  )
}

export default ShopProductSummary