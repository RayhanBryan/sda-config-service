<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-library</v-icon>
            Voltage Library Context Configuration
          </v-card-title>

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
                  Add New Config
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="configurations"
            :loading="loading"
            item-key="libraryContextId"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editItem(item)"
                class="mr-2"
              ></v-btn>

              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="deleteItem(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <VoltageLibraryDialog
      v-model="dialog"
      :item="selectedItem"
      :is-edit="isEdit"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-alert-title>Warning</v-alert-title>
            Deleting this library context will also delete all FPE-ID
            configurations that contain the selected library context ID.
          </v-alert>

          <p>
            Are you sure you want to delete this voltage library configuration?
          </p>
          <p class="text-caption text-grey">
            This action cannot be undone and will affect related FPE
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
import voltageLibraryService from "../../services/voltageLibraryService";
import VoltageLibraryDialog from "./VoltageLibraryDialog.vue";

export default {
  name: "VoltageLibraryList",
  components: {
    VoltageLibraryDialog,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      deleteDialog: false,
      isEdit: false,
      selectedItem: null,
      configurations: [],
      headers: [
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
  },
  methods: {
    async loadConfigurations() {
      this.loading = true;
      try {
        const response = await voltageLibraryService.getAll();
        if (response.success) {
          this.configurations = response.data;
        } else {
          this.showSnackbar("Failed to load configurations", "error");
        }
      } catch (error) {
        console.error("Error loading configurations:", error);
        this.showSnackbar("Error loading configurations", "error");
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.selectedItem = null;
      this.isEdit = false;
      this.dialog = true;
    },

    editItem(item) {
      this.selectedItem = { ...item };
      this.isEdit = true;
      this.dialog = true;
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        const response = await voltageLibraryService.delete(
          this.selectedItem.libraryContextId
        );
        if (response.success) {
          this.showSnackbar("Configuration deleted successfully", "success");
          await this.loadConfigurations();
        } else {
          this.showSnackbar("Failed to delete configuration", "error");
        }
      } catch (error) {
        console.error("Error deleting configuration:", error);
        this.showSnackbar("Error deleting configuration", "error");
      } finally {
        this.deleteDialog = false;
        this.selectedItem = null;
      }
    },

    async handleSave(formData) {
      try {
        let response;
        if (this.isEdit) {
          response = await voltageLibraryService.update(formData);
        } else {
          response = await voltageLibraryService.create(formData);
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
        this.showSnackbar("Error saving configuration", "error");
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
  },
};
</script>

<style scoped>
.v-data-table {
  background: transparent;
}
</style>
