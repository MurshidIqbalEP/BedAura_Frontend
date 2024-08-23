import { Outlet } from "react-router-dom";
import Header from "../components/adminHeader";
import SideBar from "../components/adminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-grow">
        <div className="w-[16%]">
          <SideBar />
        </div>

        <div className="w-[85%]  p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
