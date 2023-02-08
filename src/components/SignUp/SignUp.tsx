import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select, {SingleValue} from 'react-select'
import { Link } from 'react-router-dom'

import { IStoreState } from '../../types/store-types'
import { AccountType, groupedAccountOptions } from '../../types/user-account-types'
import { isEmail, isEmpty, isPassword, passwordDescription } from '../../utils/validation-utils'
import Spinner from '../Spinner'
import { signUpRequest, resendEmailRequest, confirmEmailRequest } from '../../store/authentication/authentication-actions'
import { reactSelectCustomStyles } from '../CustomControls/SelectDropdown/custom-styles'
import { 
  accountTypes as accountTypesHelpText,
  emailAddress as emailAddressHelpText,
  password as passwordHelpText  
} from '../../assets/text-snippets/help-signup'
import ScrollPanel from '../ScrollPanel'
import './SignUp.css'

const initialErrors = {
  accountType: '',
  email: '',
  password: '',
  confPassword: '',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISignUpProps {}

type SignnupTypes = {
  accountType: SingleValue<AccountType>,
  email: string,
  password: string,
  confPassword: string,
}

export const SignUp: React.FC<ISignUpProps> = (props: ISignUpProps) => {
  const dispatch = useDispatch()
  const { 
    authentication: {
      signupComplete,
      emailResent,
      confirmingEmail, 
      emailConfirmed, 
      authenticationLoading,
      apiError
    }
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [state, setState] = useState<SignnupTypes>({
    accountType: null,
    email: '',
    password: '',
    confPassword: ''
  })

  const [errors, setErrors] = useState(initialErrors)

  const help = {
    accountType: accountTypesHelpText({fontSize: '.8rem'}),
    email: emailAddressHelpText({fontSize: '.8rem'}),
    password: passwordHelpText({fontSize: '.8rem'}, passwordDescription().join(', '))
  }
  const [helpText, setHelpText] = useState<any>(() => <p></p>)
  const [helpPanelClasses, setHelpPanelClasses] = useState('')

  const confirmEmail = useCallback((emailCode: string, email: string) => {
    dispatch(confirmEmailRequest(emailCode, email))
  }, [dispatch])
  
  useEffect(() => {
    const url = new URL(window.location.href)
    const eC = url.searchParams.get('emailConf')
    const e = url.searchParams.get('email')
    if(eC && e){
      confirmEmail(eC, e)
    }
  }, [confirmEmail])

  const doSignup = (): void => {
    const e: any = {}

    if (state.accountType === null)
      e.accountType = 'Please select an account type.'

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
      postData.append('accountType', (state.accountType || {}).value || '')
      dispatch(signUpRequest(postData))
    } else {
      setErrors(e)
    }
  }

  const requestNewEmail = () => {
    const postData = new FormData()
    postData.append('email', state.email)
    postData.append('password', state.password)
    dispatch(resendEmailRequest(postData))
  }

  const displayEmailConfirmMessage = () => {
    if(!authenticationLoading && confirmingEmail && emailConfirmed){
      return <p>Thank you for confirming your email. You can now <Link to="/sign-in" title="Sign In">Sign In</Link> to your new account.</p>
    } else if(!authenticationLoading && confirmingEmail && !emailConfirmed){
      return <p>Error confirming your email.</p>
    }
  }

  const handleInputEmailChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      email: value,
    }))
  }

  const handleAccountTypeChange = (value: SingleValue<AccountType>) => {
    setState((prev) => ({
      ...prev,
      accountType: value,
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

  const handleHelpTextChange = (value: any) => {
    setHelpText(value)
    if(value){
      setHelpPanelClasses('SignUp-fade-element-show')
    } else {
      setHelpPanelClasses('')
    }
  }

  return (
    <>
      {authenticationLoading && (
        <Spinner />
      )}

      {signupComplete ? (
        <div className="SignUp-container">
          <div className="SignUp-leftCol">
            <h1><span className="Colour-blue-bright">Sign</span><span className="Colour-white-bright">Up</span> Complete</h1>
            <p>Before you can use your account, we need you to confirm your email address. We just emailed you with instructions to complete the signup process.</p>
            <p>If you don&apos;t receive our email, please try the following:</p>
            <ul>
              <li>- Check your junk or spam folder.</li>
              <li>- Try adding our email address <span className="Colour-blue-bright"><b>{process.env.REACT_APP_SITE_NOREPLY_EMAIL}</b></span> to your contacts list.</li>
            </ul>
            {emailResent && (
              <div
                className="Formfield-error-inline"
                style={{ marginTop: '2rem' }}
              >
                <div>Email resent</div>
              </div>
            )}
            <button
              className="Button-standard" 
              style={{ marginTop: '1rem' }} 
              onClick={() => requestNewEmail()}
            >
              Request a new email
            </button>
          </div>
        </div>
      ) : (
        <>
          {confirmingEmail ? (
            <div className="SignUp-container">
              <div>
                <h1><span className="Colour-blue-bright">Email</span><span className="Colour-white-bright">Address</span> Confirmed</h1>
                <>{displayEmailConfirmMessage()}</>                
              </div>
            </div>
          ) : (
            <div className="SignUp-container">
              <div className="SignUp-leftCol">
                <form onSubmit={(e) => e.preventDefault()}>
                  <h1><span className="Colour-blue-bright">Sign</span><span className="Colour-white-bright">Up</span></h1>
                  <div className="PanelLabel" style={{marginTop: '1rem', marginBottom: '.4rem'}}>You&apos;re just a few clicks away from joining the Mediaverse.</div>
                  <Select  
                    styles={reactSelectCustomStyles} 
                    options={groupedAccountOptions} 
                    value={state.accountType} 
                    onChange={(opt) => handleAccountTypeChange(opt)} 
                    onFocus={() => handleHelpTextChange(help.accountType)} 
                    onBlur={() => handleHelpTextChange('')} 
                    placeholder='Account type' 
                  />
                  {errors.accountType && (
                    <div className="Formfield-error-inline">{errors.accountType}</div>
                  )}
                  <input
                    className="Textfield-dark" 
                    type='text' 
                    onChange={(e) => handleInputEmailChange(e.target.value)} 
                    onFocus={() => handleHelpTextChange(help.email)} 
                    onBlur={() => handleHelpTextChange('')} 
                    value={state.email}
                    placeholder="Email address" 
                    style={{ marginTop: '1rem', width: '100%' }}
                  />
                  {errors.email && (
                    <div className="Formfield-error-inline">{errors.email}</div>
                  )}
                  <input
                    className="Textfield-dark"
                    onChange={(e) => handleInputPasswordChange(e.target.value)} 
                    onFocus={() => handleHelpTextChange(help.password)} 
                    onBlur={() => handleHelpTextChange('')} 
                    value={state.password}
                    placeholder="Password"
                    type="password" 
                    autoComplete="off" 
                    style={{ marginTop: '1rem', width: '100%' }}
                  />
                  {errors.password && (
                    <div className="Formfield-error-inline">
                      {errors.password}
                    </div>
                  )}
                  <input
                    className="Textfield-dark"
                    onChange={(e) => handleInputConfPasswordChange(e.target.value)} 
                    onFocus={() => handleHelpTextChange('')} 
                    value={state.confPassword}
                    placeholder="Confirm password"
                    type="password" 
                    autoComplete="off" 
                    style={{ marginTop: '1rem', width: '100%' }}
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
                    style={{ marginTop: '1.2rem' }}
                    onClick={() => doSignup()}
                  >
                    Sign Up
                  </button>                  
                </form>
              </div>

              <div className="SignUp-rightCol">
                <div className="SignUp-fade-container">
                  <div className="SignUp-logo-container" style={{position: 'absolute'}}>
                    <img src="/img/logo-mediaverse.png" alt="iYango Logo" />
                  </div>
                  <div className={`SignUp-fade-element ${helpPanelClasses}`}>
                    <div className='SignUp-help-container'>
                      <i className={'fa-solid fa-face-smile-wink'}></i>
                      <ScrollPanel width={'100%'} height={'100%'} content={helpText} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </>
  )
}
