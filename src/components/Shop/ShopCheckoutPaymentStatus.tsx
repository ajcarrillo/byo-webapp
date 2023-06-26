import React, { useEffect, useState } from 'react'
import {useStripe} from '@stripe/react-stripe-js'

interface IShopCheckoutPaymentStatusProps {
  stripeClientSecret: string,
  updatePayStatus: React.Dispatch<React.SetStateAction<string>>,
}

const ShopCheckoutPaymentStatus: React.FC<IShopCheckoutPaymentStatusProps> = (props: IShopCheckoutPaymentStatusProps) => {
  const { 
    stripeClientSecret,
    updatePayStatus
  } = props

  const stripe = useStripe()

  const [message, setMessage] = useState('')

  useEffect(() => {
    if(stripe){
      // Retrieve the PaymentIntent
      stripe
        .retrievePaymentIntent(stripeClientSecret)
        .then(({paymentIntent}) => {
          // Inspect the PaymentIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
          switch (paymentIntent?.status) {
          case 'succeeded':
            updatePayStatus('Succeeded')
            setMessage('Success! Payment received.')
            break

          case 'processing':
            setMessage('Payment processing. We\'ll update you when payment is received.')
            updatePayStatus('Processing')
            break

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            updatePayStatus('Failed')
            setMessage('Payment failed. Please try another payment method.')
            break

          default:
            updatePayStatus('Error')
            setMessage('Something went wrong.')
            break
          }
        })
    }
  }, [stripeClientSecret, stripe, updatePayStatus])

  return (null)
}

export default ShopCheckoutPaymentStatus