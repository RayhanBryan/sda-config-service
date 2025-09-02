<template>
  <v-navigation-drawer v-model="drawer" app temporary>
    <div v-if="isLoggedIn">
      <!-- User info di drawer -->
      <v-list>
        <v-list-item
          :prepend-avatar="currentUser?.avatar"
          :title="currentUser?.name || 'Pengguna'"
          :subtitle="currentUser?.email || 'Tidak ada email'"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- Menu untuk user yang sudah login -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.title"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          @click="handleLogout"
          prepend-icon="mdi-logout"
          title="Keluar"
          value="logout"
        ></v-list-item>
      </v-list>
    </div>

    <div v-else>
      <!-- Menu untuk user yang belum login -->
      <v-list>
        <v-list-item
          prepend-icon="mdi-account-circle"
          title="Pengguna Tamu"
          subtitle="Silakan login untuk melanjutkan"
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
import { useRouter } from "vue-router";
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
  data() {
    return {
      router: useRouter(),
      auth: useAuth(),
      menuItems: [
        {
          title: "Konfigurasi Voltage Transform",
          icon: "mdi-transmission-tower",
          to: "/voltage-transform-config",
        },
        {
          title: "Voltage Library",
          icon: "mdi-library",
          to: "/voltage-library",
        },
        {
          title: "Voltage FPE",
          icon: "mdi-cog",
          to: "/voltage-fpe",
        },
        {
          title: "Grup Voltage Transform",
          icon: "mdi-group",
          to: "/voltage-transform-group",
        },
      ],
    };
  },
  computed: {
    drawer: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
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
