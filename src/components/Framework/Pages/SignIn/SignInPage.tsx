import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import SignIn from '../../../SignIn'

interface ISignInPageProps {
  tokenIsValid: boolean;
  location: any;
}

export const SignInPage: React.FC<ISignInPageProps> = (props: ISignInPageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  const redirectTo = props.location.state 
    ? props.location.state.from.pathname 
    : '/'

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
            <SignIn tokenIsValid={props.tokenIsValid} redirectTo={redirectTo} />
          </div>
        )}
      </Transition>    
    </>
  )
}