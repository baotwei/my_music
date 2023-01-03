import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// import pubsub from 'pubsub-js'
// Vue.prototype.$pubsub = pubsub // 全局注册，使用方法为 this.$pubsub

Vue.prototype.$request = request
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
