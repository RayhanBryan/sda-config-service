<template>
  <v-footer color="primary" dark padless>
    <v-row justify="center" no-gutters>
      <v-col class="text-center py-4">
        <span>© 2025 Layanan Konfigurasi SDA</span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "AppFooter",
  data() {
    return {
      router: useRouter(),
      links: [
        { title: "Home", action: () => this.router.push("/") },
        { title: "About Us", action: () => console.log("About Us clicked") },
        { title: "Team", action: () => console.log("Team clicked") },
        { title: "Services", action: () => console.log("Services clicked") },
        { title: "Blog", action: () => console.log("Blog clicked") },
        {
          title: "Contact Us",
          action: () => console.log("Contact Us clicked"),
        },
      ],
    };
  },
  methods: {
    handleFooterLink(link) {
      if (link.action) {
        link.action();
      }
    },
  },
};
</script>
