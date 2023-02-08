import React from 'react'
import { Provider } from 'react-redux'

import PageRouter from '../PageRouter'
import store from '../../../store'

export const AppContainer: React.FC = () => {
  return (
    <Provider store={store}>
      <PageRouter /> 
    </Provider>    
  )
}
