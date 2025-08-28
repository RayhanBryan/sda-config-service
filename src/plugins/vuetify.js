import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Vuetify CSS
import "vuetify/styles";

// Material Design Icons
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          // Pastel Colors Theme
          primary: "#A8DADC", // Pastel Blue-Green
          secondary: "#F1FAEE", // Pastel Mint
          accent: "#E9C46A", // Pastel Yellow
          error: "#F8BBD9", // Pastel Pink
          info: "#B4E4DE", // Pastel Turquoise
          success: "#C7E9B4", // Pastel Green
          warning: "#FFD3A5", // Pastel Orange
          background: "#FDFCFF", // Very Light Purple
          surface: "#F9F7FF", // Light Lavender
          // Additional pastel colors
          tertiary: "#E2C2FF", // Pastel Purple
          quaternary: "#FFB3BA", // Pastel Coral
        },
      },
      dark: {
        colors: {
          // Dark theme with muted pastels
          primary: "#6B9AA0", // Muted Blue-Green
          secondary: "#C5E3E1", // Soft Mint
          accent: "#D4A574", // Muted Yellow
          error: "#E899B5", // Muted Pink
          info: "#8BCCC1", // Muted Turquoise
          success: "#A3D48A", // Muted Green
          warning: "#E6B788", // Muted Orange
          background: "#2D2A3D", // Dark Purple
          surface: "#3A3650", // Dark Lavender
          // Additional muted colors
          tertiary: "#B8A2D9", // Muted Purple
          quaternary: "#D99AA3", // Muted Coral
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});
