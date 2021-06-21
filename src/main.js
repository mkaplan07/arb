import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement)

Vue.customElement('arb-widget', App, {
  shadow: true,
  // beforeCreateVueInstance(root) {
  //   const rootNode = root.el.getRootNode();
  //
  //   if (rootNode instanceof ShadowRoot) {
  //     root.shadowRoot = rootNode;
  //   } else {
  //     root.shadowRoot = document.head;
  //   }
  //   return root;
  // }
})
