import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ShopBasketContainer } from '../../../Shop'

interface IBasketPageProps {
  tokenIsValid: boolean,
}

export const BasketPage: React.FC<IBasketPageProps> = (props: IBasketPageProps) => {
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
          <ShopBasketContainer tokenIsValid={props.tokenIsValid} />
        </div>
      )}
    </Transition>
  )
}