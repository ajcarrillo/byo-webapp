import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { IStoreState } from '../../types/store-types'
import { isEmail, isEmpty, isPassword, passwordDescription } from '../../utils/validation-utils'
import { resetPasswordRequest, passwordChangeRequest } from '../../store/authentication/authentication-actions'
import Spinner from '../Spinner'
import GooBenderImage from '../../assets/images/goo-bender.png'
import './PasswordReset.css'

const initialErrors = {
  email: '',
  password: '',
  confPassword: '',
}

export const PasswordReset: React.FC = () => {
  const dispatch = useDispatch()
  const { 
    authentication: {
      passwordResetRequested, 
      passwordChanged, 
      authenticationLoading,
      apiError
    }
  } = useSelector<IStoreState, IStoreState>((store) => store)
  
  const [state, setState] = useState({
    email: '',
    resetCode: '',
    password: '',
    confPassword: ''
  })

  const [errors, setErrors] = useState(initialErrors)

  useEffect(() => {
    const url = new URL(window.location.href)
    const mail = url.searchParams.get('email')
    const reset = url.searchParams.get('resetCode')
    if(mail && reset){
      setState((prev) => ({
        ...prev,
        email: mail,
        resetCode: reset,
      }))
    }
  }, [])
  
  const handleInputEmailChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      email: value,
    }))
  }

  const handleInputPasswordChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      password: value,
    }))
  }

  const handleInputConfPasswordChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      confPassword: value,
    }))
  }

  const doResetRequest = (): void => {
    const e: any = {}

    if (!isEmail(state.email) || isEmpty(state.email))
      e.email = 'Please enter a valid email address.'

    if (Object.keys(e).length === 0) {
      dispatch(resetPasswordRequest(state.email))
      setErrors(initialErrors)
    } else {
      setErrors(e)
    }
  }

  const doPasswordChange = (): void => {
    const e: any = {}

    if (!isEmail(state.email) || isEmpty(state.email))
      e.email = 'Please enter a valid email address.'

    if (!isPassword(state.password) || isEmpty(state.password))
      e.password = 'Please supply a valid password.'

    if (state.password !== state.confPassword)
      e.confPassword = 'Passwords must match.'

    if (Object.keys(e).length === 0) {
      const postData = new FormData()
      postData.append('email', state.email)
      postData.append('password', state.password)
      postData.append('resetCode', state.resetCode)
      dispatch(passwordChangeRequest(postData))
      setErrors(initialErrors)
    } else {
      setErrors(e)
    }
  }

  useEffect(() => {
    // Used to reset API errors
    return () => {
      dispatch({ type: 'AUTH_RESET_API_ERROR' })
    }
  }, [dispatch])

  return (
    <>
      {authenticationLoading && (
        <Spinner />
      )}
      
      {state.resetCode ? (
        <>
          {passwordChanged ? (
            <div className="PasswordReset-container">
              <div className="PasswordReset-leftCol">
                <h1><span className="Colour-blue-bright">Pass</span><span className="Colour-white-bright">word</span> Reset</h1>
                <p style={{marginTop: '2rem'}}>That&apos;s all done for you. You can now <Link to="/sign-in" title='Sign In'>sign in</Link> with your new password.</p>
              </div>
            </div>
          ) : (
            <div className="PasswordReset-container">
              <div className="PasswordReset-leftCol">
                <form onSubmit={(e) => e.preventDefault()} autoComplete='off'>
                  <h1><span className="Colour-blue-bright">Pass</span><span className="Colour-white-bright">word</span> Reset</h1>
                  <div className="PanelLabel" style={{marginTop: '1.4rem', marginBottom: '.8rem'}}>Please enter your new password, which must contain the following:</div>
                  <div className="PanelInfo" style={{marginBottom: '.2rem', boxShadow: 'none'}}>{passwordDescription().join(', ')}</div>
                  
                  <input
                    className="Textfield-dark"
                    onChange={(e) => handleInputPasswordChange(e.target.value)}
                    value={state.password}
                    placeholder="New password"
                    type="password"
                    style={{ marginTop: '1rem', width: '100%' }}
                    data-lpignore="true"
                    autoComplete='new-password'
                  />
                  {errors.password && (
                    <div className="Formfield-error-inline">
                      {errors.password}
                    </div>
                  )}
                  
                  <input
                    className="Textfield-dark"
                    onChange={(e) => handleInputConfPasswordChange(e.target.value)}
                    value={state.confPassword}
                    placeholder="Confirm new password"
                    type="password"
                    style={{ marginTop: '1rem', width: '100%' }}
                    data-lpignore="true"
                    autoComplete='new-password'
                  />
                  {errors.confPassword && (
                    <div className="Formfield-error-inline">
                      {errors.confPassword}
                    </div>
                  )}
                  
                  {apiError && (
                    <div
                      className="Formfield-error-inline"
                      style={{ marginTop: '2rem' }}
                    >
                      <div>{apiError.message}</div>
                    </div>
                  )}
                  
                  <button
                    className="Button-standard"
                    style={{ marginTop: '1rem' }}
                    onClick={() => doPasswordChange()}
                  >
                    Reset My Password
                  </button>
                </form>
              </div>

              <div className="SignIn-rightCol">
                <div className="SignIn-logo-container">
                  <img src={GooBenderImage} alt="ByoWave Logo" />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {passwordResetRequested ? (
            <div className="PasswordReset-container">
              <div className="PasswordReset-leftCol">
                <h1><span className="Colour-blue-bright">Pass</span><span className="Colour-white-bright">word</span> Reset</h1>
                <p style={{marginTop: '2rem'}}>We just emailed you with instructions to reset your password.</p>
                <p style={{marginTop: '1rem'}}>If you didn&apos;t receive our email, please try the following:</p>
                <ul style={{marginTop: '1rem'}}>
                  <li>Check your junk or spam folder.</li>
                  <li>Try adding our email address <span className="Colour-blue-bright"><b>{process.env.REACT_APP_SITE_NOREPLY_EMAIL}</b></span> to your contacts list.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="PasswordReset-container">
              <div className="PasswordReset-leftCol">
                <h1><span className="Colour-blue-bright">Pass</span><span className="Colour-white-bright">word</span> Reset</h1>
                <div className="PanelLabel" style={{marginTop: '1.4rem', marginBottom: '.8rem'}}>To reset your password, please submit the email address connected to your account.</div>
                
                <input
                  className="Textfield-dark"
                  onChange={(e) => handleInputEmailChange(e.target.value)}
                  value={state.email}
                  placeholder="Email address" 
                  style={{ marginTop: '1rem', width: '100%' }}
                />
                {errors.email && (
                  <div className="Formfield-error-inline">{errors.email}</div>
                )}

                {apiError && (
                  <div
                    className="Formfield-error-inline"
                    style={{ marginTop: '2rem' }}
                  >
                    <div>{apiError.message}</div>
                  </div>
                )}

                <button
                  className="Button-standard"
                  style={{ marginTop: '1rem' }}
                  onClick={() => doResetRequest()}
                >
                  Request Password Reset
                </button> 
              </div>

              <div className="SignIn-rightCol">
                <div className="SignIn-logo-container">
                  <img src={GooBenderImage} alt="ByoWave Logo" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
