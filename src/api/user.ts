import errorHandle from "./error";
import Api from "../services/axois";
import userRoutes from "../services/endpoints/userEndpoints";
import axios from "axios";

export const login = async (email: string, password: string) => {
  try {

    let response = await Api.post(userRoutes.login, { email, password });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const sign_up = async (
  name: string,
  email: string,
  password: string,
  number: string
) => {
  try {
    let response = await Api.post(userRoutes.signup, {
      name,
      email,
      password,
      number,
    });

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const Gsign_up = async (
  name: string,
  email: string,
  password: string,
  isGoogle: boolean
) => {
  try {
    let response = await Api.post(userRoutes.Gsignup, {
      name,
      email,
      password,
      isGoogle,
    });

    return response;

  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const verify_otp = async (otp: string, email: string) => {
  try {
    let response = await Api.post(userRoutes.verify_otp, { email, otp });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const verify_Forgetotp = async (otp:string,email:string)=>{
  try {
    let response = await Api.post(userRoutes.verify_Forgetotp, { email, otp });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
}
export const resend_otp = async (email: string) => {
  try {
    let response = await Api.post(userRoutes.resendOtp, { email });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const forgetPass = async(email:string)=>{
   try {
    let response = await Api.post(userRoutes.forgetPass, { email });
    return response.data
   } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
   }
}

export const changePass = async (email:string,password:string)=>{
  try {
    let response = await Api.post(userRoutes.changePass, { email,password });
    return response.data
   } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
   }
}

export const addRoom = async (formData: FormData) => {
  try {
    const response = await Api.post(userRoutes.addRoom, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const editRoomApi = async (formData: FormData) => {
  try {
    console.log(addRoom);
    
    const response = await Api.patch(userRoutes.editRoom, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const fetchRooms = async (id:string) => {
  try {


    const response = await Api.get(userRoutes.fetchRoomsById, {
      params: { id }
    });

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchAllRooms = async (page: number, limit: number)=>{
  try {
    const response = await Api.get(`${userRoutes.fetchAllRooms}?page=${page}&limit=${limit}`);

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
}

export const fetchRoom = async (id:string) => {
  try {
    const response = await Api.get(userRoutes.fetchRoomById, {
      params: { id }
    });
    
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
