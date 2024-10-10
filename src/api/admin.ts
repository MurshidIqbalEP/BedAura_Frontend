import errorHandle from "./error";
import Api from "../services/axois";
import adminEndpoints from "../services/endpoints/adminEndpoints";

export const getAllUsers = async (): Promise<any> => {
  try {
    let response = await Api.get(adminEndpoints.getAllUsers);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const blockUser = async (email: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.blockUser, { email });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const unBlockUser = async (email: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.unBlockUser, { email });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const fetchEditRequests = async (): Promise<any> => {
  try {
    let response = await Api.get(adminEndpoints.fetchEditRequests);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const ApproveEdit = async (roomId: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.approveEdit, {
      roomId: roomId,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const ApproveRoom = async (roomId: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.approveRoom, {
      roomId: roomId,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const fetchNewRoomRequests = async (): Promise<any> => {
  try {
    let response = await Api.get(adminEndpoints.fetchNewRoomRequests);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const fetchAllRooms = async (): Promise<any> => {
  try {
    let response = await Api.get(adminEndpoints.fetchAllRoom);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const UnlistRoom = async (id: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.unlistRoom, { id });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const ListRoom = async (id: string): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.listRoom, { id });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const fetchOptions = async (): Promise<any> => {
  try {
    let response = await Api.get(adminEndpoints.fetchOptions);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const addOption = async (
  category: string,
  newValue: string
): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.addOption, {
      category,
      newValue,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const removeOption = async (
  category: string,
  newValue: string
): Promise<any> => {
  try {
    let response = await Api.patch(adminEndpoints.removeOption, {
      category,
      newValue,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    errorHandle(err);
  }
};

export const fetchBookingPerMounth = async () => {
  try {
    const response = await Api.get(adminEndpoints.fetchBookingPerMounth);

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchPieChartData = async () => {
  try {
    const response = await Api.get(adminEndpoints.fetchPieChartData);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const fetchBookingDataByCity = async () => {
  try {
    const response = await Api.get(adminEndpoints.fetchBookingDataByCity);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const rejectRoom = async (room: any, reason: string) => {
  try {
    const response = await Api.patch(adminEndpoints.rejectRoom, {
      roomId: room._id,
      reason,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
