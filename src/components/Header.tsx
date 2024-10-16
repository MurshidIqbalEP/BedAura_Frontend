import { useState } from "react";
import Logo from "../assets/img/white.png";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../redux/Slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import defaultProfile from "../assets/img/Default_pfp.svg.png";
import { Button } from "@nextui-org/react";
import { logOut } from "../api/user";
import { useSocket } from "../context/socketContext";



export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket()
  const handleLogout = async() => {
    let clearCookie = await logOut()
    console.log(clearCookie);
    
    dispatch(userLogout());
    localStorage.removeItem('token')
    socket!.disconnect()
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className=" mx-auto px-4 sm:px-4 lg:px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex-shrink-0">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center  space-x-6">
            <NavLink to="/allRooms" className="hover:text-red-500 transition-colors duration-300" > Rooms</NavLink>
            <NavLink to="/addSpace"> AddRoom</NavLink>
            <NavLink to="/yourRooms">MyRooms</NavLink>
            <NavLink to="/myBookings">MyBookings</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {userInfo ? (
              <>
                <Button
                  radius="full"
                  onClick={handleLogout}
                  size="sm"
                  className="bg-gradient-to-r from-gray-600 to-red-600 text-white shadow-md "
                >
                  LogOut
                </Button>

                {/* Profile Icon */}
                <div className="flex items-center gap-1 ">
                <p className="font-thin">{userInfo.name}</p>
                <Link to="/profile">
                  <img
                    src={userInfo.profilePicture || defaultProfile} // fallback if profile picture is not available
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
                </div>
                
               
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-1.5 px-3 rounded transition duration-300 ease-in-out">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1.5 px-3 rounded transition duration-300 ease-in-out">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/allRooms"> Rooms</NavLink>
          <NavLink to="/addSpace"> Add Rooms</NavLink>
            <NavLink to="/yourRooms">My Rooms</NavLink>
            <NavLink to="/myBookings">Bookings</NavLink>
          </div>
          <div className="pt-2 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 space-x-2">
            {userInfo ? (
              <>
                <Button
                  radius="full"
                  onClick={handleLogout}
                  size="sm"
                  className="bg-gradient-to-r from-gray-600 to-red-600 text-white shadow-md "
                >
                  LogOut
                </Button>

                {/* Profile Icon */}
                <div className="flex items-center gap-1 ">
                <p className="font-thin">{userInfo.name}</p>
                <Link to="/profile">
                  <img
                    src={userInfo.profilePicture || defaultProfile} // fallback if profile picture is not available
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-1.5 px-3 rounded transition duration-300 ease-in-out">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1.5 px-3 rounded transition duration-300 ease-in-out">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }:any) {
  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-indigo-600 px-2 py-1 rounded text-sm font-medium transition duration-300 ease-in-out"
    >
      {children}
    </Link>
  );
}
