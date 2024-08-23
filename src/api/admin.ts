import errorHandle from "./error";
import Api from "../services/axois";
import adminRoutes from "../services/endpoints/adminEndpoints";


export const getAllUsers = async () : Promise<any> => {
    try {
  
      let response = await Api.get(adminRoutes.getAllUsers);
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };


  export const blockUser = async (email:string) : Promise<any> => {
    try {
  
      let response = await Api.patch(adminRoutes.blockUser,{email});
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };

  export const unBlockUser = async (email:string) : Promise<any> => {
    try {
  
      let response = await Api.patch(adminRoutes.unBlockUser,{email});
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };

