<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    <v-toolbar-title @click="router.push('/')" class="cursor-pointer">
      SDA Configuration Service
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Navigation buttons berdasarkan status login -->
    <div v-if="isLoggedIn">
      <!-- User info dan logout -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props">
            <v-avatar size="32" class="mr-2">
              <img :src="currentUser?.avatar" v-if="currentUser?.avatar" />
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
            {{ currentUser?.name || "User" }}
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ currentUser?.email }}</v-list-item-title>
            <v-list-item-subtitle>{{
              currentUser?.role || "User"
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

export default {
  name: "AppBar",
  emits: ["toggle-drawer"],
  data() {
    return {
      router: useRouter(),
      auth: useAuth(),
    };
  },
  computed: {
    isLoggedIn() {
      return this.auth.isLoggedIn;
    },
    currentUser() {
      return this.auth.currentUser;
    },
  },
  methods: {
    handleLogout() {
      this.auth.logout();
      this.router.push("/login");
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-btn--active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
