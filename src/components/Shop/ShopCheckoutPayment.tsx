import React, { useState } from 'react'
import parse from 'html-react-parser'
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { ShopSalesTransaction } from '../../types/shop-types'
import StripeLogo from '../../assets/images/stripe-logo.png'
import GooBender from '../../assets/images/spinner.png'
import './Shop.css'

interface IShopCheckoutPaymentProps {
  customerName: string,
  salesTransaction: ShopSalesTransaction
}

const ShopCheckoutPayment: React.FC<IShopCheckoutPaymentProps> = (props: IShopCheckoutPaymentProps) => {
  const { 
    customerName,
    salesTransaction: {
      salesAmount: {
        total,
      },
      taxAddress,
      transactionId,
    }
  } = props

  const [errorMessage, setErrorMessage] = useState('')
  const [stripeBusy, setStripeBusy] = useState(false)
  const [paymentElementLoading, setPaymentElementLoading] = useState(true)

  const stripe = useStripe()
  const elements = useElements()

  /**
   * Submits payment details then displays an error mesage, 
   * or redirects to payment-complete page
   */
  const handleClickSubmitPayment = async () => {
    if(!stripe || !elements) return

    setStripeBusy(true)
    setErrorMessage('')

    const redirectURL = `${process.env.REACT_APP_STRIPE_PAYMENT_COMPLETE_URL}&txId=${transactionId}`
    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectURL,
      },
    })

    setStripeBusy(false)
    if (error) setErrorMessage(error.message || '')
  }

  /**
   * Event fired from the PaymentElement when it is ready
   */
  const handleStripePaymentElementReady = () => {
    setPaymentElementLoading(false)
  }

  return (
    <div className='ShopCheckout-container'>
      <div className='ShopCheckout-container-leftCol'>
        <h3 style={{marginBottom: '1rem'}}>Payment</h3>
        <div className='PanelLabel'>
          <p style={{marginBottom: '1rem'}}>Your payment is completety secure, using SSL encryption with the Stripe Payment gateway.</p>
          <p>To complete your transaction, please enter your card details and click the pay button.</p>          
        </div>

        <div style={{display: 'none'}}>
          <AddressElement options={{
            mode: 'billing',
            defaultValues: {
              name: customerName,
              address: {
                line1: taxAddress.addressLine1,
                line2: taxAddress.addressLine2,
                city: taxAddress.townCity,
                ...(taxAddress.countryCode === 'US' && {state: taxAddress.regionCounty}),
                postal_code: taxAddress.zipPostcode,
                country: taxAddress.countryCode || '',
              }
            }
          }}/>
        </div>
        <div className='ShopPayment-stripelogo-container'>
          <img src={StripeLogo} alt='Stripe Payment Logo' />
        </div>
      </div>

      <div className='ShopCheckout-container-rightCol'>
        <form onSubmit={(e) => e.preventDefault()} autoComplete='off' style={{width: '100%'}}>
          <h3 style={{marginBottom: '1rem'}}>Card Details</h3>
          <PaymentElement onReady={handleStripePaymentElementReady} />

          {stripeBusy ? (
            <div className='ShopPayment-goobender-bounce-container'>
              <div className='ShopPayment-goobender-bounce BounceStretch'>
                <img src={GooBender} alt='Stripe Payment Logo' />
              </div>
            </div>
          ) : (
            <button 
              style={{marginTop: '1.8rem'}}
              className={stripeBusy || paymentElementLoading ? 'Button-standard-disabled' : 'Button-standard'} 
              disabled={stripeBusy || paymentElementLoading} 
              onClick={() => handleClickSubmitPayment()}
            >
              {stripeBusy || paymentElementLoading ? 'Please wait...' : parse(`Pay &euro;${total}`)}
            </button>            
          )}

          {errorMessage && (
            <div className='PanelAlert ShopPayment-error'>
              <i className='fa-solid fa-face-rolling-eyes'></i>
              <span>{errorMessage}</span>
            </div>
          )}
        </form>       
      </div>
    </div>
  )
}

export default ShopCheckoutPayment