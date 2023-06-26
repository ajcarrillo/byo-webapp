import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ShopGroupContainer } from '../../../Shop'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShopGroupPageProps {}

export const ShopGroupPage: React.FC<IShopGroupPageProps> = (props: IShopGroupPageProps) => {
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
          <ShopGroupContainer />
        </div>
      )}
    </Transition>
  )
}