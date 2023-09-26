export type PdfDocument = {
  documentAddress: string,
  documentCategory: string,
  documentName: string,
  documentDescription: string,
  documentFileAddress?: string,
  documentFileName?: string,
}

export type FirmwareBinary = {
  firmwareAddress: string,
  firmwareModule: string,
  firmwareVersion: string,
  firmwareChangeLog: string,
  firmwareFileAddress?: string,
  firmwareFileName?: string,
}