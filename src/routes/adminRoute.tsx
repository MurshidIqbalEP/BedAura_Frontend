import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/adminLayout";
import AdminProtect from "../utils/adminProtectedRoute";
import UsersPage from "../pages/adminPages/usersPage";
import Login from "../pages/login";
import EditRequestes from "../pages/adminPages/editRequestes";
import RoomRequests from "../pages/adminPages/roomRequests"
import AllRooms from "../pages/adminPages/allRooms";
import Options from "../pages/adminPages/options";
import Dashboard from "../pages/adminPages/dashboard";

export default function adminRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<AdminLayout />}>
        {/* admin Private Routes */}
        <Route element={<AdminProtect />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/Editrequests" element={<EditRequestes />} />
          <Route path="/RoomRequests" element={< RoomRequests/>} />
          <Route path="/options" element={<Options/>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
