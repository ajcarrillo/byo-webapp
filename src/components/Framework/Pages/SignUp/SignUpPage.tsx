import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import SignUp from '../../../SignUp'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISignInPageProps {}

export const SignUpPage: React.FC<ISignInPageProps> = (props: ISignInPageProps) => {
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
            <SignUp />
          </div>
        )}
      </Transition>
    </>
  )
}