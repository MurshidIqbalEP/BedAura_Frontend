import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from "../assets/img/Black.png";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-5 ">
      <div className="max-w-fit mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <img src={Logo} alt="Logo" className="h-[110px]" />
            <p className="text-center md:text-left text-sm">
              BedAura is your go-to platform for affordable room and bed space
              rentals. Connect with the perfect living arrangements tailored to
              your needs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition duration-300"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/myBookings"
                  className="hover:text-white transition duration-300"
                >
                  Booking
                </Link>
              </li>
              <li>
                <Link
                  to="/allrooms"
                  className="hover:text-white transition duration-300"
                >
                  All Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/addSpace"
                  className="hover:text-white transition duration-300"
                >
                  Add Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2024 BedAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
