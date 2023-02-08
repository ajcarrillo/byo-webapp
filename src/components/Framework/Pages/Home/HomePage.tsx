import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { HomeContainer } from '../../../Home'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IHomePageProps {}

export const HomePage: React.FC<IHomePageProps> = (props: IHomePageProps) => {
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
          <HomeContainer />
        </div>
      )}
    </Transition>
  )
}