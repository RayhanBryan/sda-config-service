<template>
  <v-dialog v-model="dialog" max-width="1200">
    <!-- Single Item Edit Dialog -->
    <v-card v-if="isEditMode">
      <v-card-title class="text-h6">
        <v-icon left>mdi-pencil</v-icon>
        Edit Configuration
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="singleConfigId"
              :items="configIdOptions"
              label="Config ID"
              variant="outlined"
              placeholder="Type to search Config ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingConfigIds"
              no-data-text="No Config ID found"
              :disabled="true"
              :readonly="true"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="singleFpeId"
              :items="fpeIdOptions"
              label="FPE ID"
              variant="outlined"
              placeholder="Type to search FPE ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingFpeIds"
              no-data-text="No FPE ID found"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="singleJsonPathFieldName"
              label="JSON Path Field Name"
              variant="outlined"
              placeholder="field1"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="singleTransformType"
              :items="transformTypeOptions"
              label="Transform Type"
              variant="outlined"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="saveSingleItem"
          :disabled="!canSaveSingleItem"
        >
          Update Configuration
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Step 1: Quick Setup Dialog (Bulk Mode) -->
    <v-card v-else-if="isBulkQuickSetup">
      <v-card-title class="text-h6">
        <v-icon left>mdi-lightning-bolt</v-icon>
        Quick Configuration Setup
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="quickConfigId"
              :items="configIdOptions"
              label="Config ID"
              variant="outlined"
              placeholder="Type to search Config ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingConfigIds"
              no-data-text="No Config ID found"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="jsonFieldNames"
              label="JSON Field Names"
              variant="outlined"
              rows="4"
              placeholder="Enter field names separated by commas (e.g., name, email, phone, address)"
              hint="Enter multiple field names separated by commas"
              persistent-hint
            ></v-textarea>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="defaultFpeId"
              :items="fpeIdOptions"
              label="Default FPE ID"
              variant="outlined"
              placeholder="Select default FPE ID"
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="defaultTransformType"
              :items="transformTypeOptions"
              label="Default Transform Type"
              variant="outlined"
              placeholder="Select default transform type"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancelQuickSetup">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="generateBulkTable"
          :disabled="!quickConfigId || !jsonFieldNames"
        >
          Generate Table
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Step 2: Bulk Configuration Table (Bulk Mode) -->
    <v-card v-else-if="isBulkTable">
      <v-card-title class="text-h6">
        <v-icon left>mdi-plus-box-multiple</v-icon>
        Add Configurations
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="elevated"
          prepend-icon="mdi-arrow-left"
          @click="backToQuickSetup"
          size="small"
          class="mt-3"
        >
          Back to Quick Setup
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="configId"
              :items="configIdOptions"
              label="Config ID"
              variant="outlined"
              placeholder="Type to search Config ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingConfigIds"
              no-data-text="No Config ID found"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-data-table
          :headers="bulkHeaders"
          :items="bulkItems"
          :hide-default-footer="true"
          class="elevation-1"
        >
          <template v-slot:item.fpeId="{ item, index }">
            <v-select
              v-model="bulkItems[index].fpeId"
              :items="fpeIdOptions"
              variant="outlined"
              density="compact"
              placeholder="Select FPE ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingFpeIds"
              class="my-2"
            ></v-select>
          </template>

          <template v-slot:item.jsonPathFieldName="{ item, index }">
            <v-text-field
              v-model="bulkItems[index].jsonPathFieldName"
              variant="outlined"
              density="compact"
              placeholder="field1"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              class="my-2"
            ></v-text-field>
          </template>

          <template v-slot:item.transformType="{ item, index }">
            <v-select
              v-model="bulkItems[index].transformType"
              :items="transformTypeOptions"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              class="my-2"
            ></v-select>
          </template>

          <template v-slot:item.actions="{ item, index }">
            <div class="my-2">
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="removeBulkRow(index)"
                :disabled="bulkItems.length <= 1"
              ></v-btn>
            </div>
          </template>
        </v-data-table>

        <!-- Add Row Button -->
        <div class="d-flex align-center gap-4 mt-4">
          <v-alert
            type="info"
            variant="tonal"
            class="flex-grow-1 custom-alert-blue me-4"
            density="compact"
          >
            <span style="font-size: 12px">
              <strong
                >Add multiple configurations with the same Config ID.</strong
              >
              Use "Add Row" button to add more entries.
            </span>
          </v-alert>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="addBulkRow"
            :disabled="!canAddNewRow"
            size="large"
          >
            Add Row
          </v-btn>
        </div>

        <v-alert
          v-if="bulkItems.length > 0"
          type="success"
          variant="tonal"
          class="mt-4 custom-alert-green"
        >
          <strong>Ready to create:</strong> {{ validBulkItems.length }} of
          {{ bulkItems.length }} configuration(s)
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="save"
          :disabled="validBulkItems.length === 0"
        >
          Create {{ validBulkItems.length }} Configuration(s)
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Fallback: Handle unexpected states -->
    <v-card v-else>
      <v-card-title class="text-h6">
        <v-icon left>mdi-lightning-bolt</v-icon>
        Configuration Setup
      </v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal">
          Please configure the dialog mode properly.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import voltageFpeService from "../../services/voltageFpeService";
