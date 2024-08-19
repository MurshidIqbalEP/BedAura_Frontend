import errorHandle from "./error";
import Api from "../services/axois";
import userRoutes from "../services/endpoints/userEndpoints";

export const login = async (email: string, password: string) => {
  try {
    console.log("login api caalling");

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

export const resend_otp = async (email: string) => {
  try {
    let response = await Api.post(userRoutes.resendOtp, { email });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
