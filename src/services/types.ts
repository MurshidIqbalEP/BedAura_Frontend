export interface User {
    _id: string;
    id:string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    isAdmin: boolean;
    image:string;
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
    additionalOptions:string[];
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
    additionalOptions:string[];
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

  export interface ITransaction {
    amount: number;
    description: string;
    date?: Date; 
    transactionType: 'credit' | 'debit';
  }
  
  export interface IWallet {
    userId: string;
    balance: number;
    transactions: ITransaction[];
  }

  export interface IReview {
    _id: string;           
    userId: User;        
    roomId: string;        
    rating: number;        
    review: string;      
    createdAt: string;     
    updatedAt?: string;   
  }
  
  