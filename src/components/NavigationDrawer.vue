<template>
  <v-navigation-drawer v-model="drawer" app temporary>
    <div v-if="isLoggedIn">
      <!-- User info in drawer -->
      <v-list>
        <v-list-item
          :prepend-avatar="currentUser?.avatar"
          :title="currentUser?.name || 'User'"
          :subtitle="currentUser?.email || 'No email'"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- Menu for logged in users -->
      <v-list density="compact" nav v-model:selected="selectedItem">
        <v-list-item
          @click="navigateTo('/create-config-id')"
          prepend-icon="mdi-plus-box"
          title="Create Config ID"
          value="create-config-id"
          :class="{ 'main-menu-item': isActiveRoute('/create-config-id') }"
        ></v-list-item>

        <v-list-item
          @click="navigateTo('/voltage-fpe')"
          prepend-icon="mdi-shield-check"
          title="Create FPE"
          value="voltage-fpe"
          :class="{ 'main-menu-item': isActiveRoute('/voltage-fpe') }"
        ></v-list-item>

        <v-list-item
          @click="navigateTo('/voltage-transform-config')"
          prepend-icon="mdi-transmission-tower"
          title="Transform Configuration"
          value="voltage-transform-config"
          style="color: #64b5f6 !important"
          :class="{
            'main-menu-item': isActiveRoute('/voltage-transform-config'),
          }"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          @click="handleLogout"
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
        ></v-list-item>
      </v-list>
    </div>

    <div v-else>
      <!-- Menu for users who are not logged in -->
      <v-list>
        <v-list-item
          prepend-icon="mdi-account-circle"
          title="Guest User"
          subtitle="Please login to continue"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          to="/login"
          prepend-icon="mdi-login"
          title="Login"
          value="login"
        ></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";

export default {
  name: "NavigationDrawer",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const auth = useAuth();

    const selectedItem = computed(() => {
      const path = route.path;
      if (path === "/create-config-id") return ["create-config-id"];
      if (path === "/voltage-fpe") return ["voltage-fpe"];
      if (path === "/voltage-transform-config")
        return ["voltage-transform-config"];
      return [];
    });

    const drawer = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    const isLoggedIn = computed(() => auth.isLoggedIn);
    const currentUser = computed(() => auth.currentUser);
    const currentRoutePath = computed(() => route.path);

    const isActiveRoute = (routePath) => {
      return currentRoutePath.value === routePath;
    };

    const navigateTo = (path) => {
      router.push(path);
    };

    const handleLogout = () => {
      auth.logout();
      router.push("/login");
    };

    // Debug: watch route changes
    watch(
      () => route.path,
      (newPath) => {
        console.log("NavigationDrawer: Route changed to:", newPath);
      }
    );

    return {
      drawer,
      selectedItem,
      isLoggedIn,
      currentUser,
      currentRoutePath,
      isActiveRoute,
      navigateTo,
      handleLogout,
    };
  },
};
</script>

<style scoped>
/* Styling untuk submenu items */
.v-list-group__items .v-list-item {
  padding-inline-start: 56px !important;
}

/* Active state styling */
.v-list-item--active {
  color: var(--v-theme-primary) !important;
}

.v-list-item--active .v-list-item__prepend > .v-icon {
  color: var(--v-theme-primary) !important;
}

/* Group header styling */
.v-list-group .v-list-item__prepend > .v-icon {
  transition: transform 0.2s ease;
}

/* Main menu item styling */
.main-menu-item {
  background: linear-gradient(
    90deg,
    rgba(25, 118, 210, 0.15) 0%,
    rgba(25, 118, 210, 0.08) 100%
  ) !important;
  border-left: 4px solid #1976d2 !important;
  font-weight: 600 !important;
}

.main-menu-item .v-list-item__prepend > .v-icon {
  color: #1976d2 !important;
  font-weight: bold !important;
}

.main-menu-item .v-list-item-title {
  color: #1976d2 !important;
  font-weight: 600 !important;
}
</style>
