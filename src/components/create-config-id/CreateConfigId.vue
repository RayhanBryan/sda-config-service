<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-plus-box</v-icon>
            Create Config ID
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="searchId"
                  label="Search by ID"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-btn
                  color="success"
                  variant="elevated"
                  prepend-icon="mdi-plus"
                  @click="openAddDialog"
                  block
                >
                  Create New Config ID
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
          <v-card-title>
            <span class="text-h6">Config IDs</span>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="groups"
            :loading="loading"
            item-key="configId"
          >
            <template v-slot:item.configId="{ item }">
              {{ item.configId || "-" }}
            </template>

            <template v-slot:item.description="{ item }">
              {{ item.description || "-" }}
            </template>

            <template v-slot:item.createdBy="{ item }">
              {{ item.createdBy || "-" }}
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex align-center justify-start">
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="text"
                  @click="deleteItem(item)"
                  :title="'Delete Config ID'"
                  density="compact"
                ></v-btn>
                <v-divider vertical class="mx-2"></v-divider>
                <v-btn
                  icon="mdi-arrow-right"
                  size="small"
                  color="success"
                  variant="text"
                  @click="goToVoltageTransform(item)"
                  :title="'Go to Transform Configuration'"
                  density="compact"
                  class="me-1"
                ></v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-database-search</v-icon>
                <p class="text-grey mt-2">No Config ID available</p>
                <p class="text-caption text-grey">
                  Create a new Config ID to get started
                </p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Group Dialog -->
    <v-dialog v-model="addDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Create New Config ID</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newGroupName"
            label="Config ID Name"
            variant="outlined"
            required
            :rules="[(v) => !!v || 'Config ID name is required']"
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="newGroupDescription"
            label="Description (Optional)"
            variant="outlined"
            rows="3"
            placeholder="Enter description for this Config ID..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="addDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            @click="createGroup"
            :loading="creating"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 text-success">
          <v-icon left color="success">mdi-check-circle</v-icon>
          Config ID Successfully Created
        </v-card-title>
        <v-card-text>
          <div class="text-center pa-4">
            <v-icon size="64" color="success" class="mb-4"
              >mdi-check-circle-outline</v-icon
            >
            <p class="text-h6 mb-2">
              Config ID "{{ createdGroup?.name }}" has been created
              successfully!
            </p>
            <p class="text-body-1 mb-4">Config ID:</p>
            <div class="d-flex align-center justify-center gap-2">
              <v-chip
                color="primary"
                variant="tonal"
                size="large"
                class="ma-2 px-4"
              >
                {{ createdGroup?.configId }}
              </v-chip>
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-content-copy"
                @click="copyToClipboard(createdGroup?.configId)"
                size="small"
              >
                Copy
              </v-btn>
            </div>
            <p class="text-caption text-grey mt-4">
              Click "Go to Configuration Detail" to add detail configuration
              using this Config ID.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-arrow-right"
            @click="goToDetailConfig"
          >
            Go to Configuration Detail
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="elevated"
            @click="successDialog = false"
          >
            OK
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
            Deleting this Config ID will also delete all detail configurations
            that contain the selected Config ID.
          </v-alert>

          <p>Are you sure you want to delete this Config ID?</p>
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
          <v-btn
            color="error"
            variant="text"
            @click="confirmDelete"
            :loading="deleting"
          >
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
import configIdService from "../../services/configIdService";

