import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { IStoreState } from '../../types/store-types'
import { isEmail, isEmpty, isPassword } from '../../utils/validation-utils'
import Spinner from '../Spinner'
import { signInRequest } from '../../store/authentication/authentication-actions'
import GooBenderImage from '../../assets/images/goo-bender.png'
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
      setErrors(initialErrors)
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

  useEffect(() => {
    // Used to reset API errors
    return () => {
      dispatch({ type: 'AUTH_RESET_API_ERROR' })
    }
  }, [dispatch])

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
          <form onSubmit={(e) => e.preventDefault()} autoComplete='off'>
            <h1><span className="Colour-blue-bright">Sign</span><span className="Colour-white-bright">In</span></h1>
            <div className="PanelLabel" style={{marginTop: '1.4rem', marginBottom: '.8rem'}}>If you have forgotten your password, please <Link to="/pass-reset">click here</Link> to reset it.</div>
            
            <input
              className="Textfield-dark"
              onChange={(e) => handleInputEmailChange(e.target.value)}
              value={state.email}
              placeholder="Email address" 
              type="email" 
              data-lpignore="true"
              autoComplete='off'
              style={{ marginTop: '1rem', width: '100%' }}
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
              data-lpignore="true"
              autoComplete='new-password'
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
              style={{ marginTop: '1.2rem' }}
              onClick={() => doLogin()}
            >
              Sign In
            </button>
          </form>            
        </div>

        <div className="SignIn-rightCol">
          <div className="SignIn-logo-container">
            <img src={GooBenderImage} alt="ByoWave Logo" />
          </div>
        </div>
      </div>
    </>
  )
}
