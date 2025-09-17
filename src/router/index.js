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
      title: "Login - SDA Configuration Service",
      requiresAuth: false, // Login page doesn't require auth
    },
  },
  {
    path: "/voltage-transform-config",
    name: "VoltageTransform",
    component: () =>
      import("../components/voltage-transform/VoltageTransformList.vue"),
    meta: {
      title: "Voltage Transform Configuration - SDA Configuration Service",
      requiresAuth: true,
    },
  },
  {
    path: "/voltage-fpe",
    name: "VoltageFpe",
    component: () => import("../components/voltage-fpe/VoltageFpeList.vue"),
    meta: {
      title: "Voltage FPE Configuration - SDA Configuration Service",
      requiresAuth: true,
    },
  },
  {
    path: "/create-config-id",
    name: "CreateConfigId",
    component: () =>
      import("../components/create-config-id/CreateConfigId.vue"),
    meta: {
      title: "Create Config ID - SDA Configuration Service",
      requiresAuth: true,
    },
  },
  // 404 Not Found Route - must be at the end
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Page Not Found - SDA Configuration Service",
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Function to check login status
const isAuthenticated = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const hasToken = sessionStorage.getItem("authToken");
  return isLoggedIn && hasToken;
};

// Navigation guard for auth and title update
router.beforeEach((to, from, next) => {
  // Update title
  document.title = to.meta.title || "SDA Configuration Service";

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // If not logged in and route requires auth, redirect to login
    next("/login");
  } else if (to.name === "Login" && isAuthenticated()) {
    // If already logged in and trying to access login page, redirect to home
    next("/");
  } else {
    // Continue to requested route
    next();
  }
});

export default router;
