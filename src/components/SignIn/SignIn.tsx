import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { IStoreState } from '../../types/store-types'
//import SimpleScrollPane from "../ScrollPane/SimpleScrollPane";
import { isEmail, isEmpty, isPassword } from '../../utils/validation-utils'
import Spinner from '../Spinner'
import { signInRequest } from '../../store/authentication/authentication-actions'
import LogoImage from '../../assets/images/byowave-logo-header.png'
import './SignIn.css'

const initialErrors = {
  email: '',
  password: '',
}

interface ISignInProps {
  redirectTo: string;
}

export const SignIn: React.FC<ISignInProps> = (props: ISignInProps) => {
  const dispatch = useDispatch()
  const { 
    authentication: {
      accessTokenValid,
      authenticationLoading,
      apiError
    }
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [state, setState] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState(initialErrors)

  const doLogin = (): void => {
    const e: any = {}

    if (!isEmail(state.email) || isEmpty(state.email))
      e.email = 'Please enter a valid email address.'

    if (!isPassword(state.password) || isEmpty(state.password))
      e.password = 'Please supply a valid password.'

    if (Object.keys(e).length === 0) {
      const postData = new FormData()
      postData.append('email', state.email)
      postData.append('password', state.password)
      dispatch(signInRequest(postData))
    } else {
      setErrors(e)
    }
  }

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

  if (accessTokenValid) {
    return <Redirect to={props.redirectTo} />
  }

  return (
    <>
      {authenticationLoading && (
        <Spinner />
      )}

      <div className="SignIn-container">
        <div className="SignIn-leftCol">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1><span className="Colour-orange-bright">Sign</span><span className="Colour-white-bright">In</span></h1>
            <div className="PanelLabel" style={{marginTop: '1rem', marginBottom: '.4rem'}}>If you have forgotten your password, please <Link to="/pass-reset">click here</Link> to reset it.</div>
            <input
              className="Textfield-dark"
              onChange={(e) => handleInputEmailChange(e.target.value)}
              value={state.email}
              placeholder="Email address" 
              type="email" 
              autoComplete="on" 
              style={{ width: '100%' }}
            />
            {errors.email && (
              <div className="Formfield-error-inline">{errors.email}</div>
            )}
            <input
              className="Textfield-dark"
              onChange={(e) => handleInputPasswordChange(e.target.value)}
              value={state.password}
              placeholder="Password"
              type="password" 
              autoComplete="on" 
              style={{ marginTop: '1rem', width: '100%' }}
            />
            {errors.password && (
              <div className="Formfield-error-inline">
                {errors.password}
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
              onClick={() => doLogin()}
            >
              Sign In
            </button>
          </form>            
        </div>

        <div className="SignIn-rightCol">
          <div className="SignIn-logo-container">
            <img src={LogoImage} alt="ByoWave Logo" />
          </div>
        </div>
      </div>
    </>
  )
}
