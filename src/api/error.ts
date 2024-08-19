import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axios from "axios";

interface IErrorResponse {
  message: string;
  accountType?: string;
  status?:boolean;
}

const errorHandle = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.data) {
      const errorResponse = axiosError.response.data as IErrorResponse;
      
      console.log(errorResponse);
      
      
        if (axiosError.response.status === 400) {

          
        toast.error(errorResponse.message || errorResponse.toString() );
      } else if (errorResponse.message) {
        toast.error(errorResponse.message);
      } else if(errorResponse.status === false){
        
        toast.error(errorResponse.message);
      }
      
      else {
        console.log("Error response has no message");
        toast.error("An error occurred. Please try again!");
      }
    } else {
      toast.error("An error occurred. Please try again!");
      console.log("axiosError", axiosError.message);
    }
  } else {
    toast.error("An error occurred. Please try again!");
    console.log("Error", error.message);
  }
};

export default errorHandle;
