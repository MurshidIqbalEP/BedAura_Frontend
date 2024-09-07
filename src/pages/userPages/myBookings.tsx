import { useEffect, useState } from "react"
import { Room } from "../../services/types";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchBooking } from "../../api/user";
import {RoomData} from "../../services/types"

function myBookings() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);

  useEffect(()=>{
    const getBooking = async () => {
      try {
        const rooms = await fetchBooking(userId);
        console.log(rooms?.data);
        
        setRooms(rooms?.data)
        
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getBooking();   
  },[userId])

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {rooms.length === 0 ? (
        <p className="text-gray-500">You don't have any rooms yet.</p>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div
              className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[300px]"
            >
              <div className="sm:w-1/3">
                <img
                  src={room.roomId.images[0]}
                  alt={room.roomName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{room.roomName}</h2>
                      <p className="text-sm text-gray-600">{room.roomId.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {room.roomId.roomType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Slots Booked</p>
                      <p className="mt-1 text-lg font-semibold">{room.slots}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Maintenance</p>
                      <p className="mt-1 text-lg font-semibold">₹{room.roomId.maintenanceCharge}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Security Deposit</p>
                      <p className="mt-1 text-lg font-semibold">₹{room.roomId.securityDeposit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notice Period</p>
                      <p className="mt-1 text-lg font-semibold">{room.roomId.noticePeriod} days</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-600">{room.roomId.mobile}</p>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">₹{room.amount}</p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default myBookings
