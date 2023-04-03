import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ShopProductContainer } from '../../../Shop'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProductPageProps {}

export const ProductPage: React.FC<IProductPageProps> = (props: IProductPageProps) => {
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
          <ShopProductContainer />
        </div>
      )}
    </Transition>
  )
}