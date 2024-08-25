import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

function adminProtect() {
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  return adminInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

export default adminProtect;
