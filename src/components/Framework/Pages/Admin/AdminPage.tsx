import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { AdminContainer } from '../../../Admin'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminPageProps {}

export const AdminPage: React.FC<IAdminPageProps> = (props: IAdminPageProps) => {
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
          <AdminContainer />
        </div>
      )}
    </Transition>
  )
}