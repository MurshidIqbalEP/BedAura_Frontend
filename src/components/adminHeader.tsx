import Logo from "../assets/img/white.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link to="/admin" className="flex-shrink-0">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// function NavLink({ to, children }) {
//   return (
//     <Link
//       to={to}
//       className="text-gray-700 hover:text-indigo-600 px-2 py-1 rounded text-sm font-medium transition duration-300 ease-in-out"
//     >
//       {children}
//     </Link>
//   );
// }
