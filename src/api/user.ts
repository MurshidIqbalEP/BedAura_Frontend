import errorHandle from "./error";
import Api from "../services/axois";
import userRoutes from "../services/endpoints/userEndpoints";
import { User } from "../services/types";

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
  isGoogle: boolean,
  image: string
) => {
  try {
    let response = await Api.post(userRoutes.Gsignup, {
      name,
      email,
      password,
      isGoogle,
      image,
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

export const verify_Forgetotp = async (otp: string, email: string) => {
  try {
    let response = await Api.post(userRoutes.verify_Forgetotp, { email, otp });
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

export const forgetPass = async (email: string) => {
  try {
    let response = await Api.post(userRoutes.forgetPass, { email });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const changePass = async (email: string, password: string) => {
  try {
    let response = await Api.post(userRoutes.changePass, { email, password });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const addRoom = async (formData: FormData) => {
  try {
    const response = await Api.post(userRoutes.addRoom, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    const response = await Api.patch(userRoutes.editRoom, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchRooms = async (id: string) => {
  try {
    const response = await Api.get(userRoutes.fetchRoomsById, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchAllRooms = async (
  page: number,
  limit: number,
  searchTerm: any,
  filters: any,
  sortBy: any
) => {
  try {
    const filterString = JSON.stringify(filters);
    const response = await Api.get(
      `${
        userRoutes.fetchAllRooms
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(
        searchTerm
      )}&filters=${encodeURIComponent(filterString)}&sort=${encodeURIComponent(
        sortBy
      )}`
    );

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchRoom = async (id: string) => {
  try {
    const response = await Api.get(userRoutes.fetchRoomById, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const editUser = async (user: User) => {
  try {
    const response = await Api.put(userRoutes.editUser, user);

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchNearestRooms = async (
  lat: number,
  lon: number,
  limit: number,
  currentPage: number
) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchNearestRooms}?lat=${lat}&lon=${lon}&page=${currentPage}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const bookRoom = async (
  token: object,
  roomId: string,
  userId: string,
  formData: any
) => {
  try {
    const response = await Api.post(userRoutes.bookRoom, {
      token,
      roomId,
      userId,
      formData,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const logOut = async () => {
  try {
    const response = await Api.post(userRoutes.logOut);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchBooking = async (userId: string) => {
  try {
    const response = await Api.get(`${userRoutes.fetchBookings}/${userId}`);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  email: string
) => {
  try {
    const response = await Api.post(userRoutes.changePassword, {
      oldPassword,
      newPassword,
      email,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchWallet = async (userId: string) => {
  try {
    const response = await Api.get(`${userRoutes.fetchWallet}/${userId}`);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const postReview = async (
  roomId: string,
  userId: String,
  rating: number,
  review: string
) => {
  try {
    const response = await Api.post(userRoutes.postReview, {
      roomId,
      userId,
      rating,
      review,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchReviews = async (roomId: string) => {
  try {
    const response = await Api.get(`${userRoutes.fetchReviews}/${roomId}`);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const postMessage = async (messageData: any) => {
  try {
    const response = await Api.post(userRoutes.postMessage, {
      sender: messageData.senderId,
      reciever: messageData.receiverId,
      message: messageData.message,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchPrevMsgs = async (sender: string, receiver: string) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchPrevMsgs}?sender=${sender}&receiver=${receiver}`
    );
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchContacts = async (currentUserId: string) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchContacts}?currentUserId=${currentUserId}`
    );
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchOwnerDetails = async (chattingWithUserId: string) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchOwnerDetails}?ownerUserId=${chattingWithUserId}`
    );
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const cancelBooking = async (room: any) => {
  try {
    const response = await Api.post(userRoutes.cancelBooking, { room });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const checkBookingValid = async (
  roomId: any,
  checkIn: Date,
  checkOut: Date
) => {
  try {
    const response = await Api.get(
      `${userRoutes.checkBookingValid}?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const bookRoomWallet = async (
  roomId: string,
  userId: string,
  formData: any
) => {
  try {
    const response = await Api.post(userRoutes.bookRoomWallet, {
      roomId,
      userId,
      formData,
    });

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchUserPieChartData = async (userId: string) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchUserPieChartData}?userId=${userId}`
    );

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchUsersRoomBookings = async (userId: string) => {
  try {
    const response = await Api.get(
      `${userRoutes.fetchUsersRoomBookings}?userId=${userId}`
    );

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
