import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

function userProtect() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return userInfo ? <Outlet /> : <Navigate to="/home" replace />;
}

export default userProtect;
