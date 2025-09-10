# SDA Config Service Frontend

A modern Vue.js application for managing SDA (Secure Data Architecture) configuration services, built with Vite and Vuetify UI framework. This frontend provides interfaces for managing voltage configurations, FPE settings, transform groups, and library management.

## 🚀 Features

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vuetify 3** - Material Design component framework
- **Vue Router** - Client-side routing for SPA navigation
- **Vite** - Lightning fast build tool with HMR
- **Material Design Icons** - Comprehensive icon library
- **Responsive Design** - Mobile-first approach
- **Authentication** - Login system with auth composables
- **Modular Architecture** - Organized feature modules

## 📦 Project Structure

```
src/
├── components/                    # Vue components
│   ├── AppBar.vue                # Application header/navigation
│   ├── AppFooter.vue             # Application footer
│   ├── NavigationDrawer.vue      # Side navigation menu
│   ├── LoginPage.vue             # Authentication page
│   ├── NotFound.vue              # 404 error page
│   ├── voltage-fpe/              # Voltage FPE management
│   │   ├── VoltageFpeDialog.vue  # FPE configuration dialog
│   │   └── VoltageFpeList.vue    # FPE list view
│   ├── voltage-library/          # Voltage library management
│   │   ├── VoltageLibraryDialog.vue
│   │   └── VoltageLibraryList.vue
│   ├── voltage-transform/        # Voltage transformation configs
│   │   ├── VoltageConfigDialog.vue
│   │   └── VoltageTransformList.vue
├── composables/                  # Vue composables
│   └── useAuth.js               # Authentication logic
├── services/                    # API service layer
│   ├── api.js                  # Base API configuration
│   ├── voltageFpeService.js    # FPE API endpoints
│   ├── voltageLibraryService.js # Library API endpoints
│   ├── voltageTransformService.js # Transform API endpoints
│   └── configIdService.js
├── router/                     # Vue Router configuration
│   └── index.js               # Route definitions
├── plugins/                   # Vue plugins
│   └── vuetify.js            # Vuetify configuration
├── utils/                    # Utility functions
│   └── debug.js             # Debug helpers
├── assets/                  # Static assets
├── App.vue                 # Root component
└── main.js                # Application entry point
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## 🔧 Application Modules

### Voltage FPE Management

- **VoltageFpeList**: View and manage FPE configurations
- **VoltageFpeDialog**: Create/edit FPE settings

### Voltage Library

- **VoltageLibraryList**: Browse voltage library entries
- **VoltageLibraryDialog**: Add/modify library items

### Voltage Transform

- **VoltageTransformList**: Manage voltage transformations
- **VoltageConfigDialog**: Configure transformation parameters

## 🔐 Authentication

The application includes an authentication system with:

- Login page with form validation
- Auth composable (`useAuth`) for state management
- Protected routes and navigation guards

## 🎨 Vuetify Configuration

The Vuetify configuration is located in `src/plugins/vuetify.js` and includes:

- **Components**: All Vuetify components imported
- **Directives**: All Vuetify directives imported
- **Theme**: Custom light and dark theme configurations
- **Icons**: Material Design Icons (@mdi/font) integration
- **Layout**: Responsive grid system and navigation components

## 📚 Learn More

- [Vue.js Guide](https://vuejs.org/guide/quick-start.html)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vuetify Documentation](https://vuetifyjs.com/en/getting-started/installation/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🏗️ Architecture

### Service Layer

The application uses a service-oriented architecture with dedicated API services:

- `api.js` - Base API configuration and interceptors
- Feature-specific services for each module (FPE, Library, Transform, etc.)

### Composables

Vue 3 Composition API is used for reusable logic:

- `useAuth.js` - Authentication state and methods

### Component Organization

Components are organized by feature modules with consistent naming:

- List components for data display
- Dialog components for create/edit operations
- Shared layout components (AppBar, NavigationDrawer, etc.)

## 📝 Development Notes

This application uses Vue 3 `<script setup>` SFCs with the Composition API. The project follows Vuetify 3.x component patterns and Material Design principles for a consistent user experience.

For IDE support, refer to the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
