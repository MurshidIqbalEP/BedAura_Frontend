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
  