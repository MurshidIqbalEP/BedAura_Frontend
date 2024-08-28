import axios from "axios";
import errorHandle from "../api/error";

const BASE_URL = "http://127.0.0.1:3000/api";

const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);



Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for unauthorized errors (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite retry loop
      console.log(error.response.status);
      try {
        // Refresh the access token
        console.log("hai");

        const res = await axios.get(
          BASE_URL+"/user/refresh-token",
          { withCredentials: true }
        );
        let newAccessToken = res.data.accessToken;
        console.log(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer${newAccessToken}`;
        // Retry the original request with the new access token
        return Api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // localStorage.removeItem("token");
        // localStorage.removeItem('userInfo')
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    
    return Promise.reject(error);
  }
);

export default Api;
