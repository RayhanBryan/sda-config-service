<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon left>mdi-group</v-icon>
            ID Grup Voltage Transform
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="searchId"
                  label="Cari berdasarkan ID"
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
                  Tambah Grup
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
            <span class="text-h6">Grup Transform</span>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="groups"
            :loading="loading"
            item-key="jsonTransformId"
          >
            <template v-slot:item.jsonTransformId="{ item }">
              {{ item.jsonTransformId || "-" }}
            </template>

            <template v-slot:item.name="{ item }">
              {{ item.name || "-" }}
            </template>

            <template v-slot:item.createdBy="{ item }">
              {{ item.createdBy || "-" }}
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="deleteItem(item)"
              ></v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-database-search</v-icon>
                <p class="text-grey mt-2">Tidak ada data tersedia</p>
                <p class="text-caption text-grey">
                  Tambahkan grup baru untuk memulai
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
        <v-card-title class="text-h6">Tambah Grup Baru</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newGroupName"
            label="Nama Grup"
            variant="outlined"
            required
            :rules="[(v) => !!v || 'Nama grup wajib diisi']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="addDialog = false">
            Batal
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            @click="createGroup"
            :loading="creating"
          >
            Tambah
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 text-success">
          <v-icon left color="success">mdi-check-circle</v-icon>
          Grup Berhasil Ditambahkan
        </v-card-title>
        <v-card-text>
          <div class="text-center pa-4">
            <v-icon size="64" color="success" class="mb-4"
              >mdi-check-circle-outline</v-icon
            >
            <p class="text-h6 mb-2">
              Group "{{ createdGroup?.name }}" berhasil ditambahkan!
            </p>
            <p class="text-body-1 mb-4">JSON Transform ID:</p>
            <div class="d-flex align-center justify-center gap-2">
              <v-chip
                color="primary"
                variant="tonal"
                size="large"
                class="ma-2 px-4"
              >
                {{ createdGroup?.jsonTransformId }}
              </v-chip>
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-content-copy"
                @click="copyToClipboard(createdGroup?.jsonTransformId)"
                size="small"
              >
                Salin
              </v-btn>
            </div>
            <p class="text-caption text-grey mt-4">
              Klik "Pergi ke Konfigurasi Detail" untuk menambahkan konfigurasi
              detail menggunakan JSON Transform ID ini.
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
            Pergi ke Konfigurasi Detail
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
        <v-card-title class="text-h6">Konfirmasi Hapus</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-alert-title>Peringatan</v-alert-title>
            Menghapus JSON Transform ID ini juga akan menghapus semua
            konfigurasi detail yang mengandung JSON Transform ID yang dipilih.
          </v-alert>

          <p>Apakah Anda yakin ingin menghapus grup voltage transform ini?</p>
          <p class="text-caption text-grey">
            Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi
            konfigurasi detail yang terkait.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Batal
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="confirmDelete"
            :loading="deleting"
          >
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
import voltageTransformGroupService from "../../services/voltageTransformGroupService";

export default {
  name: "VoltageTransformGroupList",
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
      createdGroup: null,
      groups: [],
      allGroups: [], // Store all data for filtering
      headers: [
        {
          title: "JSON Transform ID",
          value: "jsonTransformId",
          sortable: true,
        },
        { title: "Nama", value: "name", sortable: true },
        { title: "Dibuat Oleh", value: "createdBy", sortable: true },
        { title: "Dibuat Pada", value: "createdAt", sortable: true },
        { title: "Aksi", value: "actions", sortable: false, width: "100" },
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
        group.jsonTransformId?.toLowerCase().includes(searchTerm)
      );
    },

    openAddDialog() {
      this.newGroupName = "";
      this.addDialog = true;
    },

    async createGroup() {
      if (!this.newGroupName?.trim()) {
        this.showSnackbar("Silakan masukkan nama grup", "warning");
        return;
      }

      this.creating = true;
      try {
        const response = await voltageTransformGroupService.create({
          name: this.newGroupName.trim(),
        });

        if (response.success) {
          // Store the created group data
          this.createdGroup = {
            name: this.newGroupName.trim(),
            jsonTransformId: response.data?.message || response.message,
          };

          this.addDialog = false;
          this.newGroupName = "";

          // Show success dialog
          this.successDialog = true;

          // Reload data to show the new group
          await this.loadAllGroups();
        } else {
          this.showSnackbar("Gagal membuat grup", "error");
        }
      } catch (error) {
        console.error("Error creating group:", error);
        this.showSnackbar("Terjadi kesalahan saat membuat grup", "error");
      } finally {
        this.creating = false;
      }
    },

    async loadAllGroups() {
      this.loading = true;
      try {
        const response = await voltageTransformGroupService.getAll();
        console.log("Loaded groups:", response);
        if (response.success) {
          this.allGroups = response.data || [];
          this.groups = [...this.allGroups]; // Show all data initially
          if (this.allGroups.length > 0) {
            this.showSnackbar("Data berhasil dimuat", "success");
          }
        } else {
          this.showSnackbar("Gagal memuat data", "error");
        }
      } catch (error) {
        console.error("Error loading all groups:", error);
        this.showSnackbar("Terjadi kesalahan saat memuat data", "error");
      } finally {
        this.loading = false;
      }
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      if (!this.selectedItem?.jsonTransformId) return;

      this.deleting = true;
      try {
        const response = await voltageTransformGroupService.deleteById(
          this.selectedItem.jsonTransformId
        );
        if (response.success) {
          this.showSnackbar("Grup berhasil dihapus", "success");
          // Remove from both arrays
          this.groups = this.groups.filter(
            (group) =>
              group.jsonTransformId !== this.selectedItem.jsonTransformId
          );
          this.allGroups = this.allGroups.filter(
            (group) =>
              group.jsonTransformId !== this.selectedItem.jsonTransformId
          );
        } else {
          this.showSnackbar("Gagal menghapus grup", "error");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        this.showSnackbar("Terjadi kesalahan saat menghapus grup", "error");
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

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showSnackbar(
          "JSON Transform ID berhasil disalin ke clipboard!",
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
            "JSON Transform ID berhasil disalin ke clipboard!",
            "success"
          );
        } catch (fallbackError) {
          this.showSnackbar("Gagal menyalin ke clipboard", "error");
        }
        document.body.removeChild(textArea);
      }
    },

    goToDetailConfig() {
      // Close the success dialog
      this.successDialog = false;

      // Navigate to detail transform config page
      // You can pass the JSON Transform ID as a parameter if needed
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
