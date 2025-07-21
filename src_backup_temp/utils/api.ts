import axios from "axios"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Important for cookies/session
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.log("Authentication required")
    }

    if (error.response?.status === 403) {
      // Forbidden
      console.log("Access denied")
    }

    return Promise.reject(error)
  },
)

// Item-related API calls
export const itemsApi = {
  getAll: (category?: string) => {
    const params = category ? { category } : {}
    return api.get("/items", { params })
  },

  getById: (id: string) => api.get(`/items/${id}`),

  create: (itemData: any) => api.post("/items", itemData),

  claim: (id: string) => api.post(`/items/${id}/claim`),

  getMyItems: () => api.get("/items/my-items"),
}

// User-related API calls
export const usersApi = {
  login: (email: string, password: string) => api.post("/users/login", { email, password }),

  register: (email: string, password: string, name: string) => api.post("/users/register", { email, password, name }),

  logout: () => api.post("/users/logout"),

  getProfile: () => api.get("/users/profile"),

  updateProfile: (userData: any) => api.put("/users/profile", userData),
}

// Admin-related API calls
export const adminApi = {
  login: (email: string, password: string) => api.post("/admin/login", { email, password }),

  getUsers: () => api.get("/admin/users"),

  updateUser: (id: string, userData: any) => api.patch(`/admin/users/${id}`, userData),

  getItems: () => api.get("/admin/items"),

  moderateItem: (id: string, action: "approved" | "rejected") => api.post(`/admin/items/${id}/moderate`, { action }),

  getUserStats: () => api.get("/admin/analytics/users"),

  getActivityOverview: () => api.get("/admin/analytics/activity"),
}