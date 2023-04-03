import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import parse from 'html-react-parser'

import { getCountryListRequest, getCustomerDetailsRequest, saveCustomerDetailsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import { APIResponse } from '../../types/api-types'
import { UserContactExtended } from '../../types/user-types'
import { ShopBasketItem, ShopCheckoutSummary } from '../../types/shop-types'
import { addFloatValues, multiplyFloatValues } from '../../utils/financial-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../utils/user-utils'
import { apiCall } from '../../utils/api-utils'
import ShopBasketProduct from './ShopBasketProduct'
import ShopCustomerContactForm from './ShopCustomerContactForm'
import { Checkbox } from '../CustomControls'
import './Shop.css'

type SelectType = {
  readonly label: string,
  readonly value: string,
}

type CheckoutAddresses = {
  billing: UserContactExtended | null,
  delivery: UserContactExtended | null
}

type CheckoutProgress = {
  addressCaptured: boolean,
  shippinAndTaxCalculated: boolean,
}

interface IShopCheckoutContainerProps {
  tokenIsValid: boolean,
}

const ShopCheckoutContainer: React.FC<IShopCheckoutContainerProps> = (props: IShopCheckoutContainerProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [checkoutStage, setCheckoutStage] = useState('contactDetails')
  const [checkoutProgress, setCheckoutProgress] = useState<CheckoutProgress>({addressCaptured: false, shippinAndTaxCalculated: false})

  const [checkoutAddresses, setCheckoutAddresses] = useState<CheckoutAddresses>({billing: null, delivery: null})

  const [deliverAlternateAddress, setDeliverAlternateAddress] = useState('no')
  const [checkoutSummary, setCheckoutSummary] = useState<ShopCheckoutSummary>()
  const [countryList, setCountryList] = useState<readonly SelectType[]>([])
  const [shippingAndTax, setShippingAndTax] = useState({shipping:'0.00', tax:'0.00'})

  const billingContactForm = useRef<any>(null)
  const deliveryContactForm = useRef<any>(null)

  const handleClickGoToSummary = () => {
    // Validate the contact forms and get the data
    let delivery: UserContactExtended | null = null
    const billing: UserContactExtended | null = billingContactForm.current?.validateAndSubmit()
    if(deliverAlternateAddress === 'yes')
      delivery = deliveryContactForm.current?.validateAndSubmit()

    if(!billing) return
    if(deliverAlternateAddress === 'yes' && !delivery) return

    // Create the POST data array
    const saveData: UserContactExtended[] = []
    if(billing){
      saveData.push({
        address: checkoutAddresses.billing ? checkoutAddresses.billing.address : '',
        name: 'billing',
        firstName: billing.firstName || '',
        lastName: billing.lastName || '',
        addressLine1: billing.addressLine1,
        addressLine2: billing.addressLine2,
        townCity: billing.townCity,
        regionCounty: billing.regionCounty,
        zipPostcode: billing.zipPostcode,
        countryCode: billing.countryCodeSelect?.value || '',
        countryCodeSelect: null,
        telephone: billing.telephone || '',
      })
    }
    if(delivery){
      saveData.push({
        address: checkoutAddresses.delivery ? checkoutAddresses.delivery.address : '',
        name: 'delivery',
        firstName: delivery.firstName || '',
        lastName: delivery.lastName || '',
        addressLine1: delivery.addressLine1,
        addressLine2: delivery.addressLine2,
        townCity: delivery.townCity,
        regionCounty: delivery.regionCounty,
        zipPostcode: delivery.zipPostcode,
        countryCode: delivery.countryCodeSelect?.value || '',
        countryCodeSelect: null,
        telephone: delivery.telephone || '',
      })
    }
    
    dispatch(saveCustomerDetailsRequest(saveData))
    setCheckoutStage('summary')
  }

  const continueToPay = () => {
    //
  }

  const canUpdateCheckoutStage = (stage: string) => {
    if(checkoutStage !== stage) {
      let canUpdate = false
      switch(stage){
      case'contactDetails':
        canUpdate = true
        break
      case'summary':
        canUpdate = checkoutProgress.addressCaptured
        break
      case'payment':
        canUpdate = checkoutProgress.addressCaptured && checkoutProgress.shippinAndTaxCalculated
        break
      }

      return canUpdate
    }
  }

  const updateCheckoutStage = (stage: string) => {
    if(checkoutStage !== stage) {
      if(canUpdateCheckoutStage(stage)) {
        setCheckoutStage(stage)
      }
    }
  }

  const updateCheckoutProgress = (action: string, state: boolean) => {
    setCheckoutProgress((prev) => ({
      ...prev,
      [action]: state,
    }))
  }

  /**
   * Requests shipping and tax costs
   */
  const calculateShippingAndTax = useCallback(async () => {
    const postData = {
      countryCode: checkoutAddresses.delivery ? checkoutAddresses.delivery.countryCode : checkoutAddresses.billing?.countryCode,
      zipPostcode: checkoutAddresses.delivery ? checkoutAddresses.delivery.zipPostcode : checkoutAddresses.billing?.zipPostcode,
      basketItems: shop.basketItems?.map((b) => { 
        return {productCode: b.item.productCode, productAmount: b.amount.toString()}
      })
    }

    try {
      const response: APIResponse = await apiCall(
        `${process.env.REACT_APP_API_BASE_URL}/shop/shipping-tax`,
        'POST',
        getStoredAccessToken().accesToken,
        postData,
        'json'
      )
  
      if(response.status === 200){
        setShippingAndTax(response.data)
      }
      else {
        if(response.status === 401) updateStoredAccessToken('', false)
        setShippingAndTax({shipping:'0.00', tax:'0.00'})
      }
    } 
    catch(e) {
      setShippingAndTax({shipping:'0.00', tax:'0.00'})
    }
  }, [checkoutAddresses.billing?.countryCode, checkoutAddresses.billing?.zipPostcode, checkoutAddresses.delivery, shop.basketItems])

  useEffect(() => {
    if(checkoutStage === 'summary'){
      calculateShippingAndTax()
    }
  }, [calculateShippingAndTax, checkoutStage])

  /**
   * Calculates the basket summary
   * @param basketItems
   * @param shipping
   * @param tax
   */
  const calculateBasketSummary = (basketItems: ShopBasketItem[], shipping: string, tax: string) => {
    const itemCosts: string[] = []
    basketItems.forEach(b => {
      itemCosts.push(multiplyFloatValues(b.item.productPrice, b.amount.toString()))
    })

    const summarySubTotal = addFloatValues(itemCosts)
    const summaryTotal = addFloatValues([summarySubTotal, shipping, tax])
    setCheckoutSummary({
      sub: summarySubTotal,
      shipping,
      tax,
      total: summaryTotal
    })
  }

  useEffect(() => {
    if(shop.basketItems && shop.basketItems?.length > 0 && shippingAndTax.shipping !== '0.00'){
      calculateBasketSummary(shop.basketItems, shippingAndTax.shipping, shippingAndTax.tax)
    }
  }, [shippingAndTax, shop.basketItems])

  /**
   * Loads any customer contact details we have
   */
  const loadCustomerDetails = useCallback(() => {
    if(props.tokenIsValid){
      dispatch(getCustomerDetailsRequest())
    }
  }, [dispatch, props.tokenIsValid])
  
  useEffect(() => {
    if(!shop.customerDetails && shop.basketItems && shop.basketItems?.length > 0){
      loadCustomerDetails()
    }
  }, [loadCustomerDetails, shop.basketItems, shop.customerDetails])

  /**
   * Updates the customer contact addresses
   */
  const updateContactAddress = useCallback(() => {
    const billing = shop.customerDetails?.contacts.find(ad => ad.name === 'billing')
    const delivery = shop.customerDetails?.contacts.find(ad => ad.name === 'delivery')
    setCheckoutAddresses({
      billing: billing ? {...billing, firstName: shop.customerDetails?.user.firstName, lastName: shop.customerDetails?.user.lastName} : null,
      delivery: delivery ? delivery : null,
    })

    if(billing && deliverAlternateAddress === 'no'){
      updateCheckoutProgress('addressCaptured', true)
    }else if(delivery && deliverAlternateAddress === 'yes'){
      updateCheckoutProgress('addressCaptured', true)
    }else{
      updateCheckoutProgress('addressCaptured', false)
    }
  }, [deliverAlternateAddress, shop.customerDetails?.contacts, shop.customerDetails?.user.firstName, shop.customerDetails?.user.lastName])

  useEffect(() => {
    if(shop.customerDetails){
      updateContactAddress()
    }
  }, [shop.customerDetails, updateContactAddress])

  /**
   * Loads and generates the country list
   */
  const loadCountries = useCallback(() => {
    dispatch(getCountryListRequest())
  }, [dispatch])

  useEffect(() => {
    if(!shop.countries) loadCountries()
  }, [loadCountries, shop.countries])
  
  useEffect(() => {
    if(shop.countries && countryList.length === 0){
      const list: readonly SelectType[] = shop.countries.map(c => {
        return {value: c.iso, label: c.name}
      })
      setCountryList(list)
    }
  }, [countryList.length, shop.countries])

  return (
    <>
      <div className='Shop-container'>
        {shop.basketItems?.length === 0 ? (
          <div className='ShopCheckout-empty-container'>
            <div className='ShopCheckout-empty-leftCol'>
              <i className="fa-solid fa-face-sad-tear"></i>
            </div>
            <div className='ShopCheckout-empty-rightCol'>
              <h1>Oh no!</h1>
              <h3 style={{marginTop: '1rem'}}>You haven&apos;t added anything to your basket yet.</h3>
              <p style={{marginTop: '2rem'}}>Why not visit our shop, load up on goodies, then come back for another go.</p>
            </div>
          </div>
        ) : (
          <>
            <h1><span className="Colour-blue-bright">Checkout</span></h1>

            {!props.tokenIsValid ? (
              <>
                <div className='ShopCheckout-help-container'>
                  <h3>Already have an account?</h3>
                  <p style={{marginTop: '.6rem'}}>Please <Link to='/sign-in?redirectAfter=checkout' title='Sign In'>Sign In</Link> before you can checkout your basket items.</p>
                  <h3 style={{marginTop: '2rem'}}>Don&apos;t have an account yet?</h3>
                  <p style={{marginTop: '.6rem'}}>Please head over to our <Link to='/sign-up' title='Sign Up'>Sign Up</Link> page and create your Byowave account. It only takes a minute - promise!</p>
                </div>
              </>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} autoComplete='off'>
                <div  className='PanelLabel' style={{marginTop: '1.6rem'}}>
                  <div className='ShopCheckout-breadcrumb-container'>
                    <Link to='/basket' title='Basket'>Basket</Link>
                    <i className='fa-solid fa-right-long'></i>
                    <div 
                      title='Contact Details'
                      className={`ShopCheckout-breadcrumb-link${checkoutStage === 'contactDetails' ? '__active' : canUpdateCheckoutStage('contactDetails') ? '' : '__inactive'}`}
                      onClick={() => updateCheckoutStage('contactDetails')}
                    >
                      Contact Details
                    </div>
                    <i className='fa-solid fa-right-long'></i>
                    <div 
                      title='Summary'
                      className={`ShopCheckout-breadcrumb-link${checkoutStage === 'summary' ? '__active' : canUpdateCheckoutStage('summary') ? '' : '__inactive'}`}
                      onClick={() => updateCheckoutStage('summary')}
                    >
                      Summary
                    </div>
                    <i className='fa-solid fa-right-long'></i>
                    <div 
                      title='Payment'
                      className={`ShopCheckout-breadcrumb-link${checkoutStage === 'payment' ? '__active' : canUpdateCheckoutStage('payment') ? '' : '__inactive'}`}
                      onClick={() => updateCheckoutStage('payment')}
                    >
                      Payment
                    </div>
                  </div>
                </div>

                <div className='ShopCheckout-container'>
                  <div className='ShopCheckout-container-leftCol'>

                    {checkoutStage === 'contactDetails' && (
                      <>
                        <ShopCustomerContactForm 
                          ref={billingContactForm} 
                          countries={countryList} 
                          formName={'Billing Address'} 
                          formData={checkoutAddresses.billing}
                        />
                      </>
                    )}

                    {checkoutStage === 'summary' && (
                      <>
                        <h3>Basket Items</h3>
                        {shop.basketItems?.map((b, i) => (
                          <ShopBasketProduct key={i} basketItem={b} allowQuantityUpdates={false} />
                        ))}
                      </>
                    )}

                  </div>

                  <div className='ShopCheckout-container-rightCol'>

                    {checkoutStage === 'contactDetails' && (
                      <>
                        <div className="PanelAlert" style={{marginBottom: '1.6rem', display: 'block'}}>
                          <p>Would like your items shipped to a different address?</p>
                          <div style={{margin: '.8rem 0 00'}}>
                            <Checkbox
                              size='small' 
                              selectedValue="yes" 
                              unselectedValue="no"
                              value={deliverAlternateAddress}
                              text='Yes, please ship my items to an alternative address.'
                              onChange={(val: string) => setDeliverAlternateAddress(val)} 
                            />                    
                          </div>
                        </div>
                        {deliverAlternateAddress === 'yes' && (
                          <ShopCustomerContactForm 
                            ref={deliveryContactForm} 
                            excludes={['firstName', 'lastName', 'telephone']} 
                            countries={countryList} 
                            formName={'Delivery Address'} 
                            formData={{
                              ...checkoutAddresses.delivery,
                              firstName: '',
                              lastName: '',
                            }}
                          />
                        )}
                        <button 
                          className='Button-standard'
                          title='Payment Summary'
                          onClick={() => handleClickGoToSummary()}
                        >
                          Payment Summary
                        </button>
                      </>
                    )}

                    {checkoutStage === 'summary' && (
                      <>
                        <h3>Summary</h3>
                        <div className="PanelLabel" style={{marginTop: '1rem', marginBottom: '1.6rem'}}>
                          <div className='ShopCheckout-summary-item'>
                            <p>Subtotal:</p><p>{parse(`&euro;${checkoutSummary?.sub}`)}</p>
                          </div>
                          <div className='ShopCheckout-summary-item'>
                            <p>Shipping:</p><p>{parse(`&euro;${checkoutSummary?.shipping}`)}</p>
                          </div>
                          <div className='ShopCheckout-summary-item'>
                            <p>VAT:</p><p>{parse(`&euro;${checkoutSummary?.tax}`)}</p>
                          </div>
                          <div className='ShopCheckout-summary-item'>
                            <p><strong>Total:</strong></p><p><strong>{parse(`&euro;${checkoutSummary?.total}`)}</strong></p>
                          </div>
                        </div>

                        <button 
                          className='Button-standard'
                          title={`Pay ${checkoutSummary?.total}`} 
                          onClick={() => continueToPay()}
                        >
                          {parse(`Pay &euro;${checkoutSummary?.total}`)}
                        </button>
                      </>
                    )}
                                
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ShopCheckoutContainer
