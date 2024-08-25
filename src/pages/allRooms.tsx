import React, { useEffect, useState } from "react";
import AllRoomsBanner from "../components/allRoomsBanner";
import { fetchAllRooms } from "../api/user"; // Update this function to handle pagination
import { Button } from "antd";
import { Pagination } from "@nextui-org/react";

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

function AllRooms() {
  const SERVER_URL = "http://localhost:3000";
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 1; // Number of items per page

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await fetchAllRooms(currentPage, limit);
        setRooms(response.rooms);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <AllRoomsBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {rooms.length === 0 ? (
          <p className="text-gray-500">You don't have any rooms yet.</p>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => (
             <div
             key={room._id}
             className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-64"
           >
             <div className="sm:w-1/3 h-full overflow-hidden"> {/* Added 'overflow-hidden' here */}
               <img
                 src={`${SERVER_URL}/uploads/${room.images[0]}`}
                 alt={room.name}
                 className="w-full h-full object-cover"  // Ensures the image fits within the div
               />
             </div>
             <div className="sm:w-2/3 p-4 flex flex-col justify-between h-full">
               <div>
                 <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                 <div className="grid grid-cols-2 gap-2 mb-3">
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Mobile:</span> {room.mobile}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Slots:</span> {room.slots}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Maintenance:</span> ₹{room.maintenanceCharge}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Deposit:</span> ₹{room.securityDeposit}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Type:</span> {room.roomType}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Gender:</span> {room.gender}
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Notice:</span> {room.noticePeriod} days
                   </p>
                   <p className="text-sm text-gray-600">
                     <span className="font-medium p-2">Location:</span> {room.location}
                   </p>
                 </div>
                 <p className="text-sm text-gray-600 mb-3">
                   <span className="font-medium p-2">Description:</span> {room.description}
                 </p>
               </div>
           
               <div className="w-full flex justify-end">
                 <Button className="bg-blue-700 text-white">Details</Button>
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
    </div>
  );
}

export default AllRooms;
