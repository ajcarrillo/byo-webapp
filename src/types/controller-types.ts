import { APIError } from './api-types'

enum XBoxButton {
  analogYStandard,    // Non-standard - suggested flag to reset inverted Y axis for analog
  analogYInverted,    // Non-standard - suggested flag to invert the Y axis for analog
  leftAnalog,         // Can only be swapped left to right - can invert Y axis
  leftAnalogPush,     // Allow button remap
  rightAnalog,        // Can only be swapped right to left - can invert Y axis
  rightAnalogPush,    // Allow button remap
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

enum ModuleCategory {
  body,
  buttons,
  plugs,
  handles,
  custom,
}

enum ModuleType {
  cube        = 0x00,
  analog      = 0x01,
  edge        = 0x02,
  spacer      = 0x03,
  dPad        = 0x04,
  fourButton  = 0x05,
  twoButton   = 0x06,
  oneButton   = 0x07,
  power       = 0x08,
}

enum ModuleFace {
  front,
  back,
  left,
  right,
  top,
  bottom,
}

enum ModuleFaceType {
  male,
  female,
  none,
  control,
  power,
}

export type ModuleButtons = {
  default: XBoxButton | null,
  mappedTo: XBoxButton,
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
  buttons: ModuleButtons[],
}

export type Controller = {
  address: string,
  name: string,
}

export interface IModuleState {
  id: number,
  module: Module,
  rotation: number,
  connectsToId: number | null,
  connectsToFace: ModuleFace | null,
}

export interface IControllerState {
  controller: Controller,
  modules: IModuleState[],
}

export interface IProteusState {
  modulesLoading: boolean,
  apiError: APIError | null;
  version: string | undefined,
  modules: Module[] | null,
}

// CONFIG

// Cube module acting as the parent - ID 0
const cube: IModuleState = {
  id: 0, // ** Required from hardware **
  module: {
    address: 'abc123', // From database
    name: 'Cube', // From database
    desc: 'A cube module', // From database
    category: ModuleCategory.body, // From database
    type: ModuleType.cube, // ** Required from hardware **
    faces: {
      top: ModuleFaceType.male, // From database
      bottom: ModuleFaceType.female, // From database
      left: ModuleFaceType.female, // From database
      right: ModuleFaceType.female, // From database
      front: ModuleFaceType.female, // From database
      back: ModuleFaceType.female, // From database
    },
    buttons: [], // ** Required from hardware **
  },
  rotation: 0, // ** Required from hardware **
  connectsToId: null, // ** Required from hardware **
  connectsToFace: null, // ** Required from hardware **
}

// Analog module mapped to left stick, and connected to left face of ID 0
const analogLeft: IModuleState = {
  id: 1,
  module: {
    address: '321cba',
    name: 'Analog',
    desc: 'A analog module',
    category: ModuleCategory.body,
    type: ModuleType.analog,
    faces: {
      top: ModuleFaceType.male,
      bottom: ModuleFaceType.female,
      left: ModuleFaceType.female,
      right: ModuleFaceType.female,
      front: ModuleFaceType.control,
      back: ModuleFaceType.female,
    },
    buttons: [
      {default: null, mappedTo: XBoxButton.leftAnalog},
      {default: null, mappedTo: XBoxButton.leftAnalogPush},
      {default: XBoxButton.analogYStandard, mappedTo: XBoxButton.analogYStandard},
    ]
  },
  rotation: 0,
  connectsToId: 0,
  connectsToFace: ModuleFace.left,
}

// Analog module mapped to right stick with Y axis inverted, and connected to right face of ID 0
const analogRight: IModuleState = {
  id: 2,
  module: {
    address: '321cba',
    name: 'Analog',
    desc: 'A analog module',
    category: ModuleCategory.body,
    type: ModuleType.analog,
    faces: {
      top: ModuleFaceType.male,
      bottom: ModuleFaceType.female,
      left: ModuleFaceType.female,
      right: ModuleFaceType.female,
      front: ModuleFaceType.control,
      back: ModuleFaceType.female,
    },
    buttons: [
      {default: null, mappedTo: XBoxButton.rightAnalog},
      {default: null, mappedTo: XBoxButton.rightAnalogPush},
      {default: XBoxButton.analogYStandard, mappedTo: XBoxButton.analogYInverted},
    ]
  },
  rotation: 0,
  connectsToId: 0,
  connectsToFace: ModuleFace.right,
}

// DPad module remapped to a, b, x, y, and connected to top face of ID 0
const dPad: IModuleState = {
  id: 3,
  module: {
    address: 'def456',
    name: 'DPad',
    desc: 'A DPad module',
    category: ModuleCategory.body,
    type: ModuleType.dPad,
    faces: {
      top: ModuleFaceType.control,
      bottom: ModuleFaceType.female,
      left: ModuleFaceType.none,
      right: ModuleFaceType.none,
      front: ModuleFaceType.none,
      back: ModuleFaceType.none,
    },
    buttons: [
      {default: XBoxButton.dPadUp, mappedTo: XBoxButton.y},
      {default: XBoxButton.dPadDown, mappedTo: XBoxButton.a},
      {default: XBoxButton.dPadLeft, mappedTo: XBoxButton.x},
      {default: XBoxButton.dPadRight, mappedTo: XBoxButton.b},
    ]
  },
  rotation: 0,
  connectsToId: 0,
  connectsToFace: ModuleFace.top,
}



// REQUIRED PARAMS FROM HARDWARE /////////////////////////////////////////
const hardware = {
  id: 1,
  type: ModuleType.dPad,
  buttons: [
    {default: XBoxButton.dPadUp, mappedTo: XBoxButton.y},
    {default: XBoxButton.dPadDown, mappedTo: XBoxButton.a},
    {default: XBoxButton.dPadLeft, mappedTo: XBoxButton.x},
    {default: XBoxButton.dPadRight, mappedTo: XBoxButton.b},
  ],
  rotation: 0,
  connectsToId: 0,
  connectsToFace: ModuleFace.top,
}














/*
Cube {"top":"male","bottom":"female","left":"female","right":"female","front":"female","back":"female"}
Power {"top":"power","bottom":"female","left":"non","right":"none","front":"none","back":"none"}
Analog {"top":"male","bottom":"female","left":"female","right":"control","front":"female","back":"female"}
Edge {"top":"male","bottom":"none","left":"control","right":"none","front":"none","back":"none"}
Spacer {"top":"male","bottom":"female","left":"none","right":"none","front":"none","back":"none"}
Button {"top":"control","bottom":"male","left":"none","right":"none","front":"none","back":"none"}
Plug {"top":"none","bottom":"male","left":"none","right":"none","front":"none","back":"none"}
L Handle {"top":"none","bottom":"none","left":"none","right":"male","front":"none","back":"none"}
R Handle {"top":"none","bottom":"none","left":"male","right":"none","front":"none","back":"none"}
*/

/*
0-8-1-1-0-60-0-0-0
Id, nodetype, peripherals connected, rotation,
Button1map, button2map, button3map,button4map
*/