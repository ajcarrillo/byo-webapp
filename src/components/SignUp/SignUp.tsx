import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select, { SingleValue } from 'react-select'
import { Link } from 'react-router-dom'

import { IStoreState } from '../../types/store-types'
import { AccountType } from '../../types/user-account-types'
import { isEmail, isEmpty, isPassword, isPunctuatedText, passwordDescription } from '../../utils/validation-utils'
import Spinner from '../Spinner'
import { signUpRequest, resendEmailRequest, confirmEmailRequest } from '../../store/authentication/authentication-actions'
import { reactSelectCustomStyles } from '../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../CustomControls/SelectDropdown/ReactSelectInput'
import { 
  accountTypes as accountTypesHelpText,
  emailAddress as emailAddressHelpText,
  password as passwordHelpText, 
  profileName as profileNameHelpText
} from '../../assets/text-snippets/help-signup'
import { Checkbox } from '../CustomControls'
import GooBenderImage from '../../assets/images/goo-bender.png'
import './SignUp.css'

const initialErrors = {
  accountType: '',
  email: '',
  password: '',
  confPassword: '',
  profileName: '',
  privacyPolicy: '',
  termsConditions: '',
}

interface ISignUpProps {
  locale: string,
}

type SignnupTypes = {
  accountType: SingleValue<AccountType>,
  email: string,
  password: string,
  confPassword: string,
  profileName: string,
  privacyPolicy: string,
  termsConditions: string,
}

