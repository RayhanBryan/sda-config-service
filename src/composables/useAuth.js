import { ref, computed } from "vue";
import { authService } from "../services/api";

// Global state untuk authentication
const isLoggedIn = ref(false);
const currentUser = ref(null);
const authToken = ref(null);

// Inisialisasi state dari sessionStorage saat aplikasi dimuat
const initAuth = () => {
  const savedLoginState = sessionStorage.getItem("isLoggedIn");
  const savedUser = sessionStorage.getItem("currentUser");
  const savedToken = sessionStorage.getItem("authToken");

  if (savedLoginState === "true" && savedToken) {
    isLoggedIn.value = true;
    currentUser.value = savedUser ? JSON.parse(savedUser) : null;
    authToken.value = savedToken;
  }
};

// Composable untuk authentication
export const useAuth = () => {
  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);

      if (result.success) {
        const { data } = result;

        // Simpan token dari response API
        const token = data.token || data.access_token || data.accessToken;

        // Set user data dari response atau default
        const userData = {
          username: credentials.username,
          name: data.name || data.user?.name || credentials.username,
          email: data.email || data.user?.email || credentials.username,
          role: data.role || data.user?.role || "user",
          avatar:
            data.avatar ||
            data.user?.avatar ||
            `https://ui-avatars.com/api/?name=${credentials.username}&background=1976D2&color=fff`,
          ...data.user, // spread any additional user data from API
        };

        isLoggedIn.value = true;
        currentUser.value = userData;
        authToken.value = token;

        // Simpan ke sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("currentUser", JSON.stringify(userData));
        if (token) {
          sessionStorage.setItem("authToken", token);
        }

        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Simply clear session storage - no API call needed
    isLoggedIn.value = false;
    currentUser.value = null;
    authToken.value = null;

    // Hapus dari sessionStorage
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("authToken");
  };

  const checkAuth = () => {
    return (
      sessionStorage.getItem("isLoggedIn") === "true" &&
      sessionStorage.getItem("authToken")
    );
  };

  return {
    isLoggedIn: computed(() => isLoggedIn.value),
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    login,
    logout,
    checkAuth,
    initAuth,
  };
};
