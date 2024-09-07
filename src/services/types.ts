export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    isAdmin: boolean;
}

interface Coordinates {
    lat: number;
    lng: number;
  }
  
export interface Room {
    _id: string;
    name: string;
    mobile: string;
    userId: string;
    maintenanceCharge: string;
    securityDeposit: string;
    gender: string;
    slots: number;
    roomType: string;
    noticePeriod: string;
    electricityCharge: string;
    location: string;
    description: string;
    coordinates: Coordinates;
    images: string[];
    isAproved: boolean;
  }

  export interface RoomData {
    amount: number;
    createdAt: string;
    paymentId: string;
    roomId: Room;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
    description: string;
    gender: string;
    images: string[];
    isApproved: boolean;
    isEdited: boolean;
    isListed: boolean;
    location: string;
    maintenanceCharge: string;
    mobile: string;
    name: string;
    noticePeriod: string;
    roomType: string;
    securityDeposit: string;
    slots: number;
    userId: string;
    __v: number;
    _id: string;
    roomName: string;
    status: string;
    updatedAt: string;
  }
  
  