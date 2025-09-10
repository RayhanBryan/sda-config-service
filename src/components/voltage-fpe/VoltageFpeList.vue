<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-shield-check</v-icon>
            Voltage FPE Management
          </v-card-title>

          <v-tabs v-model="activeTab" class="px-4">
            <v-tab value="fpe">FPE Configuration</v-tab>
            <v-tab value="library">Library Context ID List</v-tab>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <v-window v-model="activeTab">
      <!-- FPE Configuration Tab -->
      <v-window-item value="fpe">
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      prepend-icon="mdi-plus"
                      @click="openCreateDialog"
                      block
                    >
                      Add New FPE Configuration
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- FPE Data Table -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card>
              <v-data-table
                :headers="headers"
                :items="configurations"
                :loading="loading"
                item-key="fpeId"
              >
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex align-center justify-center">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="primary"
                      variant="text"
                      @click="editItem(item)"
                      :title="'Edit FPE Configuration'"
                      density="compact"
                    ></v-btn>
                    <v-divider vertical class="mx-2"></v-divider>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteItem(item)"
                      :title="'Delete FPE Configuration'"
                      density="compact"
                    ></v-btn>
                    <v-divider vertical class="mx-2"></v-divider>
                    <v-btn
                      icon="mdi-arrow-right"
                      size="small"
                      color="success"
                      variant="text"
                      @click="goToVoltageTransform(item)"
                      :title="'Go to Voltage Transform'"
                      density="compact"
                    ></v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Library Context Tab -->
      <v-window-item value="library">
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      prepend-icon="mdi-plus"
                      @click="openLibraryCreateDialog"
                      block
                    >
                      Add New Library Context
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Library Data Table -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card>
              <v-data-table
                :headers="libraryHeaders"
                :items="libraryContexts"
                :loading="loading"
                item-key="libraryContextId"
              >
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex align-center justify-center">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="primary"
                      variant="text"
                      @click="editLibraryItem(item)"
                      :title="'Edit Library Context'"
                      density="compact"
                    ></v-btn>

                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteLibraryItem(item)"
                      :title="'Delete Library Context'"
                      density="compact"
                    ></v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Create/Edit Dialog -->
    <VoltageFpeDialog
      v-model="dialog"
      :item="selectedItem"
      :is-edit="isEdit"
      :library-contexts="libraryContexts"
      @save="handleSave"
      @cancel="handleCancel"
      @open-library-dialog="openLibraryDialogFromFpe"
    />

    <!-- Library Dialog -->
    <v-dialog v-model="libraryDialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left>{{ isLibraryEdit ? "mdi-pencil" : "mdi-plus" }}</v-icon>
          {{ isLibraryEdit ? "Edit" : "Create" }} Library Context Configuration
        </v-card-title>

        <v-card-text>
          <v-form ref="libraryForm" v-model="libraryValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="libraryFormData.libraryContextId"
                  :rules="[(v) => !!v || 'This field is required']"
                  label="Library Context ID"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="libraryFormData.policyUrl"
                  :rules="[(v) => !!v || 'This field is required']"
                  label="Policy URL"
                  variant="outlined"
                  type="url"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="handleLibraryCancel"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            variant="elevated"
            :loading="librarySaving"
            @click="handleLibrarySave"
          >
            {{ isLibraryEdit ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Delete Confirmation</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-alert-title>Warning</v-alert-title>
            Deleting this FPE ID will also delete all detail configurations that
            contain the selected FPE ID.
          </v-alert>

          <p>Are you sure you want to delete this voltage FPE configuration?</p>
          <p class="text-caption text-grey">
            This action cannot be undone and will affect related detail
            configurations.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">
            Delete Anyway
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Library Delete Confirmation Dialog -->
    <v-dialog v-model="libraryDeleteDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Delete Library Confirmation</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-alert-title>Warning</v-alert-title>
            Deleting this library context will delete all related data.
          </v-alert>

          <p>Are you sure you want to delete this library context?</p>
          <p class="text-caption text-grey">This action cannot be undone.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="libraryDeleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            :loading="deleting"
            @click="confirmLibraryDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import voltageFpeService from "../../services/voltageFpeService";
import voltageLibraryService from "../../services/voltageLibraryService";
import VoltageFpeDialog from "./VoltageFpeDialog.vue";

export default {
  name: "VoltageFpeList",
  components: {
    VoltageFpeDialog,
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      dialog: false,
      deleteDialog: false,
      isEdit: false,
      selectedItem: null,
      configurations: [],

      // Library-related data
      libraryDialog: false,
      libraryDeleteDialog: false,
      isLibraryEdit: false,
      selectedLibraryItem: null,
      libraryContexts: [],
      librarySaving: false,
      deleting: false,
      libraryFormData: {
        libraryContextId: "",
        policyUrl: "",
      },

      headers: [
        { title: "FPE ID", value: "fpeId", sortable: true },
        { title: "Format", value: "format", sortable: true },
        { title: "Identity", value: "identity", sortable: true },
        {
          title: "Library Context ID",
          value: "libraryContextId",
          sortable: true,
        },
        { title: "Shared Secret", value: "sharedSecret", sortable: true },
        { title: "Actions", value: "actions", sortable: false, width: "140" },
      ],

      libraryHeaders: [
        {
          title: "Library Context ID",
          value: "libraryContextId",
          sortable: true,
        },
        { title: "Policy URL", value: "policyUrl", sortable: true },
        { title: "Actions", value: "actions", sortable: false, width: "120" },
      ],

      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  mounted() {
    this.loadConfigurations();
    this.loadLibraryContexts();
  },
  watch: {
    activeTab(newTab) {
      if (newTab === "library" && this.libraryContexts.length === 0) {
        this.loadLibraryContexts();
      }
    },
  },
  methods: {
    async loadConfigurations() {
      this.loading = true;
      try {
        const response = await voltageFpeService.getAll();
        if (response.success) {
          this.configurations = response.data;
        } else {
          this.showSnackbar("Failed to load configurations", "error");
        }
      } catch (error) {
        console.error("Error loading configurations:", error);
        this.showSnackbar(
          "An error occurred while loading configurations",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.selectedItem = null;
      this.isEdit = false;
      this.dialog = true;
      // Refresh library contexts untuk memastikan data terbaru
      this.loadLibraryContexts();
    },

    editItem(item) {
      this.selectedItem = { ...item };
      this.isEdit = true;
      this.dialog = true;
      // Refresh library contexts untuk memastikan data terbaru
      this.loadLibraryContexts();
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        const response = await voltageFpeService.delete(
          this.selectedItem.fpeId
        );
        if (response.success) {
          this.showSnackbar("Configuration deleted successfully", "success");
          await this.loadConfigurations();
        } else {
          this.showSnackbar("Failed to delete configuration", "error");
        }
      } catch (error) {
        console.error("Error deleting configuration:", error);
        this.showSnackbar(
          "An error occurred while deleting configuration",
          "error"
        );
      } finally {
        this.deleteDialog = false;
        this.selectedItem = null;
      }
    },

    async handleSave(formData) {
      try {
        let response;
        if (this.isEdit) {
          response = await voltageFpeService.update(formData);
        } else {
          response = await voltageFpeService.create(formData);
        }

        if (response.success) {
          this.showSnackbar(
            `Configuration ${this.isEdit ? "updated" : "created"} successfully`,
            "success"
          );
          await this.loadConfigurations();
        } else {
          this.showSnackbar(
            `Failed to ${this.isEdit ? "update" : "create"} configuration`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error saving configuration:", error);
        this.showSnackbar(
          "An error occurred while saving configuration",
          "error"
        );
      } finally {
        this.dialog = false;
        this.selectedItem = null;
      }
    },

    handleCancel() {
      this.dialog = false;
      this.selectedItem = null;
    },

    showSnackbar(message, color = "success") {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    // Library management methods
    async loadLibraryContexts() {
      this.loading = true;
      try {
        const response = await voltageLibraryService.getAll();
        if (response.success) {
          this.libraryContexts = response.data;
        } else {
          this.showSnackbar("Failed to load library contexts", "error");
        }
      } catch (error) {
        console.error("Error loading configurations:", error);
        this.showSnackbar(
          "An error occurred while loading library contexts",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    openLibraryCreateDialog() {
      this.libraryFormData = {
        libraryContextId: "",
        policyUrl: "",
      };
      this.selectedLibraryItem = null;
      this.isLibraryEdit = false;
      this.libraryDialog = true;
    },

    editLibraryItem(item) {
      this.libraryFormData = { ...item };
      this.selectedLibraryItem = { ...item };
      this.isLibraryEdit = true;
      this.libraryDialog = true;
    },

    deleteLibraryItem(item) {
      this.selectedLibraryItem = item;
      this.libraryDeleteDialog = true;
    },

    async confirmLibraryDelete() {
      this.deleting = true;
      try {
        const response = await voltageLibraryService.delete(
          this.selectedLibraryItem.libraryContextId
        );
        if (response.success) {
          this.showSnackbar("Library context deleted successfully", "success");
          await this.loadLibraryContexts();
        } else {
          this.showSnackbar("Failed to delete library context", "error");
        }
      } catch (error) {
        console.error("Error deleting library context:", error);
        this.showSnackbar(
          "An error occurred while deleting library context",
          "error"
        );
      } finally {
        this.deleting = false;
        this.libraryDeleteDialog = false;
        this.selectedLibraryItem = null;
      }
    },

    async handleLibrarySave() {
      this.librarySaving = true;
      try {
        let response;
        if (this.isLibraryEdit) {
          response = await voltageLibraryService.update(this.libraryFormData);
        } else {
          response = await voltageLibraryService.create(this.libraryFormData);
        }

        if (response.success) {
          this.showSnackbar(
            `Library context ${
              this.isLibraryEdit ? "updated" : "created"
            } successfully`,
            "success"
          );
          await this.loadLibraryContexts();

          // If creating new library, emit event to update dropdown in FPE dialog
          if (!this.isLibraryEdit && this.libraryFormData.libraryContextId) {
            this.$nextTick(() => {
              // Auto-select newly created library if FPE dialog is still open
              if (this.dialog) {
                // Library will be automatically available in dropdown after loadLibraryContexts
              }
            });
          }
        } else {
          this.showSnackbar(
            `Failed to ${
              this.isLibraryEdit ? "update" : "create"
            } library context`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error saving library context:", error);
        this.showSnackbar(
          "An error occurred while saving library context",
          "error"
        );
      } finally {
        this.librarySaving = false;
        this.libraryDialog = false;
        this.selectedLibraryItem = null;
      }
    },

    handleLibraryCancel() {
      this.libraryDialog = false;
      this.selectedLibraryItem = null;
      this.libraryFormData = {
        libraryContextId: "",
        policyUrl: "",
      };
    },

    goToVoltageTransform(item) {
      // Navigate to voltage transform page with FPE ID as query parameter
      this.$router.push({
        path: "/voltage-transform-config",
        query: { fpeId: item.fpeId },
      });
    },

    openLibraryDialogFromFpe() {
      // Buka dialog library dari dalam FPE dialog
      this.openLibraryCreateDialog();
    },
  },
};
</script>

<style scoped>
.v-data-table {
  background: transparent;
}

.d-flex .v-btn {
  min-width: 32px !important;
}
</style>
