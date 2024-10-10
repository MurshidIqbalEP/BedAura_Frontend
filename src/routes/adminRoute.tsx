import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/roomLoadingAnimation.json";

// Lazy Load components
const AdminLayout = lazy(() => import("../layouts/adminLayout"));
const AdminProtect = lazy(() => import("../utils/adminProtectedRoute"));
const UsersPage = lazy(() => import("../pages/adminPages/usersPage"));
const Login = lazy(() => import("../pages/login"));
const EditRequests = lazy(() => import("../pages/adminPages/editRequestes"));
const RoomRequests = lazy(() => import("../pages/adminPages/roomRequests"));
const AllRooms = lazy(() => import("../pages/adminPages/allRooms"));
const Options = lazy(() => import("../pages/adminPages/options"));
const Dashboard = lazy(() => import("../pages/adminPages/dashboard"));

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function adminRoute() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Lottie options={defaultOptions} height={300} width={300} /></div>}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AdminLayout />}>
          {/* admin Private Routes */}
          <Route element={<AdminProtect />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Editrequests" element={<EditRequests />} />
            <Route path="/RoomRequests" element={<RoomRequests />} />
            <Route path="/options" element={<Options />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
}
