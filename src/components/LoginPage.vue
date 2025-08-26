<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12" rounded="lg">
          <v-card-title class="text-center pa-6">
            <v-row>
              <v-col cols="12">
                <v-avatar size="80" color="primary" class="mb-4">
                  <v-icon size="40" color="white">mdi-account-circle</v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="12">
                <h2 class="text-h4 font-weight-bold">Welcome Back</h2>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Sign in to your account
                </p>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text class="px-6">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                type="text"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                class="mb-3"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                class="mb-3"
                required
              ></v-text-field>

              <v-row class="mb-4">
                <v-col cols="6">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    color="primary"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="6" class="text-right">
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="forgotPassword"
                  >
                    Forgot Password?
                  </v-btn>
                </v-col>
              </v-row>

              <v-btn
                :disabled="!valid"
                :loading="loading"
                color="primary"
                size="large"
                block
                @click="login"
                class="mb-4"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pa-6">
            <p class="text-body-2">
              Don't have an account?
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="goToRegister"
              >
                Sign up
              </v-btn>
            </p>
          </v-card-actions>
        </v-card>
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
          Close
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
      rememberMe: false,
      showPassword: false,
      valid: false,
      loading: false,
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => (v && v.length >= 3) || "Username must be at least 3 characters",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
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
            `Login successful! Welcome back, ${result.user.name}.`,
            "success"
          );

          setTimeout(() => {
            this.router.push("/voltage-transform-config");
          }, 1000);
        } else {
          this.showSnackbar(
            result.error || "Invalid username or password. Please try again.",
            "error"
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        this.showSnackbar(
          "Login failed. Please check your connection and try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    googleLogin() {
      this.showSnackbar("Google login integration coming soon!", "info");
    },

    githubLogin() {
      this.showSnackbar("GitHub login integration coming soon!", "info");
    },

    forgotPassword() {
      this.showSnackbar(
        "Password reset email would be sent to your email.",
        "info"
      );
    },

    goToRegister() {
      this.showSnackbar("Registration page coming soon!", "info");
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.v-avatar {
  margin: 0 auto;
}
</style>