export default {
  name: "CreateConfigId",
  data() {
    return {
      loading: false,
      creating: false,
      deleting: false,
      addDialog: false,
      deleteDialog: false,
      successDialog: false,
      selectedItem: null,
      searchId: "",
      newGroupName: "",
      newGroupDescription: "",
      createdGroup: null,
      groups: [],
      allGroups: [], // Store all data for filtering
      headers: [
        {
          title: "Config ID",
          value: "configId",
          sortable: true,
        },
        {
          title: "Description",
          value: "description",
          sortable: true,
        },
        {
          title: "Created By",
          value: "createdBy",
          sortable: true,
        },
        {
          title: "Created At",
          value: "createdAt",
          sortable: true,
        },
        {
          title: "Actions",
          value: "actions",
          sortable: false,
          width: "140",
        },
      ],
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  mounted() {
    this.loadAllGroups();
  },
  watch: {
    searchId(newValue) {
      this.searchById();
    },
  },
  methods: {
    async searchById() {
      if (!this.searchId?.trim()) {
        // If search is empty, show all data
        this.groups = [...this.allGroups];
        return;
      }

      // Filter data locally
      const searchTerm = this.searchId.trim().toLowerCase();
      this.groups = this.allGroups.filter((group) =>
        group.configId?.toLowerCase().includes(searchTerm)
      );
    },

    openAddDialog() {
      this.newGroupName = "";
      this.newGroupDescription = "";
      this.addDialog = true;
    },

    async createGroup() {
      if (!this.newGroupName?.trim()) {
        this.showSnackbar("Please enter a Config ID name", "warning");
        return;
      }

      this.creating = true;
      try {
        const response = await configIdService.create({
          prefix: this.newGroupName,
          description: this.newGroupDescription || null,
        });

        if (response.success) {
          // Store the created group data
          this.createdGroup = {
            name: this.newGroupName.trim(),
            configId: response.data?.message || response.message,
          };

          this.addDialog = false;
          this.newGroupName = "";
          this.newGroupDescription = "";

          // Show success dialog
          this.successDialog = true;

          // Reload data to show the new group
          await this.loadAllGroups();
        } else {
          this.showSnackbar("Failed to create Config ID", "error");
        }
      } catch (error) {
        console.error("Error creating group:", error);
        this.showSnackbar(
          "An error occurred while creating Config ID",
          "error"
        );
      } finally {
        this.creating = false;
      }
    },

    async loadAllGroups() {
      this.loading = true;
      try {
        const response = await configIdService.getAll();
        console.log("Loaded groups:", response);
        if (response.success) {
          this.allGroups = response.data || [];
          this.groups = [...this.allGroups]; // Show all data initially
          if (this.allGroups.length > 0) {
            this.showSnackbar("Data loaded successfully", "success");
          }
        } else {
          this.showSnackbar("Failed to load data", "error");
        }
      } catch (error) {
        console.error("Error loading all groups:", error);
        this.showSnackbar("An error occurred while loading data", "error");
      } finally {
        this.loading = false;
      }
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      if (!this.selectedItem?.configId) return;

      this.deleting = true;
      try {
        const response = await configIdService.deleteById(
          this.selectedItem.configId
        );
        if (response.success) {
          this.showSnackbar("Config ID deleted successfully", "success");
          // Remove from both arrays
          this.groups = this.groups.filter(
            (group) => group.configId !== this.selectedItem.configId
          );
          this.allGroups = this.allGroups.filter(
            (group) => group.configId !== this.selectedItem.configId
          );
        } else {
          this.showSnackbar("Failed to delete Config ID", "error");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        this.showSnackbar(
          "An error occurred while deleting Config ID",
          "error"
        );
      } finally {
        this.deleting = false;
        this.deleteDialog = false;
        this.selectedItem = null;
      }
    },

    showSnackbar(message, color = "success") {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    goToVoltageTransform(item) {
      // Navigate to voltage transform page and pass the config ID
      this.$router.push({
        path: "/voltage-transform-config",
        query: { configId: item.configId },
      });
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showSnackbar(
          "Config ID successfully copied to clipboard!",
          "success"
        );
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          this.showSnackbar(
            "Config ID successfully copied to clipboard!",
            "success"
          );
        } catch (fallbackError) {
          this.showSnackbar("Failed to copy to clipboard", "error");
        }
        document.body.removeChild(textArea);
      }
    },

    goToDetailConfig() {
      // Close the success dialog
      this.successDialog = false;

      // Navigate to detail transform config page
      this.$router.push("/voltage-transform-config");
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return dateString;
      }
    },
  },
};
</script>

<style scoped>
.v-data-table {
  background: transparent;
}
</style>
