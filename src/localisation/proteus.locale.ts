import * as _ from 'lodash'

const proteus = {
  hints: {
    title: {
      home: {en: 'Welcome ####', fr: 'Bonjour ####'},
      mapping: {en: 'Control Remapper', fr: 'Remappeur de Contrôle'},
      gallery: {en: 'Controller Gallery', fr: 'Galerie des Manettes'},
      settings: {en: 'Application Settings', fr: 'Paramètres de L\'application'},
    },
    body: {
      home: {
        en: 'You are currently viewing the home screen of the Proteus application, where you can see a 3D image of your connected controller.<br /><br />To discover what else is possible in Proteus, try clicking on the icons above in the main toolbar.<br /><br />To disable this, and other hints, click the gear icon and toggle <strong>Show Hints</strong>.', 
        fr: 'Bonjour ####'
      },
      mapping: {
        en: 'The remaping screen alows you to remap butons, joysticks and triggers on your controller.<br /><br />Simply click a button or move a joystick on your controller, then select a new mapping from the menu.', 
        fr: 'Remappeur de Contrôle'
      },
      gallery: {
        en: 'The gallery screen allows you save all of your controller configurations, and to view other configurations created by the ByoWave commmunity.<br /><br />When you create a new configuration which you want to save, click the camera icon, give your configuration a name, then click the save button.', 
        fr: 'Galerie des Manettes'
      },
      settings: {
        en: 'The settings screen allows you to adjust various aspects of the application.<br /><br />Here you can show or hide hints, and tailor the graphical rendering settings of the 3D window.', 
        fr: 'Paramètres de L\'application'
      },
    }
  },
  mapping: {
    title: {
      initialise: {en: 'Initialise Controller', fr: 'Bonjour ####'},
      button: {en: 'Button Mapping', fr: 'Bonjour ####'},
      analog: {en: 'Analog Mapping', fr: 'Remappeur de Contrôle'},
      trigger: {en: 'Trigger Mapping', fr: 'Galerie des Manettes'},
    },
  },
  scene: {
    title: {en: 'Scene Setup', fr: 'Scene Setup'},
  }
}
 
export const getProteusLocalisedText = (path: string) => _.get(proteus, path)
