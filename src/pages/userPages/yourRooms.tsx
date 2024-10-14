import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchRooms } from "../../api/user";
import { Button, Chip } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import Lottie from "react-lottie";
import noDataAnimation from "../../assets/noDataAnimation - 1728317098368.json";
import { motion } from "framer-motion"; // Importing motion

interface Coordinates {
  lat: number;
  lng: number;
}

const defaultOptionsForNoData = {
  loop: true,
  autoplay: true,
  animationData: noDataAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

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
  isApproved: boolean;
  isEdited: boolean;
  rejectionReason: string;
}

function YourRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Rooms</h1>
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <Lottie options={defaultOptionsForNoData} height={250} width={250} />
          <p className="text-gray-500 text-xl font-semibold animate-fade-in text-center">
            You don’t have any rooms yet.
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {rooms.map((room) => (
            <motion.div
              key={room._id}
              className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[340px]"
              variants={containerVariants} // Use the same variants for individual rooms
              initial="hidden"
              animate="visible"
            >
              <div className="sm:w-1/3">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:w-2/3 p-2 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                  <div className="flex gap-4 mb-2">
                    {room.additionalOptions.map(
                      (feature: any, index: number) => (
                        <Chip
                          key={index} // Add a unique key for each chip
                          color="warning"
                          size="sm"
                          radius="sm"
                          variant="bordered"
                        >
                          {feature}
                        </Chip>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium p-2">Mobile:</span>{" "}
                      {room.mobile}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium p-2">BedSpaces:</span>{" "}
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
                  <div className="w-full flex justify-end">
                    <Button
                      as={Link}
                      to={`/editRoom/${room._id}`}
                      size="md"
                      className="ml-auto mr-1 bg-custom-yellow"
                    >
                      Edit
                    </Button>
                  </div>
                  {room?.rejectionReason && (
                    <Tooltip
                      title={
                        <div className="p-4 rounded-md shadow-xl">
                          <p className="font-bold mb-1">Rejection Reason</p>
                          <p className="text-sm">{room?.rejectionReason}</p>
                          <div className="mt-3 border-t border-gray-300 pt-2">
                            <p className="text-xs text-gray-500">
                              For more details, contact support.
                            </p>
                          </div>
                        </div>
                      }
                    >
                      <Button color="danger">Rejected</Button>
                    </Tooltip>
                  )}
                  {!room?.rejectionReason &&
                  (room?.isApproved === false || room?.isEdited === true) ? (
                    <Button color="primary" isLoading>
                      Not Approved
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default YourRooms;
