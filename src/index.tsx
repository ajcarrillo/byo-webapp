import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import userStore from './store'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={userStore}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

if(window.Cypress) window.store = userStore