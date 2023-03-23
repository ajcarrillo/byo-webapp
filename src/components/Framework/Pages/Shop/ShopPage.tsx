import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ShopContainer } from '../../../Shop'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShopPageProps {}

export const ShopPage: React.FC<IShopPageProps> = (props: IShopPageProps) => {
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
          <ShopContainer />
        </div>
      )}
    </Transition>
  )
}