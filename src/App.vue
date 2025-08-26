<template>
  <v-app>
    <!-- App Bar Component -->
    <AppBar @toggle-drawer="drawer = !drawer" />

    <!-- Navigation Drawer Component -->
    <NavigationDrawer v-model="drawer" />

    <v-main>
      <!-- Router View for different pages -->
      <router-view />
    </v-main>

    <!-- Footer Component -->
    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "./composables/useAuth";
import { AppBar, NavigationDrawer, AppFooter } from "./components";

const drawer = ref(false);
const { initAuth } = useAuth();

// Initialize auth state saat aplikasi dimuat
onMounted(() => {
  initAuth();
});
</script>
