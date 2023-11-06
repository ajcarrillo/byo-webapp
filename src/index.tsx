import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import userStore from './store'
import App from './App'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import { CssBaseline } from '@mui/material'
import GlobalStyles from './GlobalStyles'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={userStore}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

if (window.Cypress) window.store = userStore