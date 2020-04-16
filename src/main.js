import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '../src/styles/main.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCompositonApi from '@vue/composition-api';

Vue.use(ElementUI);
Vue.use(VueCompositonApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
