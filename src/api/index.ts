import axios from "axios";

export const ApiClient = axios.create({
  baseURL: process.env.CAISHEN_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

ApiClient.interceptors.request.use((config) => {
  return config;
});

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
