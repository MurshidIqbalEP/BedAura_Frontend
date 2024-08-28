import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axios from "axios";

interface IErrorResponse {
  message: string;
  accountType?: string;
  status?: boolean;
}

const errorHandle = (error: Error | AxiosError) => {
  let hasShownToast = false; // Flag to prevent multiple toasts

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const errorResponse = axiosError.response.data as IErrorResponse;

      console.log("Error Response:", errorResponse);

      switch (axiosError.response.status) {
        case 400:
        case 401:
        case 403:
          toast.error(
            errorResponse.message || "A client error occurred. Please try again."
          );

          setTimeout(()=>{
            window.location.href = "/blocked";
          },2000)
          
          hasShownToast = true;
          break;
        case 404:
          toast.error("The requested resource was not found.");
          hasShownToast = true;
          break;
        case 500:
          toast.error(
            "An internal server error occurred. Please try again later."
          );
          hasShownToast = true;
          break;
        default:
          // Handle unexpected errors
          toast.error(
            errorResponse.message || "An unexpected error occurred. Please try again."
          );
          hasShownToast = true;
      }

      // Additional handling based on errorResponse properties
      if (errorResponse.accountType) {
        // You can implement specific logic based on accountType if needed
        console.log("Account Type:", errorResponse.accountType);
      }

      if (errorResponse.status === false && !hasShownToast) {
        // Only show toast if one hasn't been shown yet
        toast.error(
          errorResponse.message || "An error occurred. Please try again."
        );
        hasShownToast = true;
      }
    } else {
      // No response from the server
      toast.error("No response from the server. Please check your connection.");
      console.log("Axios Error:", axiosError.message);
    }
  } else {
    // Non-Axios error
    toast.error("An unexpected error occurred. Please try again.");
    console.log("Error:", error.message);
  }
};

export default errorHandle;
