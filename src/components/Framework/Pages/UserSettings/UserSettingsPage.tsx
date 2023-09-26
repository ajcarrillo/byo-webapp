import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { UserSettingsContainer } from '../../../UserSettings'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserSettingsPageProps {}

export const UserSettingsPage: React.FC<IUserSettingsPageProps> = (props: IUserSettingsPageProps) => {
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
          <UserSettingsContainer />
        </div>
      )}
    </Transition>
  )
}