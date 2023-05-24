/**
 * Returns the button/control name from the input report
 * @param data The input report data view
 * @returns String or undefined
 */
const resolveInputReport = (data: DataView) => {
  const stickLeftX = detectAnalogMovement(data.getUint8(1))
  const stickLeftY = detectAnalogMovement(data.getUint8(3))
  const stickRightX = detectAnalogMovement(data.getUint8(5))
  const stickRightY = detectAnalogMovement(data.getUint8(7))
  const triggersA = data.getUint8(8)
  const triggersB = data.getUint8(9)  
  const digitalButtons = data.getUint8(10)
  const analogButtons = data.getUint8(11)

  if (digitalButtons !== 0) return resolveHIDButton(digitalButtons)
  if (analogButtons !== 0) return resolveHIDAnalogButton(analogButtons)
  if (triggersA === 128 && triggersB > 128) return 'leftTrigger'
  if (triggersA === 128 && triggersB < 128) return 'rightTrigger'
  if (stickLeftX || stickLeftY) return 'leftAnalog'
  if (stickRightX || stickRightY) return 'rightAnalog'

  return undefined
}

/**
 * Returns the name of the button from the HID input report
 * @param buttonNumber The button number
 * @returns The string value of the button name
 */
const resolveHIDButton = (buttonNumber: number) => {
  switch(buttonNumber){
  case 1:
    return 'a'
  case 2:
    return 'b'
  case 4:
    return 'x'
  case 8:
    return 'y'
  case 16:
    return 'leftButton'
  case 32:
    return 'rightButton'
  case 64:
    return 'select'
  case 128:
    return 'start'
  default:
    return undefined
  }
}

/**
 * Returns the name of the button from the HID input report
 * @param buttonNumber The button number
 * @returns The string value of the button name
 */
const resolveHIDAnalogButton = (buttonNumber: number) => {
  switch(buttonNumber){
  case 1:
    return 'leftAnalogPress'
  case 2:
    return 'rightAnalogPress'
  case 4:
    return 'dPadUp'
  case 12:
    return 'dPadRight'
  case 20:
    return 'dPadDown'
  case 28:
    return 'dPadLeft'
  default:
    return undefined
  }
}

/**
 * Detects a stick/trigger movement, given a resting value of 128 +- a deadzone
 * @param input Input from the stick/trigger
 * @param deadzone A deadzone in case a stick/trigger is not trimmed correctly
 * @returns True/False
 */
const detectAnalogMovement = (input: number, deadzone = 20) => {
  return (input < (128 - deadzone)) || (input > (128 + deadzone))
}

export {
  resolveInputReport,
}
