import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { fetchRooms } from "../api/user";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

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
  isAproved: boolean;
}

function yourRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);
  const SERVER_URL = "http://localhost:3000";

  useEffect(() => {
    const getRooms = async () => {
      try {
        const rooms = await fetchRooms(userId);

        setRooms(rooms.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Rooms</h1>
      {rooms.length === 0 ? (
        <p className="text-gray-500">You don't have any rooms yet.</p>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[300px]"
            >
              <div className="sm:w-1/3">
                <img
                  src={`${SERVER_URL}/uploads/${room.images[0]}`}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:w-2/3 p-4 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
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
                      <span className="font-medium p-2">Maintenance:</span> ₹
                      {room.maintenanceCharge}
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
                <div className="flex justify-between items-center mt-4">
                  <div className="w-full flex justify-end  ">
                    <Link to={`/editRoom/${room._id}`}>
                      <Button
                        size="md"
                        className="ml-auto mr-1 bg-custom-yellow"
                      >
                        Edit
                      </Button>
                    </Link>
                  </div>

                  {room.isAproved === false && (
                    <Button color="primary" isLoading>
                    Not Approved
                  </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default yourRooms;
