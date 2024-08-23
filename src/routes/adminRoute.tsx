import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/adminLayout";

import UsersPage from "../pages/adminPages/usersPage";
import Login from "../pages/login";

export default function adminRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}
