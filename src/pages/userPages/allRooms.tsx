import { useEffect, useState } from "react";
import AllRoomsBanner from "../../components/allRoomsBanner";
import { fetchAllRooms, fetchNearestRooms } from "../../api/user";
import { Pagination } from "@nextui-org/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import loadingAnimation from "../../assets/roomLoadingAnimation.json";
import noDataAnimation from "../../assets/noDataAnimation - 1728317098368.json";
import { motion, AnimatePresence } from "framer-motion";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptionsForNoData = {
  loop: true,
  autoplay: true,
  animationData: noDataAnimation,
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
        setIsLoading(false);
      }
    };

    if (isNear) {
      handleFindNearestRooms();
    } else {
      getRooms();
    }
  }, [currentPage, searchTerm, filters, sortBy, isNear]);

  const handleSearch = (roomName: string) => {
    setSearchTerm(roomName);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (value: string) => {
    setFilters((prevFilters) => {
      const currentIndex = prevFilters.roomType.indexOf(value);
      const newRoomType = [...prevFilters.roomType];

      if (currentIndex === -1) {
        newRoomType.push(value);
      } else {
        newRoomType.splice(currentIndex, 1);
      }

      return {
        ...prevFilters,
        roomType: newRoomType,
      };
    });
    setCurrentPage(1);
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
        try {
          const response = await fetchNearestRooms(
            latitude,
            longitude,
            limit,
            currentPage
          );
          setRooms(response.rooms);
          setTotalPages(response.totalPages);
        } catch (error) {
          console.error("Error fetching nearest rooms:", error);
          toast.error("Failed to fetch nearest rooms.");
        } finally {
          setIsLoading(false);
        }
      }, () => {
        toast.error("Unable to get your location.");
        setIsLoading(false);
      });
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const handleDetails = (id: string) => {
    navigate(`/room-details/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const roomCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AllRoomsBanner
        handleFindNearestRooms={handleFindNearestRooms}
        handleSearch={handleSearch}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        roomTypes={roomTypes}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
      />

      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="loading"
          >
            <Lottie options={defaultOptions} height={350} width={350} />
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="content"
          >
            {rooms.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <Lottie 
                  options={defaultOptionsForNoData} 
                  height={250} 
                  width={250} 
                />
                <motion.p 
                  className="text-gray-500 text-xl font-semibold text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  You don't have any rooms yet.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    variants={roomCardVariants}
                    className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[330px]"
                  >
                    <div className="sm:w-1/3 h-[330px] overflow-hidden">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:w-2/3 px-4 h-[330px] py-2 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">
                          {room.name}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {room.additionalOptions?.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full border border-yellow-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Mobile:</span> {room.mobile}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Bed Spaces:</span> {room.slots}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Maintenance:</span> ₹{room.maintenanceCharge}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Deposit:</span> ₹{room.securityDeposit}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Type:</span> {room.roomType}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Gender:</span> {room.gender}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Notice:</span> {room.noticePeriod} days
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Location:</span> {room.location}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Description:</span> {room.description}
                        </p>
                      </div>
                      <div className="w-full flex justify-end">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
                          onClick={() => handleDetails(room._id)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Pagination
                showShadow
                color="warning"
                total={totalPages}
                initialPage={currentPage}
                onChange={handlePageChange}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AllRooms;