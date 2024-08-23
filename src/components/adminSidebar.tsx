import { NavLink } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { MdUpcoming } from "react-icons/md";    
import { RiLogoutBoxFill } from "react-icons/ri";


function sideBar() {
  const activeStyle = {
    backgroundColor: "#0F1015",
    color: "white ",
  };

  return (
    <div className="mt-20">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-50 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div
          className="h-full p-1 py-4 overflow-y-auto bg-gray-50 dark:bg-[#191C24]"
          style={{ marginTop: "58px" }}
        >
          <ul className="space-y-2 font-medium">
            
            <li>
              <NavLink
                to="/admin/users"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-[#5F7093] hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <FaUsers />

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Users list
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/rooms"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-[#5F7093] hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                
                 <FaBed />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Rooms
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/requests"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-[#5F7093] hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <MdUpcoming />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Room Requests
                </span>
                
              </NavLink>
            </li>

            
            
            <li>
              <NavLink
                to="/admin/coupons"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-[#5F7093] hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <RiLogoutBoxFill />

                <span className="flex-1 ms-3 whitespace-nowrap">LogOut</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default sideBar;
