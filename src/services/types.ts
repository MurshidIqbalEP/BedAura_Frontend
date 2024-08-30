export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    isAdmin: boolean;
}