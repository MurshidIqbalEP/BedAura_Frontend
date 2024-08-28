import errorHandle from "./error";
import Api from "../services/axois";
import adminEndpoints from "../services/endpoints/adminEndpoints";


export const getAllUsers = async () : Promise<any> => {
    try {
  
      let response = await Api.get(adminEndpoints.getAllUsers);
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };


  export const blockUser = async (email:string) : Promise<any> => {
    try {
  
      let response = await Api.patch(adminEndpoints.blockUser,{email});
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };

  export const unBlockUser = async (email:string) : Promise<any> => {
    try {
  
      let response = await Api.patch(adminEndpoints.unBlockUser,{email});
      return response;

    } catch (error) {
      const err: Error = error as Error;
        errorHandle(err);
    }
  };

  export const fetchEditRequests = async (): Promise<any> => {
    try {
      
      let response = await Api.get(adminEndpoints.fetchEditRequests)
      return response;
      
    } catch (error) {
      const err: Error = error as Error;
      errorHandle(err);
    }
  }

  export const  ApproveEdit = async (roomId:string): Promise<any> => {
    try {
      let response = await Api.patch(adminEndpoints.approveEdit, {
        roomId: roomId,
      })
      return response;
    } catch (error) {
      const err: Error = error as Error;
      errorHandle(err);
    }
  }

  export const  ApproveRoom = async (roomId:string): Promise<any> => {
    try {
      let response = await Api.patch(adminEndpoints.approveRoom, {
        roomId: roomId,
      })
      return response;
    } catch (error) {
      const err: Error = error as Error;
      errorHandle(err);
    }
  }

  export const fetchNewRoomRequests = async ():Promise<any>  =>{
    try {
      let response = await Api.get(adminEndpoints.fetchNewRoomRequests)
      return response;
    } catch (error) {
      const err: Error = error as Error;
      errorHandle(err);
    }
  }