import configIdService from "../../services/configIdService";

export default {
  name: "VoltageConfigDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isBulk: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "bulk-save", "save", "cancel"],
  data() {
    return {
      saving: false,
      loadingFpeIds: false,
      loadingConfigIds: false,
      configId: "",
      fpeIdOptions: [],
      configIdOptions: [],

      // Single item edit properties
      singleConfigId: "",
      singleFpeId: "",
      singleJsonPathFieldName: "",
      singleTransformType: "",

      // Quick Setup properties
      showQuickSetup: true,
      quickConfigId: "",
      jsonFieldNames: "",
      defaultFpeId: "",
      defaultTransformType: "",

      bulkItems: [
        {
          fpeId: "",
          jsonPathFieldName: "",
          transformType: "",
        },
      ],
      transformTypes: [
        { title: "Encrypt", value: "encrypt" },
        { title: "Decrypt", value: "decrypt" },
      ],
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    isEditMode() {
      return this.isEdit === true && this.isBulk === false;
    },
    isBulkQuickSetup() {
      return this.isBulk === true && this.showQuickSetup === true;
    },
    isBulkTable() {
      return this.isBulk === true && this.showQuickSetup === false;
    },
    transformTypeOptions() {
      return this.transformTypes.map((type) => type.value);
    },
    bulkHeaders() {
      return [
        { title: "FPE ID", value: "fpeId", sortable: false },
        {
          title: "JSON Path Field Name",
          value: "jsonPathFieldName",
          sortable: false,
        },
        { title: "Transform Type", value: "transformType", sortable: false },
        { title: "Actions", value: "actions", sortable: false, width: "80" },
      ];
    },
    validBulkItems() {
      return this.bulkItems.filter(
        (item) =>
          this.configId &&
          item.fpeId &&
          item.jsonPathFieldName &&
          item.transformType
      );
    },
    canSaveSingleItem() {
      return (
        this.singleConfigId &&
        this.singleFpeId &&
        this.singleJsonPathFieldName &&
        this.singleTransformType
      );
    },
    canAddNewRow() {
      // Check if configId is selected and all existing rows are complete
      // if (!this.configId) return false;

      return this.bulkItems.every(
        (item) => item.fpeId && item.jsonPathFieldName && item.transformType
      );
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.resetForm();
        this.resetQuickSetup();
        if (this.isEdit && this.item && !this.isBulk) {
          this.populateSingleItemFields();
        }
        this.loadFpeIds();
        this.loadConfigIds();
      }
    },
    isEdit: {
      handler(newVal) {
        if (newVal && this.item && !this.isBulk) {
          this.populateSingleItemFields();
        }
      },
      immediate: true,
    },
    isBulk: {
      handler(newVal) {
        if (newVal) {
          // Reset to quick setup when entering bulk mode
          this.showQuickSetup = true;
        }
      },
      immediate: true,
    },
    item: {
      handler(newItem) {
        if (newItem && this.isEdit && !this.isBulk) {
          this.populateSingleItemFields();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadFpeIds() {
      this.loadingFpeIds = true;
      try {
        const response = await voltageFpeService.getAll();
        if (response.success) {
          // Extract unique FPE IDs from the configurations
          this.fpeIdOptions = [
            ...new Set(response.data.map((config) => config.fpeId)),
          ].filter(Boolean);
        } else {
          console.error("Failed to load FPE IDs:", response.error);
          this.fpeIdOptions = [];
        }
      } catch (error) {
        console.error("Error loading FPE IDs:", error);
        this.fpeIdOptions = [];
      } finally {
        this.loadingFpeIds = false;
      }
    },

    async loadConfigIds() {
      this.loadingConfigIds = true;
      try {
        const response = await configIdService.getAll();
        if (response.success) {
          // Extract unique Config IDs from the transform groups
          this.configIdOptions = [
            ...new Set(response.data.map((group) => group.configId)),
          ].filter(Boolean);
        } else {
          console.error("Failed to load Config IDs:", response.error);
          this.configIdOptions = [];
        }
      } catch (error) {
        console.error("Error loading Config IDs:", error);
        this.configIdOptions = [];
      } finally {
        this.loadingConfigIds = false;
      }
    },

    resetForm() {
      this.configId = "";
      this.resetSingleItemFields();
      this.bulkItems = [
        {
          fpeId: "",
          jsonPathFieldName: "",
          transformType: "",
        },
      ];
    },

    addBulkRow() {
      this.bulkItems.push({
        fpeId: "",
        jsonPathFieldName: "",
        transformType: "",
      });
    },

    removeBulkRow(index) {
      if (this.bulkItems.length > 1) {
        this.bulkItems.splice(index, 1);
      }
    },

    async save() {
      this.saving = true;
      try {
        const dataToSave = this.validBulkItems.map((item) => ({
          configId: this.configId,
          fpeId: item.fpeId,
          jsonPathFieldName: `$.${item.jsonPathFieldName}`,
          transformType: item.transformType,
        }));
        this.$emit("bulk-save", dataToSave);
      } catch (error) {
        console.error("Error saving bulk:", error);
      } finally {
        this.saving = false;
      }
    },

    cancel() {
      this.$emit("cancel");
    },

    // Quick Setup methods
    generateBulkTable() {
      if (!this.quickConfigId || !this.jsonFieldNames) return;

      // Parse JSON field names from comma-separated text
      const fieldNames = this.jsonFieldNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      // Generate bulk items
      this.bulkItems = fieldNames.map((fieldName) => ({
        fpeId: this.defaultFpeId || "",
        jsonPathFieldName: fieldName,
        transformType: this.defaultTransformType || "",
      }));

      // Set the config ID for the bulk table
      this.configId = this.quickConfigId;

      // Move to bulk table view
      this.showQuickSetup = false;
    },

    cancelQuickSetup() {
      this.resetQuickSetup();
      this.$emit("cancel");
    },

    backToQuickSetup() {
      this.showQuickSetup = true;
    },

    resetQuickSetup() {
      this.showQuickSetup = true;
      this.quickConfigId = "";
      this.jsonFieldNames = "";
      this.defaultFpeId = "";
      this.defaultTransformType = "";
      this.configId = "";
      this.bulkItems = [
        {
          fpeId: "",
          jsonPathFieldName: "",
          transformType: "",
        },
      ];
    },

    // Single item editing methods
    populateSingleItemFields() {
      if (this.item) {
        this.singleConfigId = this.item.configId || "";
        this.singleFpeId = this.item.fpeId || "";
        this.singleJsonPathFieldName =
          this.item.jsonPathFieldName?.replace(/^\$\./, "") || "";
        this.singleTransformType = this.item.transformType || "";
      }
    },

    async saveSingleItem() {
      this.saving = true;
      try {
        const dataToSave = {
          id: this.item.id,
          configId: this.singleConfigId,
          fpeId: this.singleFpeId,
          jsonPathFieldName: this.singleJsonPathFieldName.startsWith("$.")
            ? this.singleJsonPathFieldName
            : `$.${this.singleJsonPathFieldName}`,
          transformType: this.singleTransformType,
        };
        this.$emit("save", dataToSave);
      } catch (error) {
        console.error("Error saving single item:", error);
      } finally {
        this.saving = false;
      }
    },

    resetSingleItemFields() {
      this.singleConfigId = "";
      this.singleFpeId = "";
      this.singleJsonPathFieldName = "";
      this.singleTransformType = "";
    },
  },
};
</script>

<style scoped>
.v-textarea :deep(textarea) {
  font-family: "Courier New", monospace;
}

.custom-alert-text {
  color: #1a1a1a !important;
}

.custom-alert-text strong {
  color: #000000 !important;
  font-weight: 700 !important;
}

.custom-alert-blue {
  color: #1976d2 !important;
}

.custom-alert-blue strong {
  color: #1565c0 !important;
  font-weight: 700 !important;
}

.custom-alert-green {
  color: #2d7d32 !important;
}

.custom-alert-green strong {
  color: #1b5e20 !important;
  font-weight: 700 !important;
}
</style>
