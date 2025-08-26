<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon left>{{ isEdit ? "mdi-pencil" : "mdi-plus" }}</v-icon>
        {{ isEdit ? "Edit" : "Create" }} Voltage FPE Configuration
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.fpeId"
                :rules="requiredRules"
                label="FPE ID"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.format"
                :rules="requiredRules"
                label="Format"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.identity"
                :rules="requiredRules"
                label="Identity"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.libraryContextId"
                :rules="requiredRules"
                label="Library Context ID"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.sharedSecret"
                :rules="requiredRules"
                label="Shared Secret"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="save"
        >
          {{ isEdit ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VoltageFpeDialog",
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
  },
  emits: ["update:modelValue", "save", "cancel"],
  data() {
    return {
      valid: false,
      saving: false,
      formData: {
        fpeId: "",
        format: "",
        identity: "",
        libraryContextId: "",
        sharedSecret: "",
      },
      requiredRules: [(v) => !!v || "This field is required"],
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
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.resetForm();
        if (this.item && this.isEdit) {
          this.loadItemData();
        }
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        fpeId: "",
        format: "",
        identity: "",
        libraryContextId: "",
        sharedSecret: "",
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    loadItemData() {
      if (this.item) {
        this.formData = {
          fpeId: this.item.fpeId || "",
          format: this.item.format || "",
          identity: this.item.identity || "",
          libraryContextId: this.item.libraryContextId || "",
          sharedSecret: this.item.sharedSecret || "",
        };
      }
    },

    async save() {
      if (!this.$refs.form.validate()) return;

      this.saving = true;

      try {
        const payload = {
          ...this.formData,
        };

        this.$emit("save", payload);
      } catch (error) {
        console.error("Error saving:", error);
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
