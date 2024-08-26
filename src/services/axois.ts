import axios from "axios";
import errorHandle from "../api/error";




const BASE_URL = "http://127.0.0.1:3000/api";

const Api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,
});


Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for unauthorized errors (401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop
      console.log(error.response.status );
      
      try {
        // Refresh the access token
        console.log("hai");
        
        const res = await Api.post('user/refresh-token', {}, { withCredentials: true });
        console.log("oi");
        
        let newAccessToken = res.data.accessToken;


        localStorage.setItem('accessToken', newAccessToken);
        Api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return Api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      errorHandle(error); // Your custom error handling function
    } else {
      console.log('Axios error:', error);
    }
    return Promise.reject(error);
  }
);


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

export default Api;