<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon left>{{ isEdit ? "mdi-pencil" : "mdi-plus" }}</v-icon>
        {{ isEdit ? "Edit" : "Buat" }} Konfigurasi Voltage Transform
        {{ isEdit }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6" v-if="!isEdit">
              <v-text-field
                v-model="formData.jsonTransformId"
                :rules="requiredRules"
                label="JSON Transform ID"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.fpeId"
                :rules="requiredRules"
                label="FPE ID"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" v-if="!isEdit">
              <v-text-field
                v-model="formData.jsonPathFieldName"
                :rules="requiredRules"
                label="JSON Path Field Name"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.transformType"
                :items="transformTypes"
                :rules="requiredRules"
                label="Tipe Transform"
                variant="outlined"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel"> Batal </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="save"
        >
          {{ isEdit ? "Perbarui" : "Buat" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
  },
  emits: ["update:modelValue", "save", "cancel"],
  data() {
    return {
      valid: false,
      saving: false,
      formData: {
        jsonTransformId: "",
        fpeId: "",
        jsonPathFieldName: "",
        transformType: "",
      },
      transformTypes: [
        { title: "Encrypt", value: "encrypt" },
        { title: "Decrypt", value: "decrypt" },
        { title: "Hash", value: "hash" },
        { title: "Base64 Encode", value: "base64encode" },
        { title: "Base64 Decode", value: "base64decode" },
        { title: "Mask", value: "mask" },
      ],
      requiredRules: [(v) => !!v || "Field ini wajib diisi"],
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
        jsonTransformId: "",
        fpeId: "",
        jsonPathFieldName: "",
        transformType: "",
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    loadItemData() {
      if (this.item) {
        this.formData = {
          jsonTransformId: this.item.jsonTransformId || "",
          fpeId: this.item.fpeId || "",
          jsonPathFieldName: this.item.jsonPathFieldName || "",
          transformType: this.item.transformType || "",
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
