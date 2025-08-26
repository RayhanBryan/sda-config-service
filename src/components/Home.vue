<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="mx-auto" max-width="800">
          <v-card-title class="text-h4 justify-center">
            <v-icon left color="primary" size="40">mdi-vuetify</v-icon>
            Welcome to Vue + Vuetify!
          </v-card-title>

          <v-card-subtitle class="text-center">
            A powerful Vue.js framework with Material Design components
          </v-card-subtitle>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-card elevation="2" class="pa-4">
                  <v-card-title class="text-h6">
                    <v-icon left>mdi-counter</v-icon>
                    Counter Demo
                  </v-card-title>

                  <v-row align="center" justify="center" class="my-4">
                    <v-col cols="auto">
                      <v-btn
                        color="primary"
                        size="large"
                        @click="count++"
                        elevation="2"
                      >
                        <v-icon left>mdi-plus</v-icon>
                        Count: {{ count }}
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-progress-linear
                    :value="count * 10"
                    color="primary"
                    height="10"
                    rounded
                  ></v-progress-linear>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-6">
              <v-col cols="12" md="4">
                <v-card color="primary" dark>
                  <v-card-title>
                    <v-icon left>mdi-vuejs</v-icon>
                    Vue.js
                  </v-card-title>
                  <v-card-text>
                    Progressive JavaScript framework for building user
                    interfaces.
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card color="success" dark>
                  <v-card-title>
                    <v-icon left>mdi-material-design</v-icon>
                    Vuetify
                  </v-card-title>
                  <v-card-text>
                    Material Design component framework for Vue.js applications.
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card color="orange" dark>
                  <v-card-title>
                    <v-icon left>mdi-lightning-bolt</v-icon>
                    Vite
                  </v-card-title>
                  <v-card-text>
                    Next generation frontend tooling for blazing fast
                    development.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-6" justify="center">
              <v-col cols="12" md="8"> </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              variant="outlined"
              href="https://vuejs.org/guide/quick-start.html"
              target="_blank"
            >
              <v-icon left>mdi-book-open-variant</v-icon>
              Vue Guide
            </v-btn>

            <v-btn
              color="success"
              variant="outlined"
              href="https://vuetifyjs.com/en/getting-started/installation/"
              target="_blank"
            >
              <v-icon left>mdi-file-document</v-icon>
              Vuetify Docs
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "Home",
  data() {
    return {
      router: useRouter(),
      count: 0,
    };
  },
  methods: {
    goToLogin() {
      this.router.push("/login");
    },
  },
};
</script>

<style scoped>
code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
}
</style>
