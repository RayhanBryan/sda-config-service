import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/LoginPage.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/voltage-transform-config",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Login - Layanan Konfigurasi SDA",
      requiresAuth: false, // Halaman login tidak memerlukan auth
    },
  },
  {
    path: "/voltage-transform-config",
    name: "VoltageTransform",
    component: () =>
      import("../components/voltage-transform/VoltageTransformList.vue"),
    meta: {
      title: "Konfigurasi Voltage Transform - Layanan Konfigurasi SDA",
      requiresAuth: true,
    },
  },
  {
    path: "/voltage-library",
    name: "VoltageLibrary",
    component: () =>
      import("../components/voltage-library/VoltageLibraryList.vue"),
    meta: {
      title: "Voltage Library - Layanan Konfigurasi SDA",
      requiresAuth: true,
    },
  },
  {
    path: "/voltage-fpe",
    name: "VoltageFpe",
    component: () => import("../components/voltage-fpe/VoltageFpeList.vue"),
    meta: {
      title: "Konfigurasi Voltage FPE - Layanan Konfigurasi SDA",
      requiresAuth: true,
    },
  },
  {
    path: "/voltage-transform-group",
    name: "VoltageTransformGroup",
    component: () =>
      import(
        "../components/voltage-transform-group/VoltageTransformGroupList.vue"
      ),
    meta: {
      title: "Grup Voltage Transform - Layanan Konfigurasi SDA",
      requiresAuth: true,
    },
  },
  // 404 Not Found Route - harus di akhir
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Halaman Tidak Ditemukan - Layanan Konfigurasi SDA",
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Fungsi untuk mengecek status login
const isAuthenticated = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const hasToken = sessionStorage.getItem("authToken");
  return isLoggedIn && hasToken;
};

// Navigation guard untuk auth dan update title
router.beforeEach((to, from, next) => {
  // Update title
  document.title = to.meta.title || "Layanan Konfigurasi SDA";

  // Cek apakah route memerlukan authentication
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Jika belum login dan route memerlukan auth, redirect ke login
    next("/login");
  } else if (to.name === "Login" && isAuthenticated()) {
    // Jika sudah login dan mencoba akses login page, redirect ke home
    next("/");
  } else {
    // Lanjutkan ke route yang diminta
    next();
  }
});

export default router;
