import { useState } from "react";
import BannerImage from "../assets/img/allRoomsBG.png";

interface AllRoomsBannerProps {
  handleFindNearestRooms: () => void;
  handleSearch: (name: string) => void;
  handleSortChange: (value: string) => void;
  handleCheckboxChange: (value: string) => void;
  sortBy: string;
  roomTypes: any;
  filters: any;
}

function AllRoomsBanner({
  handleFindNearestRooms,
  handleSearch,
  sortBy,
  handleSortChange,
  roomTypes,
  filters,
  handleCheckboxChange,
}: AllRoomsBannerProps) {
  const [name, setName] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={BannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center">
          Find Affordable Bedspace
        </h1>
        <div className="w-full max-w-md mb-6">
          <div className="flex">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search"
              className="w-full px-4 py-2 text-gray-700 bg-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-yellow-500 text-white px-6 py-2 rounded-r-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              onClick={() => name.trim().length && handleSearch(name)}
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleFindNearestRooms}
          >
            Find Nearest Room
          </button>

          <button
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter & Sort Section */}
        {showFilters && (
          <div className="bg-white shadow-lg rounded-lg mt-3 mx-auto max-w-5xl  z-10 p-3 lg:p-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="Security Deposit">Security Deposit</option>
                  <option value="slots">Slots</option>
                  <option value="Notice Period">Notice Period</option>
                </select>
              </div>
              <div className="w-full lg:w-1/2">
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </p>
                <div className="space-y-2">
                  {roomTypes.map((type: any) => (
                    <label
                      key={type.value}
                      className="inline-flex items-center mr-4"
                    >
                      <input
                        type="checkbox"
                        value={type.value}
                        checked={filters.roomType.includes(type.value)}
                        onChange={() => handleCheckboxChange(type.value)}
                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded"
                      />
                      <span className="ml-2 text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRoomsBanner;
