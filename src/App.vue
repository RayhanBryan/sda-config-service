<template>
  <v-app>
    <!-- App Bar Component - hide on login page -->
    <AppBar v-if="!isLoginPage" @toggle-drawer="drawer = !drawer" />

    <!-- Navigation Drawer Component - hide on login page -->
    <NavigationDrawer v-if="!isLoginPage" v-model="drawer" />

    <v-main :class="{ 'login-main': isLoginPage }">
      <!-- Router View for different pages -->
      <router-view />
    </v-main>

    <!-- Footer Component - hide on login page -->
    <AppFooter v-if="!isLoginPage" />
  </v-app>
</template>

<script>
import { useRoute } from "vue-router";
import { useAuth } from "./composables/useAuth";
import AppBar from "./components/AppBar.vue";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppBar,
    NavigationDrawer,
    AppFooter,
  },
  data() {
    return {
      drawer: false,
    };
  },
  setup() {
    const route = useRoute();
    const { initAuth } = useAuth();
    return { route, initAuth };
  },
  computed: {
    // Check if current route is login page
    isLoginPage() {
      return this.route.name === "Login";
    },
  },
  mounted() {
    // Initialize auth state saat aplikasi dimuat
    this.initAuth();
  },
};
</script>

<style>
.login-main {
  padding: 0 !important;
}

.login-main .v-main__wrap {
  padding: 0 !important;
}
</style>
