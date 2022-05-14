import { XWindow, XWindowManager } from './src';

const vueWindows = {
  install(Vue, ){
    Vue.component('XWindow', XWindow)
    Vue.component('XWindowManager', XWindowManager)
  }
}

export default vueWindows;