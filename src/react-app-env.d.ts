/// <reference types="react-scripts" />

import { IStoreState } from './types/store-types'

export declare global {
  interface Window {
    Cypress: Cypress;
    store: any;
  }
}