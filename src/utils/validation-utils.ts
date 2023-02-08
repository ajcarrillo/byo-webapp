export const isEmail = (email: string) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)

export const isUKPostcode = (postcode: string) => /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/.test(postcode)

export const isPunctuatedText = (text: string) => /[A-Za-z0-9 _.,!"'-/$]+/.test(text)

export const isText = (text: string) => /^[A-Za-z]+$/.test(text)

export const isNumeric = (text: string) => /^[0-9]+$/.test(text)

export const isNumber = (number: string) => typeof number === 'number'

export const isFloat = (num: string) => /^[-+]?[0-9]+\.[0-9]+$/.test(num)

export const isUrlWithProtocol = (url: string) => {
  // eslint-disable-next-line no-useless-escape
  const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
  const regex = new RegExp(exp)
  if (url.match(regex)) {
    return true
  } else {
    return false
  }
}

export const isPassword = (pass: string) =>
// To check a password between 8 to 32 characters
// which contain at least one numeric digit, one uppercase letter, one lowercase letter
// and one special character
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/.test(pass)

export const passwordDescription = () => ['One number', 'One uppercase letter', 'One lowercase letter', 'One special character', '8 to 32 characters in length']

export const isLength = (text: string, len: number) => text.length === len

export const isEmpty = (text: string) => text === undefined || text === null || text.length === 0
