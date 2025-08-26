import api from "./api";

class VoltageTransformService {
  constructor() {
    this.basePath = "/voltage-transform-detail-config";
  }

  async getAll() {
    try {
      const response = await api.get(`${this.basePath}/get-all`);
      return {
        success: true,
        data: response.data || response || [],
      };
    } catch (error) {
      console.error("Error fetching voltage transform configurations:", error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.basePath}/get-by-id`, {
        params: { id },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Error fetching voltage transform configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  async create(data) {
    try {
      const response = await api.post(`${this.basePath}/set`, data);
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Error creating voltage transform configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  async update(data) {
    try {
      const response = await api.put(`${this.basePath}/put`, data);
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Error updating voltage transform configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  async deleteById(id) {
    try {
      const response = await api.delete(`${this.basePath}/delete-by-id`, {
        params: { id },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Error deleting voltage transform configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  async deleteByIdAndJsonName(id, jsonPathName) {
    try {
      const response = await api.delete(
        `${this.basePath}/delete-by-id-and-json-name`,
        {
          params: { id, jsonPathName },
        }
      );
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error(
        "Error deleting voltage transform configuration by id and json name:",
        error
      );
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }
}

export default new VoltageTransformService();
