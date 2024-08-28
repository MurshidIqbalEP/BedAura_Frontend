import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/adminLayout";
import AdminProtect from "../utils/adminProtectedRoute";
import UsersPage from "../pages/adminPages/usersPage";
import Login from "../pages/login";
import EditRequestes from "../pages/adminPages/editRequestes";
import RoomRequests from "../pages/adminPages/roomRequests"

export default function adminRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<AdminLayout />}>
        {/* admin Private Routes */}
        <Route element={<AdminProtect />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/Editrequests" element={<EditRequestes />} />
          <Route path="/RoomRequests" element={< RoomRequests/>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
