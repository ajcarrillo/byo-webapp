/* eslint-disable react/react-in-jsx-scope */
export const accountTypes = (style?: any) => {
  return (<div style={style}>
    <h3>About You</h3>
    <p>So we can better serve the needs of your new account, please tells us if you have any disabilities.</p>
  </div>)
}

export const profileName = (style?: any) => {
  return (<div style={style}>
    <h3>Profile Name</h3>
    <p>Please enter a profile name for you new account. Choose anything you like - maybe your gaming handle?</p>
  </div>)
}

export const emailAddress = (style?: any) => {
  return (<div style={style}>
    <h3>Email Address</h3>
    <p>Please enter a valid email address. We will send you an email after you sign up to confirm your new account.</p>
  </div>)
}

export const password = (style?: any, criteria?: string) => {
  return (<div style={style}>
    <h3>Password</h3>
    <p>When creating a password, please ensure that it conforms to the following criteria: <strong>{criteria}</strong></p>
  </div>)
}