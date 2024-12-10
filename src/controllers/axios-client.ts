import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor to attach Authorization header dynamically
axiosClient.interceptors.request.use(
  (config) => {
    // Check if we're running on the client-side (browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      // Attach token to the Authorization header if it exists
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // Handle request error (optional)
    return Promise.reject(error);
  }
);

export default axiosClient;
