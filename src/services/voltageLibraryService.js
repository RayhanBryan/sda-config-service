import api from "./api";

class VoltageLibraryService {
  constructor() {
    this.basePath = "/voltage-library-context-config";
  }

  async getAll() {
    try {
      const response = await api.get(`${this.basePath}/get-all`);
      return {
        success: true,
        data: response.data || response || [],
      };
    } catch (error) {
      console.error("Error fetching voltage library configurations:", error);
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
      console.error("Error fetching voltage library configuration:", error);
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
      console.error("Error creating voltage library configuration:", error);
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
      console.error("Error updating voltage library configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.basePath}/delete`, {
        params: { id },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Error deleting voltage library configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }
}

export default new VoltageLibraryService();
