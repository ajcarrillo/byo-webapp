import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { OrdersContainer } from '../../../Orders'

interface IOrdersPageProps {
  tokenIsValid: boolean,
}

export const OrdersPage: React.FC<IOrdersPageProps> = (props: IOrdersPageProps) => {
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
          <OrdersContainer tokenIsValid={props.tokenIsValid} />
        </div>
      )}
    </Transition>
  )
}