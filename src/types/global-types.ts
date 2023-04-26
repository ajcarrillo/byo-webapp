export type Modify<T, R> = Omit<T, keyof R> & R

export type SelectType = {
  readonly label: string,
  readonly value: string,
}

export type UserDeviceType = {
  type: string,
  orientation: string,
  os: string,
  osVersion: string,
  browser: string,
  browserVersion: string,
  mobileMake: string,
  mobileModel: string,
  locale: string,
  isSmallScreen: boolean,
}