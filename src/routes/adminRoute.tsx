import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/adminLayout";
import AdminProtect from "../utils/userProtectedRoute";
import UsersPage from "../pages/adminPages/usersPage";
import Login from "../pages/login";

export default function adminRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<AdminLayout />}>
        {/* admin Protected Routes */}
        <Route element={<AdminProtect />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
