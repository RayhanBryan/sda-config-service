<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-library</v-icon>
            Konfigurasi Voltage Library Context
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
                  Tambah Konfigurasi
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
        <v-card-title class="text-h6">Konfirmasi Hapus</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-alert-title>Peringatan</v-alert-title>
            Menghapus library context ini juga akan menghapus semua konfigurasi
            FPE-ID yang mengandung library context ID yang dipilih.
          </v-alert>

          <p>
            Apakah Anda yakin ingin menghapus konfigurasi voltage library ini?
          </p>
          <p class="text-caption text-grey">
            Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi
            konfigurasi FPE yang terkait.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Batal
          </v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">
            Tetap Hapus
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
          Tutup
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
        { title: "Aksi", value: "actions", sortable: false, width: "120" },
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
          this.showSnackbar("Gagal memuat konfigurasi", "error");
        }
      } catch (error) {
        console.error("Error loading configurations:", error);
        this.showSnackbar("Terjadi kesalahan saat memuat konfigurasi", "error");
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
          response = await voltageLibraryService.update(formData);
        } else {
          response = await voltageLibraryService.create(formData);
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
