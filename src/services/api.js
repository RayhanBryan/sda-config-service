// API base URL - sesuaikan dengan environment Anda
const API_BASE_URL = "http://20.64.178.18:8081";

// API service untuk authentication
export const authService = {
  // Login dengan username dan password
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout (jika ada endpoint logout)
  async logout() {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  // Verify token (jika ada endpoint verify)
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  },
};

// Generic API service untuk request lainnya
export const apiService = {
  async get(endpoint, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Default API instance untuk general requests
const api = {
  baseURL: API_BASE_URL,

  async get(endpoint, config = {}) {
    const token = sessionStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] !== null && config.params[key] !== undefined) {
          url.searchParams.append(key, config.params[key]);
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post(endpoint, data, config = {}) {
    const token = sessionStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put(endpoint, data, config = {}) {
    const token = sessionStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete(endpoint, config = {}) {
    const token = sessionStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] !== null && config.params[key] !== undefined) {
          url.searchParams.append(key, config.params[key]);
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default api;
