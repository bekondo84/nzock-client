import { createApp } from 'vue'
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, fab)
dom.watch();
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { Vue } from 'vue-class-component'
//import mitt from 'mitt'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { emitter } from './services/emitter';

//import { fas } from '@fortawesome/free-solid-svg-icons';
//library.add(fas);
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = event => {
          // here I check that click was outside the el and his children
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted: el => {
        document.removeEventListener("click", el.clickOutsideEvent);
      },
};
//const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.directive("click-outside", clickOutside);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(VueAxios, axios)
.use(vuetify)
.use(store)
.use(router).mount('#app')