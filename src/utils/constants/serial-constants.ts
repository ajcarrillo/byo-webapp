export const COM_START_REQUEST = [0x5A, 0x5C, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
export const COM_START_RESPONSE = ['5B', '5C', '01', '00', '00', '00', '00', '00', '00', '00', '01', '00']

export const COM_END_REQUEST = [0x5A, 0x5C, 0x02, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
export const COM_END_RESPONSE = ['5B', '5C', '02', '00', '00', '00', '00', '00', '00', '00', '01', '00']

export const COM_GET_APP_01_VERSION_REQUEST = [0x5A, 0x5C, 0x08, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
export const COM_GET_APP_01_VERSION_RESPONSE = ['5B', '5C', '08', '01', '00', '00', '00', '00', '00', '00', '####', '00']
