import {Routes,Route} from "react-router-dom"

import UserLayout from "../layouts/userLayout.jsx";
import LoginPage from "../pages/login.tsx"
import SignUp from "../pages/signUp.tsx";
import HomePage from "../pages/home.tsx";
import OtpPage from "../pages/otp.tsx";
import ForgetPass from "../pages/forgetPassword.tsx"
import ForgetOtp from "../pages/otpPageForget.tsx"
import ChangePass from "../pages/change-pass.tsx"
import AddSpace from "../pages/addSpace.tsx";
import YourRooms from "../pages/yourRooms.tsx";
import EditRoom from "../pages/editRoom.tsx";
import AllRooms from "../pages/allRooms.tsx";

export default function userRoute() {
  return (
    <Routes>
    <Route path="/" element={<UserLayout />}>
    
      <Route index element={<HomePage />} />  
      <Route path="addSpace" element={<AddSpace />} /> 
      <Route path="yourRooms" element={<YourRooms />} /> 
      <Route path="editRoom/:id" element={< EditRoom/>} /> 
      <Route path="allRooms" element={< AllRooms/>} /> 
      
    </Route>

    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<SignUp />} />
    <Route path="otp" element={<OtpPage />} />
    <Route path="forgetOtp" element={<ForgetOtp />} />
    <Route path="forget-pass" element={<ForgetPass />} />
    <Route path="change-Pass" element={<ChangePass />} />
  </Routes>
  )
}
