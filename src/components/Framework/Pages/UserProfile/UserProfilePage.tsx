import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { UserProfileContainer } from '../../../UserProfile'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserProfilePageProps {}

export const UserProfilePage: React.FC<IUserProfilePageProps> = (props: IUserProfilePageProps) => {
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
          <UserProfileContainer />
        </div>
      )}
    </Transition>
  )
}