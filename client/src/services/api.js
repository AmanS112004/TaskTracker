import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseURL && !baseURL.endsWith("/api")) {
  baseURL = `${baseURL}/api`;
}

const API = axios.create({
  baseURL,
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTasks = (params) => API.get("/tasks", { params });
export const getTaskStats = () => API.get("/tasks/stats");
export const getTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
