import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { apiCall } from '../../../utils/api-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { SelectType } from '../../../types/global-types'

type ProductListItem = {
  productName: string,
  productCode: string,
  productAddress: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminShopProductsEditProductProps {}

const AdminShopProductsEditProduct: React.FC<IAdminShopProductsEditProductProps> = (props: IAdminShopProductsEditProductProps) => {
  const [gettingProducts, setGettingProducts] = useState(false)
  const [productList, setProductList] = useState<SelectType[]>([])
  const [selectedProduct, setSelectedProduct] = useState<SelectType | null>(null)

  const handleProductSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedProduct(value)
  }
  
  const getProductList = async () => {
    setGettingProducts(true)
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/shop/products/names`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      setGettingProducts(false)
      setProductList(
        response.data.products.map((p: ProductListItem) => ({value: p.productCode, label: `${p.productCode}: ${p.productName}`}))
      )
    }else{
      setGettingProducts(false)
    }
  }

  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getProductList()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  console.log(productList)
  return (
    <div>
      <Select 
        key={Date.now()}
        styles={reactSelectCustomStyles} 
        options={productList} 
        value={selectedProduct} 
        onChange={(opt) => handleProductSelectionChange(opt)} 
        placeholder='Select a product to edit' 
        components={{ Input: ReactSelectInput }} 
      /> 
    </div>
  )
}

export default AdminShopProductsEditProduct