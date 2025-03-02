// services/api.ts - API Service for connecting to backend
import axios from "axios";

// Create axios instance with base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// Add request interceptor to include auth token from localStorage in browser
api.interceptors.request.use(
  (config) => {
    // Add token to header if available (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // For now, just logout the user - in a real app, you might implement token refresh here
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { email: string; password: string }) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  login: async (userData: { email: string; password: string }) => {
    const response = await api.post("/auth/login", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    return await api.get("/auth/logout");
  },

  getProfile: async () => {
    return await api.get("/auth/me");
  },

  updateProfile: async (profileData: {
    name?: string;
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
    activityLevel?: string;
    darkMode?: boolean;
    mealReminders?: boolean;
    units?: string;
  }) => {
    return await api.put("/users/profile", profileData);
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return await api.put("/auth/updatepassword", passwordData);
  },

  forgotPassword: async (email: string) => {
    return await api.post("/auth/forgotpassword", { email });
  },

  resetPassword: async (token: string, password: string) => {
    return await api.put(`/auth/resetpassword/${token}`, { password });
  },

  completeOnboarding: async () => {
    return await api.put("/users/complete-onboarding");
  },
};

// Meals API
export const mealsAPI = {
  getMeals: async (date?: string) => {
    const params = date ? { date } : {};
    return await api.get("/meals", { params });
  },

  getMealsByDateRange: async (startDate: string, endDate: string) => {
    return await api.get("/meals", {
      params: { startDate, endDate },
    });
  },

  getMealById: async (id: string) => {
    return await api.get(`/meals/${id}`);
  },

  createMeal: async (mealData: {
    name: string;
    calories: number;
    date: string;
  }) => {
    return await api.post("/meals", mealData);
  },

  updateMeal: async (
    id: string,
    mealData: { name?: string; calories?: number; date?: string }
  ) => {
    return await api.put(`/meals/${id}`, mealData);
  },

  deleteMeal: async (id: string) => {
    return await api.delete(`/meals/${id}`);
  },

  getMealSummary: async (startDate?: string, endDate?: string) => {
    const params = startDate && endDate ? { startDate, endDate } : {};
    return await api.get("/meals/summary", { params });
  },

  analyzeMealText: async (text: string) => {
    return await api.post("/meals/analyze-text", { text });
  },

  uploadMealImage: async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    return await api.post("/meals", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Weight API
export const weightAPI = {
  getWeightEntries: async (startDate?: string, endDate?: string) => {
    const params = startDate && endDate ? { startDate, endDate } : {};
    return await api.get("/weight", { params });
  },

  getWeightEntry: async (id: string) => {
    return await api.get(`/weight/${id}`);
  },

  createWeightEntry: async (weightData: {
    weight: number;
    date?: string;
    unit?: string;
    notes?: string;
  }) => {
    return await api.post("/weight", weightData);
  },

  updateWeightEntry: async (
    id: string,
    weightData: {
      weight?: number;
      date?: string;
      unit?: string;
      notes?: string;
    }
  ) => {
    return await api.put(`/weight/${id}`, weightData);
  },

  deleteWeightEntry: async (id: string) => {
    return await api.delete(`/weight/${id}`);
  },

  getWeightProgress: async () => {
    return await api.get("/weight/progress");
  },
};

// Goals API
export const goalsAPI = {
  getCurrentGoal: async () => {
    return await api.get("/goals/current");
  },

  getAllGoals: async () => {
    return await api.get("/goals");
  },

  createGoal: async (goalData: {
    currentWeight: number;
    goalWeight: number;
    targetDate: string;
    type?: string;
    weeklyWeightChange?: number;
    nutrition?: {
      dailyCalories: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }) => {
    return await api.post("/goals", goalData);
  },

  updateGoal: async (
    id: string,
    goalData: {
      currentWeight?: number;
      goalWeight?: number;
      targetDate?: string;
      type?: string;
      weeklyWeightChange?: number;
      nutrition?: {
        dailyCalories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
      };
    }
  ) => {
    return await api.put(`/goals/${id}`, goalData);
  },

  deleteGoal: async (id: string) => {
    return await api.delete(`/goals/${id}`);
  },

  calculateCalories: async (userData: {
    currentWeight: number;
    goalWeight?: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: string;
    targetDate?: string;
    weeklyWeightChange?: number;
  }) => {
    return await api.post("/goals/calculate-calories", userData);
  },
};

export default api;
