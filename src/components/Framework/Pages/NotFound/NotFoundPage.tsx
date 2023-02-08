import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { NotFoundContainer } from '../../../NotFound'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface INotFoundPageProps {}

export const NotFoundPage: React.FC<INotFoundPageProps> = (props: INotFoundPageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  return (
    <>
      <Transition in appear timeout={transitionDuration} nodeRef={nodeRef}>
        {(transState) => (
          <div
            style={{
              ...defaultTransitionStyle,
              ...transitionStyles[transState],
            }}
            ref={nodeRef}
          >
            <NotFoundContainer />
          </div>
        )}
      </Transition>    
    </>
  )
}