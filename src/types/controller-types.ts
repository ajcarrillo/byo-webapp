export enum XBoxButton {
  analogYStandard,    // Non-standard - suggested flag to reset inverted Y axis for analog
  analogYInverted,    // Non-standard - suggested flag to invert the Y axis for analog
  leftAnalog,         // Can only be swapped left to right - can invert Y axis
  leftAnalogPress,    // Allow button remap
  rightAnalog,        // Can only be swapped right to left - can invert Y axis
  rightAnalogPress,   // Allow button remap
  dPadUp,             // Allow button remap
  dPadDown,           // Allow button remap
  dPadLeft,           // Allow button remap
  dPadRight,          // Allow button remap
  a,                  // Allow button remap
  b,                  // Allow button remap
  x,                  // Allow button remap
  y,                  // Allow button remap
  leftButton,         // Allow button remap
  rightButton,        // Allow button remap
  leftTrigger,        // Can only be swapped left to right
  rightTrigger,       // Can only be swapped right to left
  back,               // Cannot be remapped
  start,              // Cannot be remapped
}

export enum ModuleCategory {
  body,
  buttons,
  plugs,
  handles,
  custom,
}

export enum ModuleType {
  mother      = 0x00,
  analog      = 0x01,
  edge        = 0x02,
  spacer      = 0x03,
  dPad        = 0x04,
  fourButton  = 0x05,
  twoButton   = 0x06,
  oneButton   = 0x07,
  power       = 0x08,
}

export enum ModuleFace {
  front,
  back,
  left,
  right,
  top,
  bottom,
}

export enum ModuleFaceType {
  male,
  female,
  none,
  control,
}

export type ModuleButton = {
  default: XBoxButton,
  mapping: XBoxButton,
}

export type ModuleFaces = {
  top: ModuleFaceType,
  bottom: ModuleFaceType,
  left: ModuleFaceType,
  right: ModuleFaceType,
  front: ModuleFaceType,
  back: ModuleFaceType,
}

export type Module = {
  address: string,
  name: string,
  desc: string,
  category: ModuleCategory,
  type: ModuleType,
  faces: ModuleFaces,
  buttons: ModuleButton[],
}

export interface IModule {
  id: number,
  module: Module,
  rotation: number,
  connectsToId: number | null,
  connectsToFace: ModuleFace | null,
}

export type Controller = {
  userAddress: string,
  controllerAddress: string,
  imageAddress: string,
  name: string,
  rating: number,
}

export type ControllerConfiguration = {
  controller: Controller,
  modules: IModule[],
}
