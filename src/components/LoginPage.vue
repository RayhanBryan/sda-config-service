<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- Left Side - Welcome Section -->
      <v-col
        cols="12"
        md="8"
        class="welcome-section d-flex flex-column justify-center align-center"
      >
        <div class="text-center text-white">
          <!-- Logo/Icon -->
          <v-icon size="80" color="white" class="mb-8">
            mdi-cog-outline
          </v-icon>

          <!-- App Title -->
          <h1 class="text-h3 font-weight-light mb-4">SDA Config Service</h1>

          <!-- Subtitle -->
          <p class="text-h6 font-weight-light mb-12">
            Sistem Konfigurasi Voltage Management
          </p>
        </div>
      </v-col>

      <!-- Right Side - Login Form -->
      <v-col
        cols="12"
        md="4"
        class="login-section d-flex align-center justify-center"
      >
        <div class="login-container">
          <div class="text-center mb-8">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Kelola konfigurasi dengan aman
            </p>
            <h2 class="text-h4 font-weight-bold mb-6">Login</h2>
          </div>

          <v-form ref="form" v-model="valid" lazy-validation>
            <!-- Username Field -->
            <div class="mb-4">
              <label class="text-body-2 text-medium-emphasis mb-2 d-block">
                Nama Pengguna
              </label>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                placeholder="hilman"
                variant="outlined"
                color="primary"
                density="comfortable"
                hide-details="auto"
                class="custom-input"
                required
              ></v-text-field>
            </div>

            <!-- Password Field -->
            <div class="mb-6">
              <label class="text-body-2 text-medium-emphasis mb-2 d-block">
                Kata Sandi
              </label>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                placeholder="••••••••"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                density="comfortable"
                hide-details="auto"
                class="custom-input"
                required
              ></v-text-field>
            </div>

            <!-- Login Button -->
            <v-btn
              :disabled="!valid"
              :loading="loading"
              color="primary"
              size="large"
              block
              @click="login"
              class="login-btn text-none"
              rounded="lg"
            >
              MASUK
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

export default {
  name: "LoginPage",
  data() {
    return {
      router: useRouter(),
      auth: useAuth(),
      username: "",
      password: "",
      showPassword: false,
      valid: false,
      loading: false,
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
      usernameRules: [
        (v) => !!v || "Nama pengguna wajib diisi",
        (v) => (v && v.length >= 3) || "Nama pengguna minimal 3 karakter",
      ],
      passwordRules: [
        (v) => !!v || "Kata sandi wajib diisi",
        (v) => (v && v.length >= 6) || "Kata sandi minimal 6 karakter",
      ],
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };

        const result = await this.auth.login(credentials);

        if (result.success) {
          this.showSnackbar(
            `Login berhasil! Selamat datang kembali, ${result.user.name}.`,
            "success"
          );

          setTimeout(() => {
            this.router.push("/voltage-transform-config");
          }, 1000);
        } else {
          this.showSnackbar(
            result.error ||
              "Nama pengguna atau kata sandi salah. Silakan coba lagi.",
            "error"
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        this.showSnackbar(
          "Login gagal. Silakan periksa koneksi dan coba lagi.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    googleLogin() {
      this.showSnackbar("Integrasi login Google segera hadir!", "info");
    },

    githubLogin() {
      this.showSnackbar("Integrasi login GitHub segera hadir!", "info");
    },

    forgotPassword() {
      this.showSnackbar(
        "Email reset kata sandi akan dikirim ke email Anda.",
        "info"
      );
    },

    goToRegister() {
      this.showSnackbar("Halaman pendaftaran segera hadir!", "info");
    },

    showSnackbar(message, color = "success") {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.welcome-section {
  background: linear-gradient(135deg, #ffb3e6 0%, #b8a9ff 50%, #a8e6cf 100%);
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.welcome-section > * {
  position: relative;
  z-index: 1;
}

.login-section {
  background: linear-gradient(135deg, #fff0f8 0%, #f5f0ff 50%, #f0fff8 100%);
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.custom-input {
  background: white;
  border-radius: 8px;
}

.custom-input .v-field {
  border-radius: 8px !important;
}

.login-btn {
  background: linear-gradient(
    135deg,
    #b8a9ff 0%,
    #ffb3e6 50%,
    #a8e6cf 100%
  ) !important;
  color: #333333 !important;
  font-weight: 600;
  height: 48px;
  border-radius: 12px !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none !important;
  box-shadow: 0 4px 15px rgba(184, 169, 255, 0.3);
}

.login-btn:hover {
  background: linear-gradient(
    135deg,
    #a8e6cf 0%,
    #ffb3e6 50%,
    #b8a9ff 100%
  ) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 169, 255, 0.5);
}

.login-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 10px rgba(184, 169, 255, 0.4);
}

.features-text {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .welcome-section {
    min-height: 40vh;
  }

  .login-section {
    min-height: 60vh;
  }

  .features-text {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: 2rem;
  }

  .login-container {
    padding: 1.5rem;
  }
}

/* Animation for logo */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.welcome-section .v-icon {
  animation: float 3s ease-in-out infinite;
}
</style>
