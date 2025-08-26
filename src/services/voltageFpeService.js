import api from "./api";

class VoltageFpeService {
  constructor() {
    this.basePath = "/voltage-fpe-config";
  }

  async getAll() {
    try {
      const response = await api.get(`${this.basePath}/get-all`);
      return {
        success: true,
        data: response.data || response || [],
      };
    } catch (error) {
      console.error("Error fetching voltage FPE configurations:", error);
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
      console.error("Error fetching voltage FPE configuration:", error);
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
      console.error("Error creating voltage FPE configuration:", error);
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
      console.error("Error updating voltage FPE configuration:", error);
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
      console.error("Error deleting voltage FPE configuration:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }
}

export default new VoltageFpeService();
