<template>
  <v-dialog v-model="dialog" max-width="1200" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon left>mdi-plus-box-multiple</v-icon>
        Add Configurations
      </v-card-title>

      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-select
              v-model="configId"
              :items="configIdOptions"
              label="Config ID"
              variant="outlined"
              placeholder="Select Config ID"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              :loading="loadingConfigIds"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-alert type="info" variant="tonal" class="flex-grow-1 mr-4">
              Add multiple configurations with the same Config ID. Click "Add
              Row" to add more entries.
            </v-alert>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="addBulkRow"
              :disabled="!canAddNewRow"
            >
              Add Row
            </v-btn>
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

        <v-alert
          v-if="bulkItems.length > 0"
          type="success"
          variant="tonal"
          class="mt-4"
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
  },
  emits: ["update:modelValue", "bulk-save", "cancel"],
  data() {
    return {
      saving: false,
      loadingFpeIds: false,
      loadingConfigIds: false,
      configId: "",
      fpeIdOptions: [],
      configIdOptions: [],
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
        this.loadFpeIds();
        this.loadConfigIds();
      }
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
  },
};
</script>

<style scoped>
.v-textarea :deep(textarea) {
  font-family: "Courier New", monospace;
}
</style>