export const SignUp: React.FC<ISignUpProps> = (props: ISignUpProps) => {
  const dispatch = useDispatch()
  const { locale } = props
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

  const accountTypeList: AccountType[] = [
    {label: 'I am a disabled gamer', value: 'disabled'},
    {label: 'I am an able-bodied gamer', value: 'ableBodied'}
  ]

  const [state, setState] = useState<SignnupTypes>({
    accountType: null,
    email: '',
    password: '',
    confPassword: '',
    profileName: '',
    privacyPolicy: 'no',
    termsConditions: 'no',
  })

  const [errors, setErrors] = useState(initialErrors)

  const help = {
    profileName: profileNameHelpText({fontSize: '1rem'}),
    accountType: accountTypesHelpText({fontSize: '1rem'}),
    email: emailAddressHelpText({fontSize: '1rem'}),
    password: passwordHelpText({fontSize: '1rem'}, passwordDescription().join(', '))
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

    if (isEmpty(state.profileName) || !isPunctuatedText(state.profileName))
      e.profileName = 'Please enter a profile name.'

    if (state.privacyPolicy === 'no')
      e.privacyPolicy = 'Please accept the privacy policy.'

    if (state.termsConditions === 'no')
      e.termsConditions = 'Please accept the terms & conditions.'

    if (Object.keys(e).length === 0) {
      const postData = new FormData()
      postData.append('email', state.email)
      postData.append('password', state.password)
      postData.append('profileName', state.profileName)
      postData.append('accountType', (state.accountType || {}).value || '')
      postData.append('locale', locale || '')
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
      return <p style={{marginTop: '2rem'}}>Thank you for confirming your email. You can now <Link to="/sign-in" title="Sign In">Sign In</Link> to your new account.</p>
    } else if(!authenticationLoading && confirmingEmail && !emailConfirmed){
      return <p style={{marginTop: '2rem'}}>Error confirming your email.</p>
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

  const handleInputProfileNameChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      profileName: value,
    }))
  }

  const handleClickPrivacyPolicy = (value: string) => {
    setState((prev) => ({
      ...prev,
      privacyPolicy: value,
    }))
  }

  const handleClickTermsConditions = (value: string) => {
    setState((prev) => ({
      ...prev,
      termsConditions: value,
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
            <p style={{marginTop: '2rem'}}>Before you can use your account, we need you to confirm your email address. We just emailed you with instructions to complete the signup process.</p>
            <p style={{marginTop: '1rem'}}>If you didn&apos;t receive our email, please try the following:</p>
            <ul style={{marginTop: '1rem'}}>
              <li>Check your junk or spam folder.</li>
              <li>Try adding our email address <span className="Colour-blue-bright"><b>{process.env.REACT_APP_SITE_NOREPLY_EMAIL}</b></span> to your contacts list.</li>
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
              style={{ marginTop: '2rem' }} 
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
                <form onSubmit={(e) => e.preventDefault()} autoComplete='off'>
                  <h1><span className="Colour-blue-bright">Sign</span><span className="Colour-white-bright">Up</span></h1>
                  <div className="PanelLabel" style={{marginTop: '1.4rem', marginBottom: '.8rem'}}>You&apos;re just a few clicks away from joining the ByoWave community.</div>
                  
                  <input
                    className="Textfield-dark" 
                    type='text' 
                    onChange={(e) => handleInputEmailChange(e.target.value)} 
                    onFocus={() => handleHelpTextChange(help.email)} 
                    onBlur={() => handleHelpTextChange('')} 
                    value={state.email}
                    placeholder="Email address" 
                    style={{ marginTop: '1rem', width: '100%' }}
                    data-lpignore="true"
                    autoComplete='off'
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
                    onFocus={() => handleHelpTextChange('')} 
                    value={state.confPassword}
                    placeholder="Confirm password"
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

                  <input
                    className="Textfield-dark"
                    onChange={(e) => handleInputProfileNameChange(e.target.value)} 
                    onFocus={() => handleHelpTextChange(help.profileName)} 
                    onBlur={() => handleHelpTextChange('')} 
                    value={state.profileName}
                    placeholder="Profile name"
                    type="text" 
                    style={{ marginTop: '1rem', width: '100%' }}
                    data-lpignore="true"
                  />
                  {errors.profileName && (
                    <div className="Formfield-error-inline">
                      {errors.profileName}
                    </div>
                  )}

                  <div style={{marginTop: '1rem'}}>
                    <Select  
                      styles={reactSelectCustomStyles} 
                      options={accountTypeList} 
                      value={state.accountType} 
                      onChange={(opt) => handleAccountTypeChange(opt)} 
                      onFocus={() => handleHelpTextChange(help.accountType)} 
                      onBlur={() => handleHelpTextChange('')} 
                      placeholder='I am...' 
                      components={{ Input: ReactSelectInput }} 
                    />
                  </div>
                  {errors.accountType && (
                    <div className="Formfield-error-inline">{errors.accountType}</div>
                  )}

                  <div style={{marginTop: '1.6rem', marginLeft: '.4rem'}}>
                    <Checkbox
                      size='small' 
                      selectedValue="yes" 
                      unselectedValue="no"
                      value={state.privacyPolicy}
                      text={(<span>I have read the <a href="/privacy-policy" target={'_blank'}>Privacy Policy</a></span>)}
                      onChange={(val: string) => handleClickPrivacyPolicy(val)} 
                    />                    
                  </div>
                  {errors.privacyPolicy && (
                    <div className="Formfield-error-inline">{errors.privacyPolicy}</div>
                  )}

                  <div style={{marginTop: '1rem', marginLeft: '.4rem'}}>
                    <Checkbox
                      size='small' 
                      selectedValue="yes" 
                      unselectedValue="no"
                      value={state.termsConditions}
                      text={(<span>I accept the <a href="/terms-conditions" target={'_blank'}>Terms &amp; Conditions</a></span>)}
                      onChange={(val: string) => handleClickTermsConditions(val)} 
                    />                    
                  </div>
                  {errors.termsConditions && (
                    <div className="Formfield-error-inline">{errors.termsConditions}</div>
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
                    Done
                  </button>                  
                </form>
              </div>

              <div className="SignUp-rightCol">
                <div className="SignUp-fade-container">
                  <div className="SignUp-logo-container" style={{position: 'absolute'}}>
                    <img src={GooBenderImage} alt="Goo Bender" />
                  </div>
                  <div className={`SignUp-fade-element ${helpPanelClasses}`}>
                    <div className='SignUp-help-container'>{helpText}</div>
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
