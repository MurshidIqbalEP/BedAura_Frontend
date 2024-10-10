import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProtect from "../utils/userProtectedRoute.tsx";
import loadingAnimation from "../assets/roomLoadingAnimation.json";
import Lottie from "react-lottie";

const UserLayout = lazy(() => import("../layouts/userLayout.jsx"));
const LoginPage = lazy(() => import("../pages/login.tsx"));
const SignUp = lazy(() => import("../pages/signUp.tsx"));
const HomePage = lazy(() => import("../pages/userPages/home.tsx"));
const OtpPage = lazy(() => import("../pages/otp.tsx"));
const ForgetPass = lazy(() => import("../pages/userPages/forgetPassword.tsx"));
const ForgetOtp = lazy(() => import("../pages/otpPageForget.tsx"));
const ChangePass = lazy(() => import("../pages/userPages/change-pass.tsx"));
const AddSpace = lazy(() => import("../pages/userPages/addSpace.tsx"));
const YourRooms = lazy(() => import("../pages/userPages/yourRooms.tsx"));
const EditRoom = lazy(() => import("../pages/userPages/editRoom.tsx"));
const AllRooms = lazy(() => import("../pages/userPages/allRooms.tsx"));
const BlockedPage = lazy(() => import("../pages/userPages/blockedPage.tsx"));
const Profile = lazy(() => import("../pages/userPages/profile.tsx"));
const RoomDetails = lazy(() => import("../pages/userPages/roomDetails.tsx"));
const MyBookings = lazy(() => import("../pages/userPages/myBookings.tsx"));
const Videocall = lazy(() => import("../components/videocall.tsx"));
const MultiStepForm = lazy(() => import("../components/multiStepForm.tsx"));

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function userRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      }
    >
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
            <Route path="/muti" element={<MultiStepForm />} />
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
    </Suspense>
  );
}
