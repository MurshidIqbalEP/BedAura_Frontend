import {Routes,Route} from "react-router-dom"

import UserLayout from "../layouts/userLayout.jsx";
import LoginPage from "../pages/login.tsx"
import SignUp from "../pages/signUp.tsx";
import HomePage from "../pages/home.tsx";
import OtpPage from "../pages/otp.tsx"


export default function userRoute() {
  return (
    <Routes>
    <Route path="/" element={<UserLayout />}>
    
      <Route index element={<HomePage />} />  {/* Default route
      {/* <Route path="about" element={<AboutPage />} /> */}
      {/* <Route path="dashboard" element={<DashboardPage />} /> */} 
      
    </Route>

    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<SignUp />} />
    <Route path="otp" element={<OtpPage />} />
  </Routes>
  )
}
