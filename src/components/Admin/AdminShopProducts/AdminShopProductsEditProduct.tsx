import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { Observable } from 'rxjs'

import { apiCall, uploadWithObservable } from '../../../utils/api-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { SelectType } from '../../../types/global-types'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { isEmpty, isFloat, isNumeric, isPunctuatedText } from '../../../utils/validation-utils'
import { ShopProduct } from '../../../types/shop-types'
import { IStoreState } from '../../../types/store-types'
import { getShopGroupsRequest } from '../../../store/shop/shop-actions'
import AdminProductForm from './AdminProductForm'
import { ExistingProdFile, ProdFile } from './AdminShopProducts'
import AdminProductUpload from './AdminProductUpload'


const initialErrors = {
  productCode: '',
  productName: '',
  productDescription: '',
  productPrice: '',
  productDispatchTime: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  productStockLevel: '',
  groups: '',
  image: '',
  file: '',
}

type ProductListItem = {
  productName: string,
  productCode: string,
  productAddress: string,
}

interface IAdminShopProductsEditProductProps {
  metaDescriptionLimit: number,
  metaKeywordsLimit: number,
  productDescriptionLimit: number,
  maxImageSizeMB: number,
  maxFileSizeMB: number,
}

const AdminShopProductsEditProduct: React.FC<IAdminShopProductsEditProductProps> = (props: IAdminShopProductsEditProductProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)
  
  const { 
    metaDescriptionLimit,
    metaKeywordsLimit,
    productDescriptionLimit,
    maxImageSizeMB,
    maxFileSizeMB
  } = props

  const [editProductStage, setEditProductStage] = useState('prepare')

  const [gettingProducts, setGettingProducts] = useState(false)
  const [productList, setProductList] = useState<SelectType[]>([])
  const [selectedProduct, setSelectedProduct] = useState<SelectType | null>(null)

  const [errors, setErrors] = useState(initialErrors)
  const [productGroupsList, setProductGroupsList] = useState<readonly SelectType[]>([])
  const [selectedProductGroups, setSelectedProductGroups] = useState<readonly SelectType[]>([])
  const [productImageList, setProductImageList] = useState<ProdFile[]>([])
  const [existingProductImageList, setExistingProductImageList] = useState<ExistingProdFile[]>([])
  const [productFile, setProductFile] = useState<ProdFile | null>(null)
  const [existingProductFile, setExistingProductFile] = useState<ExistingProdFile | null>(null)

  const [state, setState] = useState<ShopProduct>({
    productMetaTitle: '',
    productMetaDescription: '',
    productMetaKeywords: '',
    productAddress: '',
    productCode: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productImages: [],
    productStockLevel: '',
    productDispatchTime: '',
    productGroups: [],
  })

  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingImagesComplete, setUploadingImagesComplete] = useState(false)
  const [uploadingImagesSuccess, setUploadingImagesSuccess] = useState(false)
  const [uploadingImagesFail, setUploadingImagesFail] = useState(false)

  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadingFileComplete, setUploadingFileComplete] = useState(false)
  const [uploadingFileSuccess, setUploadingFileSuccess] = useState(false)
  const [uploadingFileFail, setUploadingFileFail] = useState(false)

  const [savingProduct, setSavingProduct] = useState(false)
  const [savingProductComplete, setSavingProductComplete] = useState(false)
  const [savingProductError, setSavingProductError] = useState('')

  /**
   * Resets all of the component states
   */
  const resetAll = () => {
    setSelectedProduct(null)
    setSelectedProductGroups([])
    setProductFile(null)
    setExistingProductFile(null)
    setProductImageList([])
    setExistingProductImageList([])
    setErrors(initialErrors)
    setUploadingImages(false)
    setUploadingImagesComplete(false)
    setUploadingImagesSuccess(false)
    setUploadingImagesFail(false)
    setUploadingFile(false)
    setUploadingFileComplete(false)
    setUploadingFileSuccess(false)
    setUploadingFileFail(false)
    setSavingProduct(false)
    setSavingProductComplete(false)
    setSavingProductError('')
    setEditProductStage('prepare')
    setState({
      productMetaTitle: '',
      productMetaDescription: '',
      productMetaKeywords: '',
      productAddress: '',
      productCode: '',
      productName: '',
      productDescription: '',
      productPrice: '',
      productImages: [],
      productStockLevel: '',
      productDispatchTime: '',
      productGroups: [],
    })
  }

  /**
   * Updates the selected product
   * @param value 
   */
  const handleProductSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedProduct(value)
  }

  /**
   * Handles input field changes to the state
   * @param param
   * @param value 
   */
  const handleInputChange = (param: string, value: string) => {
    let val = ''
    if(param === 'productMetaDescription')
      val = value.slice(0, metaDescriptionLimit)
    else if(param === 'productMetaKeywords')
      val = value.slice(0, metaKeywordsLimit)
    else if(param === 'productDescription')
      val = value.slice(0, productDescriptionLimit)
    else
      val = value

    setState((prev) => ({
      ...prev,
      [param]: val,
    }))
  }

  /**
   * Adds product groups to the state
   * @param groupsSelected The groups to add
   */
  const handleSelectProductGroups = (groupsSelected: readonly SelectType[]) => { 
    setState((prev) => ({
      ...prev,
      productGroups: groupsSelected.map(g => g.value),
    }))
    setSelectedProductGroups(groupsSelected)
  }

  /**
   * Adds a product image to the state
   * @param identifier An identifier for the image
   * @param file The image file
   */
  const handleSelectProductImage = (identifier: string | number, file: any) => {
    const newList: ProdFile[] = []
    let newImg
    productImageList.forEach(img => {
      newImg = {
        index: img.index,
        upload: img.upload,
        name: img.name,
        file: img.file,
      } 
      newList.push(newImg)
    })
    newList.push({
      index: `img-${newList.length}`,
      upload: {progress: 0, response: null},
      name: file.name,
      file
    })
    setProductImageList(newList)
  }

  /**
   * Removes a product image from the state
   * @param index The index of the image
   */
  const handleClickRemoveImage = (index: string) => {
    const newList: ProdFile[] = []
    let newImg
    productImageList.forEach(img => {
      if(img.index !== index){
        newImg = {
          index: `img-${newList.length}`,
          upload: img.upload,
          name: img.name,
          file: img.file,
        } 
        newList.push(newImg)        
      }
    })
    setProductImageList(newList)
  }

  /**
   * Removes an existing product image from the state
   * @param address The address of the image
   */
  const handleClickRemoveExistingImage = (address: string) => {
    const newList: ExistingProdFile[] = existingProductImageList.filter(i => i.address !== address)
    setExistingProductImageList(newList)
  }

  /**
   * Selects a downloadable file for the product
   * @param identifier An identifier for the file
   * @param file The file object
   */
  const handleSelectProductFile = (identifier: string | number, file: any) => {
    setProductFile({
      index: 'file-0',
      name: file.name,
      upload: {progress: 0, response: null},
      file,
    })

    if(existingProductFile) setExistingProductFile(null)
  }

  /**
   * Run form validation checks and generate errors
   */
  const runChecks = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(state.productMetaTitle) || !isPunctuatedText(state.productMetaTitle))
      e.metaTitle = 'Please supply a meta title.'

    if (isEmpty(state.productMetaDescription) || !isPunctuatedText(state.productMetaDescription))
      e.metaDescription = 'Please supply a meta description.'
    
    if (isEmpty(state.productMetaKeywords) || !isPunctuatedText(state.productMetaKeywords))
      e.metaKeywords = 'Please supply a list of comma separated keywords.'

    if (state.productGroups.length === 0)
      e.groups = 'Please select at least one product group.'

    if (isEmpty(state.productCode) || !isPunctuatedText(state.productCode))
      e.productCode = 'Please supply a product code.'

    if (isEmpty(state.productName) || !isPunctuatedText(state.productName))
      e.productName = 'Please supply a product name.'

    if (isEmpty(state.productDescription) || !isPunctuatedText(state.productDescription))
      e.productDescription = 'Please supply a product description.'

    if (isEmpty(state.productPrice) || !isFloat(state.productPrice))
      e.productPrice = 'Please supply a valid product price.'

    if (isEmpty(state.productStockLevel) || !isNumeric(state.productStockLevel))
      e.productStockLevel = 'Please supply a stock amount.'

    if (isEmpty(state.productDispatchTime) || !isPunctuatedText(state.productDispatchTime))
      e.productDispatchTime = 'Please supply a dispatch time.'

    if (productImageList.length === 0 && existingProductImageList.length === 0) {
      e.image = 'Please select at least one product image.'
    } else {
      productImageList.every(i => {
        if(i.file.size > 1024 * 1024 * maxImageSizeMB){
          e.image = `Image ${i.name} is too large - max size ${maxImageSizeMB}MB`
          return false
        }
        return true
      })
    }

    if(productFile){
      if(productFile.file.size > 1024 * 1024 * maxFileSizeMB){
        e.file = `File ${productFile.name} is too large - max size ${maxFileSizeMB}MB`
      }
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      setEditProductStage('upload')
    } else {
      setErrors(e)
    }

  }, [existingProductImageList.length, maxFileSizeMB, maxImageSizeMB, productFile, productImageList, state.productCode, state.productDescription, state.productDispatchTime, state.productGroups.length, state.productMetaDescription, state.productMetaKeywords, state.productMetaTitle, state.productName, state.productPrice, state.productStockLevel])

  /**
   * Updates an inmage's upload progress
   * @param index The index of the image
   * @param progress The upload progress
   */
  const updateImageUploadProgress = (index: string, progress: number) => {
    const newList: ProdFile[] = [...productImageList]
    const imgIndex = newList.findIndex(i => i.index === index)
    if(newList[imgIndex]){
      newList[imgIndex].upload.progress = progress
      setProductImageList(newList)
    }
  }

  /**
   * Updates an inmage's upload response
   * @param index The index of the image
   * @param response The upload response
   */
  const updateImageUploadResponse = (index: string, response: any) => {
    const newList: ProdFile[] = [...productImageList]
    const imgIndex = newList.findIndex(i => i.index === index)
    if(newList[imgIndex]){
      newList[imgIndex].upload.response = response
      setProductImageList(newList)
    }
  }

  /**
   * Updates the file's upload progress
   * @param progress The upload progress
   */
  const updateFileUploadProgress = (progress: number) => {
    if(productFile){
      const upload = productFile.upload || {progress: 0, response: null}
      upload.progress = progress
      const newFile = {
        index: productFile.index,
        name: productFile.name,
        file: productFile.file,
        upload,
      }
      setProductFile(newFile)      
    }
  }

  /**
   * Updates the file's upload response
   * @param response The upload response
   */
  const updateFileUploadResponse = (response: any) => {
    if(productFile){
      const upload = productFile.upload || {progress: 0, response: null}
      upload.response = response
      const newFile = {
        index: productFile.index,
        name: productFile.name,
        file: productFile.file,
        upload,
      }
      setProductFile(newFile)      
    }
  }

  /**
   * Uploads product images
   */
  const uploadImages = () => {
    if(productImageList.length === 0){
      setUploadingImagesSuccess(true)
      return
    }

    setUploadingImages(true)
    setUploadingImagesComplete(false)
    setUploadingImagesSuccess(false)
    setUploadingImagesFail(false)

    const token = getStoredAccessToken().accesToken

    let responseCount = 0
    let uploadInterval: NodeJS.Timeout

    const uploadObservable = new Observable((subscriber) => {
      let counter = 0
      let file, identifier
      uploadInterval = setInterval(() => {
        file = productImageList[counter].file
        identifier = productImageList[counter].index

        const postData = new FormData()
        postData.append('productImage', file)

        uploadWithObservable(
          `${process.env.REACT_APP_API_BASE_URL}/admin/shop/product/image/upload`,
          token,
          postData,
          identifier,
          subscriber
        )

        counter++
        if(counter === productImageList.length) {
          clearInterval(uploadInterval)
        }
      }, 1000)
    })

    const subscription = uploadObservable.subscribe({
      next(x: any) { 
        if(x.status === 'progress'){
          updateImageUploadProgress(x.id, x.progress)
        } 
        else if(x.status === 'response'){
          updateImageUploadResponse(x.id, x.response)

          responseCount++
          if(responseCount === productImageList.length) {
            subscription.unsubscribe()
            setUploadingImagesComplete(true)
            setUploadingImages(false)
          }
        }
      },
      error(err) { 
        if(err.status === 401){
          updateStoredAccessToken('', false)
          window.location.reload()
        } 
        else if(err.status === 0){
          // no server response
        } 
        else {
          clearInterval(uploadInterval)
          subscription.unsubscribe()
          setUploadingImagesFail(true)
          setUploadingImages(false)
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      complete() {}
    })
  }

  /**
   * Checks the server response for each image upload
   */
  useEffect(() => {
    if(uploadingImagesComplete){
      setUploadingImagesComplete(false)

      if(productImageList.every(s => s.upload?.response.status === 200))
        setUploadingImagesSuccess(true)
      else
        setUploadingImagesFail(true)
    }
  }, [productImageList, uploadingImagesComplete])

  /**
   * Uploads a product file
   */
  const uploadFile = () => {
    setUploadingFile(true)
    setUploadingFileComplete(false)
    setUploadingFileSuccess(false)
    setUploadingFileFail(false)

    const token = getStoredAccessToken().accesToken

    const uploadObservable = new Observable((subscriber) => {
      const file = productFile?.file
      const identifier = productFile?.index

      const postData = new FormData()
      postData.append('productFile', file || '')

      uploadWithObservable(
        `${process.env.REACT_APP_API_BASE_URL}/admin/shop/product/file/upload`,
        token,
        postData,
        identifier || '',
        subscriber
      )
    })

    const subscription = uploadObservable.subscribe({
      next(x: any) { 
        if(x.status === 'progress'){
          updateFileUploadProgress(x.progress)
        } 
        else if(x.status === 'response'){
          updateFileUploadResponse(x.response)
          subscription.unsubscribe()
          setUploadingFileComplete(true)
          setUploadingFile(false)
        }
      },
      error(err) { 
        if(err.status === 401){
          updateStoredAccessToken('', false)
          window.location.reload()
        } 
        else if(err.status === 0){
          // no server response
        } 
        else {
          subscription.unsubscribe()
          setUploadingFileFail(true)
          setUploadingFile(false)
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      complete() {}
    })
  }

  /**
   * Checks the server response for the file upload
   */
  useEffect(() => {
    if(uploadingFileComplete){
      setUploadingFileComplete(false)

      if(productFile?.upload?.response?.status === 200)
        setUploadingFileSuccess(true)
      else
        setUploadingFileFail(true)
    }
  }, [productFile?.upload?.response?.status, uploadingFileComplete])

  /**
   * Creates the uploaded image address list
   * @returns A comma separated list of image addresses
   */
  const generateImageAddressList = (): string => {
    const addresses: string[] = productImageList.map(i => i.upload.response.data.address)
    return addresses.join(',')
  }

  /**
   * Creates the existing image address list
   * @returns A comma separated list of image addresses
   */
  const generateExistingImageAddressList = (): string => {
    const addresses: string[] = existingProductImageList.map(i => i.address)
    return addresses.join(',')
  }

  /**
   * Saves the product
   */
  const saveProduct = async () => {
    setSavingProduct(true)
    setSavingProductComplete(false)
    setSavingProductError('')

    const token = getStoredAccessToken().accesToken

    const postData = {
      metaTitle: state.productMetaTitle,
      metaDescription: state.productMetaDescription,
      metaKeywords: state.productMetaKeywords,
      productAddress: state.productAddress,
      productCode: state.productCode,
      productName: state.productName,
      productDescription: state.productDescription,
      productPrice: state.productPrice,
      productStockLevel: state.productStockLevel,
      productDispatchTime: state.productDispatchTime,
      productImages: generateImageAddressList(),
      existingProductImages: generateExistingImageAddressList(),
      productGroups: state.productGroups.join(','),
      productFile: productFile?.upload.response.data.address,
      existingProductFile: existingProductFile?.address
    }
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/product/update`,
      'POST',
      token,
      postData,
      'json'
    )

    if(response.status === 200){
      setSavingProductComplete(true)
      setSavingProduct(false)
    }else{
      if(response.status === 401) {
        updateStoredAccessToken('', false)
        window.location.reload()
      } else {
        setSavingProduct(false)
        switch(response.message){
        case'DUPLICATE_NAME':
          setSavingProductError('A product with that name already exists.')
          break
        case'ERROR':
          setSavingProductError('There was an error saving this product.')
          break
        default:
          setSavingProductError('There was an error saving this product.')
          break
        }
      }
    }
  }

  /**
   * Fetches a list of products
   */
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
        response.data.products.map((p: ProductListItem) => ({value: p.productAddress, label: `${p.productCode}: ${p.productName}`}))
      )
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
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

  /**
   * Fetches a product
   */
  const getProduct = useCallback(async (address: string) => {
    if(address === state.productAddress) return
    
    const token = getStoredAccessToken().accesToken
    
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/product/${address}`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      setState(response.data.product)
      const groupsSelected: SelectType[] = []
      response.data.product.productGroups.forEach((g: string) => {
        const group = productGroupsList.find(pG => pG.value === g)
        if(group) groupsSelected.push(group)
      })
      setSelectedProductGroups(groupsSelected)
      setExistingProductImageList(response.data.product.productImages)
      if(response.data.product.productFile)
        setExistingProductFile(response.data.product.productFile)
      else
        setExistingProductFile(null)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      //
    }
  }, [productGroupsList, state.productAddress])

  useEffect(() => {
    if(selectedProduct) getProduct(selectedProduct.value)
  }, [getProduct, selectedProduct])

  /**
   * Creates the groups select items
   */
  const createGroupsList = useCallback(() => {
    if(productGroupsList.length === 0 && shop.groups){
      const groups: SelectType[] = shop.groups.map(g => {
        return {
          value: g.groupAddress,
          label: g.groupName
        }
      })
      setProductGroupsList(groups)
    }
  }, [productGroupsList.length, shop.groups])

  useEffect(() => {
    createGroupsList()
  }, [createGroupsList, shop.groups])

  /**
   * Gets the shop groups
   */
  const getShopGroups = useCallback(() => {
    if(productGroupsList.length === 0) dispatch(getShopGroupsRequest())
  }, [dispatch, productGroupsList.length])
  
  useEffect(() => {
    getShopGroups()
  }, [getShopGroups])

  return (
    <div>
      <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
        <div style={{marginBottom: '.6rem'}}>Edit product</div>
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

      {state.productAddress && (
        <>
          {editProductStage === 'prepare' ? (
            <AdminProductForm 
              isNewProduct={false}
              errors={errors}
              state={state}
              metaDescriptionLimit={metaDescriptionLimit}
              metaKeywordsLimit={metaKeywordsLimit}
              productDescriptionLimit={productDescriptionLimit}
              productGroupsList={productGroupsList}
              selectedProductGroups={selectedProductGroups}
              existingProductImageList={existingProductImageList}
              productImageList={productImageList}
              productFile={productFile}
              existingProductFile={existingProductFile}
              handleInputChange={handleInputChange}
              handleSelectProductGroups={handleSelectProductGroups}
              handleSelectProductImage={handleSelectProductImage}
              handleClickRemoveImage={handleClickRemoveImage}
              handleClickRemoveExistingImage={handleClickRemoveExistingImage}
              setProductFile={setProductFile}
              handleSelectProductFile={handleSelectProductFile}
              setExistingProductFile={setExistingProductFile}
              runChecks={runChecks}
            />
          ) : (
            <AdminProductUpload 
              isNewProduct={false}
              productImageList={productImageList} 
              productFile={productFile} 
              uploadState={{
                uploadingImages,
                uploadingImagesComplete,
                uploadingImagesSuccess,
                uploadingImagesFail,
                uploadingFile,
                uploadingFileComplete,
                uploadingFileSuccess,
                uploadingFileFail,
                savingProduct,
                savingProductComplete,
                savingProductError
              }} 
              uploadImages={uploadImages} 
              uploadFile={uploadFile}
              saveProduct={saveProduct}
              returnToProductForm={setEditProductStage}
              resetAll={resetAll}
            />
          )}
        </>
      )}
    </div>
  )
}

export default AdminShopProductsEditProduct