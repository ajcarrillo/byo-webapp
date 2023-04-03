import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ShopCheckoutContainer } from '../../../Shop'

interface ICheckoutPageProps {
  tokenIsValid: boolean,
}

export const CheckoutPage: React.FC<ICheckoutPageProps> = (props: ICheckoutPageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  return (
    <Transition in appear timeout={transitionDuration} nodeRef={nodeRef}>
      {(transState) => (
        <div
          style={{
            ...defaultTransitionStyle,
            ...transitionStyles[transState],
          }}
          ref={nodeRef}
        >
          <ShopCheckoutContainer tokenIsValid={props.tokenIsValid} />
        </div>
      )}
    </Transition>
  )
}