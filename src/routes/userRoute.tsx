import { Routes, Route, Navigate } from "react-router-dom";
import UserProtect from "../utils/userProtectedRoute.tsx";
import UserLayout from "../layouts/userLayout.jsx";
import LoginPage from "../pages/login.tsx";
import SignUp from "../pages/signUp.tsx";
import HomePage from "../pages/home.tsx";
import OtpPage from "../pages/otp.tsx";
import ForgetPass from "../pages/forgetPassword.tsx";
import ForgetOtp from "../pages/otpPageForget.tsx";
import ChangePass from "../pages/change-pass.tsx";
import AddSpace from "../pages/addSpace.tsx";
import YourRooms from "../pages/yourRooms.tsx";
import EditRoom from "../pages/editRoom.tsx";
import AllRooms from "../pages/allRooms.tsx";
import BlockedPage from "../pages/userPages/blockedPage.tsx";
import Profile from "../pages/userPages/profile.tsx";
import RoomDetails from "../pages/userPages/roomDetails.tsx";
import MyBookings from "../pages/userPages/myBookings.tsx";
import Videocall from "../components/videocall.tsx";

export default function userRoute() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="allRooms" element={<AllRooms />} />

        {/* user protected Routes */}
        <Route element={<UserProtect />}>
          
          <Route path="yourRooms" element={<YourRooms />} />
          <Route path="editRoom/:id" element={<EditRoom />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/room-details/:id" element={<RoomDetails />} />
          <Route path="/myBookings" element={<MyBookings />} />
          <Route path="/videocallRoom/:roomId" element={<Videocall />} />
         
         
        </Route>
        
        <Route path="addSpace" element={<AddSpace />} />
        <Route path="blocked" element={<BlockedPage />} />
      </Route>
      
     
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<SignUp />} />
      <Route path="otp" element={<OtpPage />} />
      <Route path="forgetOtp" element={<ForgetOtp />} />
      <Route path="forget-pass" element={<ForgetPass />} />
      <Route path="change-Pass" element={<ChangePass />} />
      
      <Route path="*" element={<Navigate to="/login" />} />
      
    </Routes>
  );
}
