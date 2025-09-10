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
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchTerm"
                  label="Search by Config ID"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @input="filterBySearch"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="fpeIdFilter"
                  label="Filter by FPE ID"
                  prepend-inner-icon="mdi-filter"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @input="filterByFpeId"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-btn
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-plus-box-multiple"
                  @click="openBulkCreateDialog"
                  block
                >
                  Add Configuration
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
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="deleteItem(item)"
              ></v-btn>
            </template>

            <template v-slot:item.jsonPathFieldName="{ item }">
              {{ item.jsonPathFieldName?.replace(/^\$\./, "") }}
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
      :isEdit="isEdit"
      :isBulk="isBulkMode"
      @save="handleSave"
      @bulk-save="handleBulkSave"
      @cancel="handleCancel"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Delete Confirmation</v-card-title>
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
            label="Enter Config ID to delete"
            variant="outlined"
            placeholder="example: transform-001"
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

    <!-- Delete by ID Dialog -->
    <v-dialog v-model="deleteByIdDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Delete by ID</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="deleteById"
            label="Enter Config ID to delete"
            variant="outlined"
            placeholder="example: transform-001"
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

    <!-- Voltage Config Dialog -->
    <VoltageConfigDialog
      v-model="dialog"
      @bulk-save="handleBulkSave"
      @cancel="handleCancel"
    />

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
      fpeIdFilter: "",
      loading: false,
      dialog: false,
      deleteDialog: false,
      deleteByIdDialog: false,
      deleteById: "",
      selectedItem: null,
      configurations: [],
      allConfigurations: [], // Store all configurations for filtering
      headers: [
        {
          title: "Config ID",
          value: "configId",
          sortable: true,
        },
        { title: "Field Name", value: "fpeId", sortable: true },
        { title: "JSON Path", value: "jsonPathFieldName", sortable: true },
        { title: "Transform Type", value: "transformType", sortable: true },
        { title: "Actions", value: "actions", sortable: false, width: "120" },
      ],
      bulkHeaders: [
        { title: "Config ID", value: "configId", width: "250" },
        { title: "FPE ID", value: "fpeId", width: "200" },
        {
          title: "JSON Path Field Name",
          value: "jsonPathFieldName",
          width: "250",
        },
        { title: "Transform Type", value: "transformType", width: "180" },
        { title: "Actions", value: "actions", width: "100", sortable: false },
      ],
      transformTypeOptions: ["ENCRYPT", "DECRYPT", "HASH", "TOKENIZE"],
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  computed: {
    filteredConfigurations() {
      let filtered = this.allConfigurations;

      // Filter by search term
      if (this.searchTerm) {
        filtered = filtered.filter(
          (config) =>
            config.configId &&
            config.configId
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
        );
      }

      // Filter by FPE ID
      if (this.fpeIdFilter) {
        filtered = filtered.filter(
          (config) =>
            config.fpeId &&
            config.fpeId.toLowerCase().includes(this.fpeIdFilter.toLowerCase())
        );
      }

      this.configurations = filtered;
      return filtered;
    },
  },
  mounted() {
    this.loadConfigurations();

    // Check if FPE ID is provided in query parameter
    if (this.$route.query.fpeId) {
      this.fpeIdFilter = this.$route.query.fpeId;
    }
  },
  methods: {
    async loadConfigurations() {
      this.loading = true;
      try {
        const response = await voltageTransformService.getAll();
        console.log("Loaded configurations:", response);
        if (response.success) {
          this.allConfigurations = response.data;
          this.configurations = response.data;
          // Apply filters if any are set
          this.filteredConfigurations;
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

    filterBySearch() {
      // Filtering is handled by computed property
      this.filteredConfigurations;
    },

    filterByFpeId() {
      // Filtering is handled by computed property
      this.filteredConfigurations;
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },

    openDeleteByIdDialog() {
      this.deleteById = "";
      this.deleteByIdDialog = true;
    },

    openBulkCreateDialog() {
      this.dialog = true;
    },

    async handleBulkSave(bulkData) {
      try {
        const response = await voltageTransformService.create(bulkData);
        console.log("Bulk create response:", response);

        if (response.success) {
          this.showSnackbar(
            `Successfully created ${bulkData.length} configuration(s)`,
            "success"
          );
          this.dialog = false;
          this.isBulkMode = false;
          await this.loadConfigurations();
        } else {
          this.showSnackbar("Failed to create bulk configurations", "error");
        }
      } catch (error) {
        console.error("Error creating bulk configurations:", error);
        this.showSnackbar(
          "An error occurred while creating bulk configurations",
          "error"
        );
      }
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
        this.showSnackbar(
          "An error occurred while deleting configuration",
          "error"
        );
      } finally {
        this.deleteByIdDialog = false;
        this.deleteById = "";
      }
    },

    async confirmDelete() {
      try {
        const response = await voltageTransformService.deleteByIdAndJsonName(
          this.selectedItem.configId,
          this.selectedItem.jsonPathFieldName
        );
        if (response.success) {
          this.showSnackbar("Konfigurasi berhasil dihapus", "success");
          await this.loadConfigurations();
        } else {
          this.showSnackbar("Gagal menghapus konfigurasi", "error");
        }
      } catch (error) {
        console.error("Error deleting configuration:", error);
        this.showSnackbar(
          "Terjadi kesalahan saat menghapus konfigurasi",
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
          response = await voltageTransformService.update(formData);
        } else {
          response = await voltageTransformService.create(formData);
        }

        if (response.success) {
          this.showSnackbar(
            `Konfigurasi berhasil ${this.isEdit ? "diperbarui" : "dibuat"}`,
            "success"
          );
          await this.loadConfigurations();
        } else {
          this.showSnackbar(
            `Gagal ${this.isEdit ? "memperbarui" : "membuat"} konfigurasi`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error saving configuration:", error);
        this.showSnackbar(
          "Terjadi kesalahan saat menyimpan konfigurasi",
          "error"
        );
      } finally {
        this.dialog = false;
        this.selectedItem = null;
      }
    },

    handleCancel() {
      this.dialog = false;
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
