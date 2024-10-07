import { useEffect, useState } from "react";
import AllRoomsBanner from "../components/allRoomsBanner";
import { fetchAllRooms, fetchNearestRooms } from "../api/user";
import { Pagination } from "@nextui-org/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/roomLoadingAnimation.json";


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface Coordinates {
  lat: number;
  lng: number;
}

interface Room {
  _id: string;
  name: string;
  mobile: string;
  userId: string;
  maintenanceCharge: string;
  securityDeposit: string;
  gender: string;
  slots: number;
  roomType: string;
  noticePeriod: string;
  electricityCharge: string;
  location: string;
  description: string;
  coordinates: Coordinates;
  images: string[];
  additionalOptions: string[];
  isAproved: boolean;
}

function AllRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNear, setIsNear] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const limit = 3;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({
    roomType: [],
  });

  const roomTypes = [
    { value: "Room", label: "Room" },
    { value: "BedSpace", label: "BedSpace" },
    // You can add more room types if needed
  ];

  useEffect(() => {
    setIsLoading(true);

    const getRooms = async () => {
      try {
        const response = await fetchAllRooms(
          currentPage,
          limit,
          searchTerm,
          filters,
          sortBy
        );

        setRooms(response.rooms);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (isNear) {
      handleFindNearestRooms();
    } else {
      getRooms();
    }
  }, [currentPage, searchTerm, filters, sortBy]);

  const handleSearch = (roomName: string) => {
    setSearchTerm(roomName);
  };

  const handleSortChange = (value: any) => {
    setSortBy(value);
  };

  const handleCheckboxChange = (value: any) => {
    setFilters((prevFilters) => {
      // Check if the room type is already selected
      const currentIndex = prevFilters.roomType.indexOf(value);
      const newRoomType = [...prevFilters.roomType];

      // Add or remove the room type based on its current state
      if (currentIndex === -1) {
        newRoomType.push(value); // Add if not selected
      } else {
        newRoomType.splice(currentIndex, 1); // Remove if already selected
      }

      return {
        ...prevFilters,
        roomType: newRoomType,
      };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFindNearestRooms = async () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        setIsNear(true);
        const response = await fetchNearestRooms(
          latitude,
          longitude,
          limit,
          currentPage
        );
        console.log(response.rooms);
        console.log(response.totalPages);

        setRooms(response.rooms); // Update rooms to show nearest ones
        setTotalPages(response.totalPages);
        setIsLoading(false);
      });
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleDetails = (id: string) => {
    navigate(`/room-details/${id}`);
  };

  return (
    <div>
      <AllRoomsBanner
        handleFindNearestRooms={handleFindNearestRooms}
        handleSearch={handleSearch}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        roomTypes={roomTypes}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Lottie options={defaultOptions} height={350} width={350} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {rooms?.length === 0 ? (
            <p className="text-gray-500">You don't have any rooms yet.</p>
          ) : (
            <div className="space-y-6">
              {/* Iterate through each room */}
              {rooms?.map((room) => (
                <div
                  key={room._id}
                  className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[330px]"
                >
                  {/* Image section */}
                  <div className="sm:w-1/3 h-[330px] overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Room information section */}
                  <div className="sm:w-2/3 px-4 h-[330px]  py-2 flex flex-col justify-between space-y-4 ">
                    <div className="space-y-4">
                      {/* Room Name */}
                      <h2 className="text-xl font-bold text-gray-800">
                        {room.name}
                      </h2>

                      {/* Additional Options */}
                      <div className="flex flex-wrap gap-2">
                        {room?.additionalOptions?.map(
                          (feature: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full border border-yellow-300"
                            >
                              {feature}
                            </span>
                          )
                        )}
                      </div>

                      {/* Room Details in Grid Layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Mobile:
                          </span>{" "}
                          {room?.mobile}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Bed Spaces:
                          </span>{" "}
                          {room?.slots}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Maintenance:
                          </span>{" "}
                          ₹{room?.maintenanceCharge}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Deposit:
                          </span>{" "}
                          ₹{room?.securityDeposit}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Type:
                          </span>{" "}
                          {room?.roomType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Gender:
                          </span>{" "}
                          {room?.gender}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Notice:
                          </span>{" "}
                          {room?.noticePeriod} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Location:
                          </span>{" "}
                          {room?.location}
                        </p>
                      </div>

                      {/* Room Description */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                          Description:
                        </span>{" "}
                        {room?.description}
                      </p>
                    </div>

                    {/* Details Button */}
                    <div className="w-full flex  justify-end ">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
                        onClick={() => handleDetails(room?._id)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Section */}
          <div className="flex justify-center mt-8">
            <Pagination
              showShadow
              color="warning"
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRooms;
