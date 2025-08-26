<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-flash</v-icon>
            Voltage Transform Detail Configuration
          </v-card-title>

          <v-card-text>
            <v-row>
              <!-- Search and Filter Section -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchTerm"
                  label="Search by JSON Transform ID"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @input="filterBySearch"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
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

              <v-col cols="12" md="3">
                <v-btn
                  color="error"
                  variant="elevated"
                  prepend-icon="mdi-delete"
                  @click="openDeleteByIdDialog"
                  block
                >
                  Delete by ID
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
            :items="filteredConfigurations"
            :loading="loading"
            item-key="id"
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

            <template v-slot:item.transformType="{ item }">
              <v-chip
                :color="getTransformTypeColor(item.transformType)"
                size="small"
                variant="flat"
              >
                {{ item.transformType }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <VoltageConfigDialog
      v-model="dialog"
      :item="selectedItem"
      :is-edit="isEdit"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this voltage transform configuration?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete by ID Dialog -->
    <v-dialog v-model="deleteByIdDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Delete by ID</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="deleteById"
            label="Enter JSON Transform ID to delete"
            variant="outlined"
            placeholder="e.g. transform-001"
            :rules="[(v) => !!v || 'ID is required']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteByIdDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="confirmDeleteById"
            :disabled="!deleteById"
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
import voltageTransformService from "../../services/voltageTransformService";
import VoltageConfigDialog from "./VoltageConfigDialog.vue";

export default {
  name: "VoltageTransformList",
  components: {
    VoltageConfigDialog,
  },
  data() {
    return {
      searchTerm: "",
      loading: false,
      dialog: false,
      deleteDialog: false,
      deleteByIdDialog: false,
      deleteById: "",
      isEdit: false,
      selectedItem: null,
      configurations: [],
      headers: [
        {
          title: "JSON Transform ID",
          value: "jsonTransformId",
          sortable: true,
        },
        { title: "Field Name", value: "fpeId", sortable: true },
        { title: "JSON Path", value: "jsonPathFieldName", sortable: true },
        { title: "Transform Type", value: "transformType", sortable: true },
        { title: "Actions", value: "actions", sortable: false, width: "120" },
      ],
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  computed: {
    filteredConfigurations() {
      if (!this.searchTerm) {
        return this.configurations;
      }
      return this.configurations.filter(
        (config) =>
          config.jsonTransformId &&
          config.jsonTransformId
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    },
  },
  mounted() {
    this.loadConfigurations();
  },
  methods: {
    async loadConfigurations() {
      this.loading = true;
      try {
        const response = await voltageTransformService.getAll();
        console.log("Loaded configurations:", response);
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

    filterBySearch() {
      // Filtering is handled by computed property
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

    openDeleteByIdDialog() {
      this.deleteById = "";
      this.deleteByIdDialog = true;
    },

    async confirmDeleteById() {
      try {
        const response = await voltageTransformService.deleteById(
          this.deleteById
        );
        console.log("Delete by ID response:", response);
        if (response.success) {
          this.showSnackbar("Configuration deleted successfully", "success");
          await this.loadConfigurations();
        } else {
          this.showSnackbar("Failed to delete configuration", "error");
        }
      } catch (error) {
        console.error("Error deleting configuration by ID:", error);
        this.showSnackbar("Error deleting configuration", "error");
      } finally {
        this.deleteByIdDialog = false;
        this.deleteById = "";
      }
    },

    async confirmDelete() {
      try {
        const response = await voltageTransformService.deleteByIdAndJsonName(
          this.selectedItem.jsonTransformId,
          this.selectedItem.jsonPathFieldName
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
          response = await voltageTransformService.update(formData);
        } else {
          response = await voltageTransformService.create(formData);
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

    getTransformTypeColor(transformType) {
      switch (transformType?.toLowerCase()) {
        case "encrypt":
          return "success";
        case "decrypt":
          return "info";
        case "hash":
          return "warning";
        case "encode":
          return "primary";
        case "decode":
          return "secondary";
        default:
          return "grey";
      }
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
