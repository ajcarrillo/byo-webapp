import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { AccessibilityContainer } from '../../../Accessibility'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAccessibilityPageProps {}

export const AccessibilityPage: React.FC<IAccessibilityPageProps> = (props: IAccessibilityPageProps) => {
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
          <AccessibilityContainer />
        </div>
      )}
    </Transition>
  )
}