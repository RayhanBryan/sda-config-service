import api from "./api";

const voltageTransformGroupService = {
  async create(data) {
    try {
      const response = await api.post(
        "/voltage-transform-group-id/get-id?name=" + data.name
      );
      console.log("Create response:", response);

      return {
        success: true,
        data: response.data || response || [],
      };
    } catch (error) {
      console.error("Error creating voltage transform group:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create data",
      };
    }
  },

  async search(searchTerm) {
    // Local search function - will be used for filtering loaded data
    return {
      success: true,
      searchTerm: searchTerm,
    };
  },

  async getAll() {
    try {
      const response = await api.get("/voltage-transform-group-id/get-all");
      return {
        success: true,
        data: response.data || response || [],
      };
    } catch (error) {
      console.error("Error getting all voltage transform groups:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load data",
      };
    }
  },

  async deleteById(id) {
    try {
      const response = await api.delete(
        `/voltage-transform-group-id/delete-by-id?id=${id}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error deleting voltage transform group:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete",
      };
    }
  },
};

export default voltageTransformGroupService;
