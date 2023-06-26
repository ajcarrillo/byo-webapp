import React from 'react'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'

import './Shop.css'

interface IShopGroupCardProps {
  name: string,
  desc: string,
  image: string,
  address: string,
}

const ShopGroupCard: React.FC<IShopGroupCardProps> = (props: IShopGroupCardProps) => {
  const { desc, name, address, image } = props
  return (
    <Link to={`/shop-group/${address}`} title={name}>
      <div className='ShopProductSummary-container'>
        <div className='ShopProductSummary-image-container'><img src={image} alt={name} /></div>
        <div className='ShopProductSummary-text-container'>
          <h3>{name}</h3>
          <p>{parse(desc)}</p>
        </div>
      </div>
    </Link>
  )
}

export default ShopGroupCard