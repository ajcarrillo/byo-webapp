import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { 
  createSalesTransactionRequest,
  updateShopSalesTransactionStatusRequest,
  getAmericaStateListRequest, 
  getCountryListRequest, 
  getCustomerDetailsRequest, 
  saveCustomerDetailsRequest 
} from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import { UserContactExtended } from '../../types/user-types'
import ShopBasketProduct from './ShopBasketProduct'
import ShopCustomerContactForm from './ShopCustomerContactForm'
import ShopCheckoutProgress from './ShopCheckoutProgress'
import ShopCheckoutSummaryPanel from './ShopCheckoutSummaryPanel'
import ShopCheckoutPayment from './ShopCheckoutPayment'
import ShopCheckoutPaymentComplete from './ShopCheckoutPaymentComplete'
import { Checkbox } from '../CustomControls'
import './Shop.css'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '')

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
  shippingCalculated: boolean,
  taxCalculated: boolean,
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
  const [checkoutProgress, setCheckoutProgress] = useState<CheckoutProgress>({addressCaptured: false, shippingCalculated: false, taxCalculated: false})
  const [checkoutAddresses, setCheckoutAddresses] = useState<CheckoutAddresses>({billing: null, delivery: null})
  const [deliverAlternateAddress, setDeliverAlternateAddress] = useState('no')
  const [countryList, setCountryList] = useState<readonly SelectType[]>([])
  const [americaStateList, setAmericaStateList] = useState<readonly SelectType[]>([])
  const billingContactForm = useRef<any>(null)
  const deliveryContactForm = useRef<any>(null)

  /**
   * Used for redirects by Stripe
   */
  const [stripeRedirectClientSecret, setStripeRedirectClientSecret] = useState('')
  const [stripeRedirectTxId, setStripeRedirectTxId] = useState('')

  const stripeAppearance = {
    variables: {
      colorPrimary: getComputedStyle(document.documentElement).getPropertyValue('--byowave-cta-colour'),
      colorBackground: getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-bg-colour'),
      colorText: getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-text-colour'),
      colorDanger: getComputedStyle(document.documentElement).getPropertyValue('--byowave-alert-colour'),
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '3px',
      borderRadius: '4px',
      spacingGridRow: '18px'
    },
    rules: {
      '.Input::placeholder': {
        color: getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-placeholder-text-colour'),
      },
      '.Input': {
        outline: 'none',
        border: 'none',
        boxShadow: 'none'
      },
      '.Input--empty': {
        outline: 'none',
        border: 'none',
        boxShadow: 'none'
      },
      '.Input:focus': {
        outline: 'none',
        border: 'none',
        boxShadow: 'none'
      },

    }
  }
  const stripeLoader = 'auto'

  const handleClickGoToSummary = () => {
    if(shop.customerDetailsLoading) return

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

  const handleClickGoToPayment = () => {
    if(!canUpdateCheckoutStage('payment')) return

    setCheckoutStage('payment')
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
        canUpdate = checkoutProgress.addressCaptured && shop.salesTransaction !== null && shop.salesTransaction.transactionStatus !== 'update'
        break
      }
      return canUpdate
    } else {
      return false
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
   * Creates a tax calculation, shipping calculation, payment intent, a sales order
   * Returns a Stripe client secret, and checkout summary
   */
  const createSalesTransaction = useCallback(() => {
    if(shop.basketItems && !shop.salesTransactionLoading && !shop.apiError){
      dispatch(createSalesTransactionRequest(
        shop.basketItems?.map((b) => { 
          return {
            productCode: b.item.productCode, 
            productAmount: b.amount,
            ...(b.trackers.length > 0 && {trackers: b.trackers})
          }
        }), 
        deliverAlternateAddress === 'yes' ? 'delivery' : 'billing',
        shop.salesTransaction?.stripeClientSecret
      ))      
    }
  }, [deliverAlternateAddress, dispatch, shop.apiError, shop.basketItems, shop.salesTransaction?.stripeClientSecret, shop.salesTransactionLoading])

  useEffect(() => {
    if(checkoutStage === 'summary' && !shop.customerDetailsLoading){
      if(!shop.salesTransaction || shop.salesTransaction.transactionStatus === 'update'){
        createSalesTransaction()
      }
    }

    // Moving away from summary, back to contact details - update transaction status, 
    // so we request a new transaction when we return to the summary
    if(checkoutStage === 'contactDetails'){
      if(shop.salesTransaction && shop.salesTransaction.transactionStatus === 'new'){
        dispatch(updateShopSalesTransactionStatusRequest('update'))
      }
    }

    // Moving away from checkout - update transaction status, 
    // so we request a new transaction when we return to the summary
    return () => {
      if(shop.salesTransaction && shop.salesTransaction.transactionStatus === 'new') 
        dispatch(updateShopSalesTransactionStatusRequest('update'))
    }
  }, [checkoutStage, createSalesTransaction, dispatch, shop.customerDetailsLoading, shop.salesTransaction])

  /**
   * Loads any customer contact details we have from the database
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
   * Updates the customer contact addresses from the database
   */
  const updateContactAddress = useCallback(() => {
    const billing = shop.customerDetails?.contacts.find(ad => ad.name === 'billing')
    const delivery = shop.customerDetails?.contacts.find(ad => ad.name === 'delivery')
    setCheckoutAddresses({
      billing: {
        ...billing,
        firstName: shop.customerDetails?.user.firstName,
        lastName: shop.customerDetails?.user.lastName,
      },
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

  /**
   * Loads and generates the america state list
   */
  const loadAmericaStates = useCallback(() => {
    dispatch(getAmericaStateListRequest())
  }, [dispatch])

  useEffect(() => {
    if(!shop.americanStates) loadAmericaStates()
  }, [loadAmericaStates, shop.americanStates])
  
  useEffect(() => {
    if(shop.americanStates && americaStateList.length === 0){
      const list: readonly SelectType[] = shop.americanStates.map(c => {
        return {value: c.code, label: c.name}
      })
      setAmericaStateList(list)
    }
  }, [americaStateList.length, shop.americanStates])

  /**
   * Used for callback/redirect from Stripe
   */
  useEffect(() => {
    const url = new URL(window.location.href)
    const stripeSecret = url.searchParams.get('payment_intent_client_secret')
    const tx = url.searchParams.get('txId')
    const loadModule = url.searchParams.get('mod')

    if(stripeSecret) setStripeRedirectClientSecret(stripeSecret)
    if(tx) setStripeRedirectTxId(tx)
    
    if(loadModule){
      setCheckoutStage(loadModule)
      window.history.replaceState({}, '', `${window.location.pathname}`)
    }
  }, [checkoutStage])
  
  return (
    <>
      <div className='Shop-container'>
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
          <>
            {checkoutStage === 'complete' ? (
              <Elements stripe={stripePromise} options={{clientSecret: stripeRedirectClientSecret}}>
                <ShopCheckoutPaymentComplete 
                  updateCheckoutStage={setCheckoutStage}  
                  stripeClientSecret={stripeRedirectClientSecret} 
                  transactionId={stripeRedirectTxId} 
                  basketItems={shop.basketItems || []} 
                  orders={shop.orders} 
                  ordersLoading={shop.ordersLoading}
                />
              </Elements>
            ) : (
              <>
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
                    <ShopCheckoutProgress 
                      checkoutStage={checkoutStage} 
                      updateCheckoutStage={updateCheckoutStage} 
                      contactDetailsStageAllowed={canUpdateCheckoutStage('contactDetails')}
                      summaryStageAllowed={canUpdateCheckoutStage('summary')}
                      paymentStageAllowed={canUpdateCheckoutStage('payment')}
                    />

                    {checkoutStage === 'payment' && shop.salesTransaction ? (
                      <Elements stripe={stripePromise} options={{clientSecret: shop.salesTransaction.stripeClientSecret, appearance: stripeAppearance, loader: stripeLoader}}>
                        <ShopCheckoutPayment 
                          customerName={`${checkoutAddresses.billing?.firstName} ${checkoutAddresses.billing?.lastName}`} 
                          salesTransaction={shop.salesTransaction}
                        />                    
                      </Elements>
                    ) : (
                      <form onSubmit={(e) => e.preventDefault()} autoComplete='off'>
                        <div className='ShopCheckout-container'>
                          <div className='ShopCheckout-container-leftCol'>
                            {checkoutStage === 'contactDetails' && (
                              <>
                                <ShopCustomerContactForm 
                                  ref={billingContactForm} 
                                  countries={countryList} 
                                  americanStates={americaStateList} 
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
                                    americanStates={americaStateList} 
                                    formName={'Delivery Address'} 
                                    formData={{
                                      ...checkoutAddresses.delivery,
                                      firstName: '',
                                      lastName: '',
                                    }}
                                  />
                                )}
                                <button 
                                  className={`Button-standard${shop.customerDetailsLoading ? '-disabled' : ''}`}
                                  title='Payment Summary'
                                  onClick={() => handleClickGoToSummary()}
                                >
                                  Payment Summary
                                </button>
                              </>
                            )}

                            {checkoutStage === 'summary' && (
                              <>
                                {shop.apiError !== null ? (
                                  <div className="PanelAlert">{shop.apiError.message}</div>
                                ) : (
                                  <>
                                    <h3>Summary</h3>
                                    <div className="PanelLabel" style={{marginTop: '1rem', marginBottom: '1.6rem'}}>
                                      {shop.salesTransactionLoading ? (
                                        <div className="ShopCheckout-summary-spinner">
                                          <i className="fa-solid fa-spinner"></i>
                                        </div>
                                      ) : (
                                        <div className='FadeInAfterDelay' style={{opacity: 0}} >
                                          {shop.salesTransaction?.salesAmount && (
                                            <ShopCheckoutSummaryPanel 
                                              summary={shop.salesTransaction?.salesAmount} 
                                            />
                                          )}
                                        </div>                    
                                      )}
                                    </div>
                                    {!shop.salesTransactionLoading && (
                                      <button 
                                        className={`FadeInAfterDelay Button-standard${shop.salesTransactionLoading ? '-disabled' : ''}`}
                                        style={{opacity: 0}}
                                        title={`Pay ${shop.salesTransaction?.salesAmount.total}`} 
                                        onClick={() => handleClickGoToPayment()}
                                      >
                                        {shop.salesTransactionLoading ? 'Please wait...' : 'Continue to Payment'}
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
                            )}      
                          </div>
                        </div>                    
                      </form>
                    )}
                  </>
                )}
              </>              
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ShopCheckoutContainer
