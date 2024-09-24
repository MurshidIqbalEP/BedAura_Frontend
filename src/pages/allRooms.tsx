import { useEffect, useState } from "react";
import AllRoomsBanner from "../components/allRoomsBanner";
import { fetchAllRooms, fetchNearestRooms } from "../api/user";
import { Button } from "antd";
import { Pagination } from "@nextui-org/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/roomLoadingAnimation.json";
import { Chip } from "@nextui-org/react";

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
  additionalOptions:string[];
  isAproved: boolean;
}

function AllRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNear, setIsNear] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const limit = 1;

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await fetchAllRooms(currentPage, limit);
        console.log(response.rooms);
        
        setRooms(response.rooms);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (isNear) {
      handleFindNearestRooms();
    } else {
      getRooms();
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFindNearestRooms = async () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        console.log(latitude, "latitude", longitude, "longitude");
        setIsNear(true);
        const response = await fetchNearestRooms(
          latitude,
          longitude,
          limit,
          currentPage
        );

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
      <AllRoomsBanner handleFindNearestRooms={handleFindNearestRooms} />

      {isLoading ? (
        <div className="flex justify-center h-[300px]">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {rooms.length === 0 ? (
            <p className="text-gray-500">You don't have any rooms yet.</p>
          ) : (
            <div className="space-y-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-72"
                >
                  <div className="sm:w-1/3 h-72 overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:w-2/3 overflow-hidden px-4 flex flex-col justify-between ">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        {room.name}
                      </h2>
                      <div className="flex gap-4 mb-2">
                        {room.additionalOptions.map((feature:any)=>(
                             <Chip
                             color="warning"
                             size="sm"
                             radius="sm"
                             variant="bordered"
                           >
                           {feature}
                           </Chip>
                        ))}
                        
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Mobile:</span>{" "}
                          {room.mobile}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Slots:</span>{" "}
                          {room.slots}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Maintenance:</span>{" "}
                          ₹{room.maintenanceCharge}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Deposit:</span> ₹
                          {room.securityDeposit}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Type:</span>{" "}
                          {room.roomType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Gender:</span>{" "}
                          {room.gender}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Notice:</span>{" "}
                          {room.noticePeriod} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium p-2">Location:</span>{" "}
                          {room.location}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium p-2">Description:</span>{" "}
                        {room.description}
                      </p>
                    </div>

                    <div className="w-full flex justify-end">
                      <Button
                        className="bg-blue-700 text-white"
                        onClick={() => handleDetails(room._id)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Pagination
              showShadow
              color="warning"
              total={totalPages}
              initialPage={1}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRooms;
