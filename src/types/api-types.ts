export type APIResponse = {
  status: number,
  message: string,
  data: any,
}

export type APIError = {
  status: number,
  scope: string,
  message: string,
  code: string,
}

export type ContentHeaders = {
  'Accept': string,
  'Content-Type'?: string,
}