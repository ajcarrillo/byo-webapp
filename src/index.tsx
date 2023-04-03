import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import userStore from './store'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={userStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

if(window.Cypress) window.store = userStore