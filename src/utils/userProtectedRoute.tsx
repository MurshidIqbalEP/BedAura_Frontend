import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

function userProtect() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
   
  return userInfo && userInfo.isAdmin=== false ? <Outlet /> : <Navigate to="/login" replace />;
}

export default userProtect;
