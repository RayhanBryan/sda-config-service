import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";

// Import custom pastel theme styles
import "./styles/pastel-theme.css";

createApp(App).use(vuetify).use(router).mount("#app");
