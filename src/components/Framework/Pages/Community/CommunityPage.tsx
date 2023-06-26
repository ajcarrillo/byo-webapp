import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { CommunityContainer } from '../../../Community'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICommunityPageProps {}

export const CommunityPage: React.FC<ICommunityPageProps> = (props: ICommunityPageProps) => {
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
          <CommunityContainer />
        </div>
      )}
    </Transition>
  )
}