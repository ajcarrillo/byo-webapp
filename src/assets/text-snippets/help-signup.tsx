/* eslint-disable react/react-in-jsx-scope */
export const accountTypes = (style?: any) => {
  return (<div style={style}>
    <h2>Account Type</h2>
    <p>There are 3 main account types you can open here at <span className="Colour-orange-bright"><strong>iYango</strong></span>; <strong>Creator</strong>, <strong>Promoter</strong> &amp; <strong>Collector</strong>.</p>
    <h3>Creator</h3>
    <p style={{marginTop: '0'}}>Creator accounts are for those of you who actually create the content that Promoter accounts promote, and Collector accounts collect. Simple, right?</p>
    <h3>Promoter</h3>
    <p style={{marginTop: '0'}}>Using the tools we have built, you as a Promoter can engage with Creators, to help them build a fan base, drive sales and create awareness for their content. What makes iYango special, is that you get paid commission on any revenue generated from your efforts. </p>
    <h3>Collector</h3>
    <p style={{marginTop: '0'}}>Last but definitely not least, Collector accounts are for those of you looking to discover, buy, trade and collect new digital content. From film, to music, to Non-Fungible Tokens (NFT&apos;s), we&apos;ve got something for everyone at iYango. Select a Collector account which best describes you. Don&apos;t worry, you can always change your mind later.</p>
  </div>)
}

export const emailAddress = (style?: any) => {
  return (<div style={style}>
    <h2>Email Address</h2>
    <p>After you have created your new account, we will send you an email containing a link for you to click. Clicking the link confirms to us that you are the owner of the email address you supply. This is one of many security measures in place to protect your personal content.</p>
    <p>Sometimes our emails don&apos;t reach the recipient&apos;s <strong>Inbox</strong>, but instead end up in the <strong>Spam</strong> or <strong>Junk</strong> folder. If this happens, simply move our email to your <strong>Inbox</strong>. As an additional measure to ensure future emails reach you, add <span className="Colour-orange-bright"><strong>iYango</strong></span> as a contact using this email address: <strong>noreply@iyango.com</strong></p>
    <p><span className="Colour-orange-bright"><strong>iYango</strong></span> will never share or sell your email address to 3rd party marketing companies. That&apos;s not our style!</p>
  </div>)
}

export const password = (style?: any, criteria?: string) => {
  return (<div style={style}>
    <h2>Password</h2>
    <p>We cannot stress enough how important a strong password is these days. The Internet is crawling with hackers and nefarious entities, who work around the clock to hack accounts and steal personal information.</p>
    <p>At <span className="Colour-orange-bright"><strong>iYango</strong></span> we do our upmost to protect every aspect of your personal data, and storing your password securely is a priority for us. Once created, your password is encrypted in our database, which means nobody but you will know what it is.</p>
    <p>If you forget your password, we cannot send you a reminder, but instead will send you an email asking you to create a new one. You will find a link to create a new password on the <strong>Sign In</strong> page.</p>
    <p>When creating a password, please ensure that, at the very minimum, it conforms to the following criteria: <strong>{criteria}</strong></p>
  </div>)
}