import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import PasswordReset from '../../../PasswordReset'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPasswordResetPageProps {}

export const PasswordResetPage: React.FC<IPasswordResetPageProps> = (props: IPasswordResetPageProps) => {
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
            <PasswordReset />
          </div>
        )}
      </Transition>    
    </>
  )
}
