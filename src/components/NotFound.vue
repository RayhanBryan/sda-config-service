<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12" md="8" lg="6">
        <!-- 404 Illustration -->
        <div class="mb-8">
          <v-icon size="200" color="primary" class="error-icon mb-4">
            mdi-emoticon-sad-outline
          </v-icon>

          <div class="error-number">
            <span class="text-h1 font-weight-bold text-primary">4</span>
            <v-icon size="100" color="primary" class="mx-2">
              mdi-cog-outline
            </v-icon>
            <span class="text-h1 font-weight-bold text-primary">4</span>
          </div>
        </div>

        <!-- Error Message -->
        <v-card class="pa-8 mb-6" elevation="2" rounded="lg" color="surface">
          <v-card-title class="text-h4 font-weight-bold text-error mb-4">
            Oops! Halaman Tidak Ditemukan
          </v-card-title>

          <v-card-text>
            <p class="text-h6 text-medium-emphasis mb-4">
              Halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
            <p class="text-body-1 text-medium-emphasis">
              Jangan khawatir, mari kita bantu Anda kembali ke jalur yang tepat!
              Anda bisa kembali ke halaman sebelumnya atau memilih halaman yang
              tersedia di bawah untuk melanjutkan menggunakan SDA Config
              Service.
            </p>
          </v-card-text>
        </v-card>

        <!-- Action Buttons -->
        <div class="d-flex justify-center">
          <v-btn
            @click="goBack"
            color="secondary"
            variant="flat"
            size="large"
            prepend-icon="mdi-arrow-left"
            class="text-none"
            elevation="2"
          >
            Kembali
          </v-btn>
        </div>

        <!-- Additional Help -->
        <v-divider class="my-8"></v-divider>

        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Butuh bantuan? Coba halaman-halaman populer ini:
          </p>

          <div class="chips-container">
            <v-chip-group class="justify-center">
              <v-chip
                v-for="link in quickLinks"
                :key="link.title"
                @click="$router.push(link.to)"
                :prepend-icon="link.icon"
                color="info"
                variant="outlined"
                class="ma-1"
              >
                {{ link.title }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "NotFound",
  data() {
    return {
      // Quick navigation links
      quickLinks: [
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
          title: "Grup Transform",
          icon: "mdi-group",
          to: "/voltage-transform-group",
        },
      ],
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.router.go(-1);
      } else {
        this.router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}

.error-icon {
  animation: bounce 2s infinite;
}

.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.error-number .v-icon {
  animation: spin 3s linear infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
}

.gap-4 {
  gap: 1rem;
}

.chips-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.v-chip-group {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  max-width: 100% !important;
}

.v-chip-group .v-slide-group__content {
  justify-content: center !important;
}

.v-btn {
  min-width: 140px !important;
  font-weight: 500 !important;
}

.v-btn--variant-flat {
  color: #333333 !important;
}

.v-btn[color="primary"] {
  background-color: var(--v-theme-primary) !important;
}

.v-btn[color="secondary"] {
  background-color: var(--v-theme-secondary) !important;
}

@media (max-width: 600px) {
  .error-number {
    flex-direction: column;
  }

  .error-number .v-icon {
    margin: 1rem 0 !important;
  }

  .chips-container {
    justify-content: center;
  }

  .v-chip-group {
    justify-content: center !important;
  }

  .gap-4 {
    gap: 1rem !important;
  }

  .v-btn {
    width: 100% !important;
    margin-bottom: 0.5rem !important;
  }
}
</style>
