export const transitionDuration = 300

export const defaultTransitionStyle = {
  transition: `opacity ${transitionDuration}ms ease-in-out`,
  opacity: 0,
}

export const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: { opacity: 0 },
}