import { useEffect, useState } from "react";

import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { cancelBooking, fetchBooking, postReview } from "../../api/user";
import { RoomData } from "../../services/types";
import { Button } from "@nextui-org/react";
import { TbStarsFilled } from "react-icons/tb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { RiStarSFill } from "react-icons/ri";
import TextArea from "antd/es/input/TextArea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MdFreeCancellation } from "react-icons/md";
import Lottie from "react-lottie";
import noDataAnimation from "../../assets/noDataAnimation - 1728317098368.json"
import { motion } from "framer-motion"; // Importing motion

 // Animation variants
 const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const defaultOptionsForNoData = {
  loop: true,
  autoplay: true,
  animationData: noDataAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};


function myBookings() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<RoomData | undefined>(
    undefined
  );
  const [selectedStars, setSelectedStars] = useState(0);
  const [selectedHoveredStars, setSelectedHoveredStars] = useState(0);
  const [review, setReview] = useState("");
  const [errVal, setErrVal] = useState({
    rateErr: "",
    reviewErr: "",
  });

  const navigate = useNavigate()

  useEffect(() => {
    const getBooking = async () => {
      try {
        const rooms = await fetchBooking(userId);
        console.log(rooms?.data);

        setRooms(rooms?.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getBooking();
  }, [userId]);

  const handleReviewSubmit = async () => {
    const val = {
      rateErr: "",
      reviewErr: "",
    };
    let valid = true;
    if (!selectedStars) {
      val.rateErr = "Please select a rating.";
      valid = false;
    }

    if (review.trim() == "") {
      val.reviewErr = "Enter Review.";
      valid = false;
    }

    setErrVal(val);

    if (valid) {
      const response = await postReview(
        selectedRoom!.roomId._id,
        userId,
        selectedStars,
        review
      );
      navigate(-1)
      toast.success(response?.data)
      
    }
  };

   const handleCancellBooking = async(room:RoomData)=>{
      console.log(room);
      
      const response = await cancelBooking(room)
      toast.message(response?.data)
      navigate("/profile")
   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {rooms.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <Lottie 
        options={defaultOptionsForNoData} 
        height={250} 
        width={250} 
        
      />
      <p className="text-gray-500 text-xl font-semibold animate-fade-in text-center">
        You don’t have any Booking yet.
      </p>
    </div>
        
      ) : (
        <motion.div className="space-y-6"
        initial="hidden"
          animate="visible"
          variants={containerVariants}>
          {rooms.map((room) => (
            <motion.div className="bg-blue-100 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row h-[300px]" variants={containerVariants} // Use the same variants for individual rooms
            initial="hidden"
            animate="visible">
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
                    <h2 className="text-xl font-semibold text-gray-900">
                      {room.roomName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {room.roomId.location}
                    </p>
                    
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {room.roomId.roomType}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Bed Spaces
                    </p>
                    <p className="mt-1 text-lg font-semibold">{room.roomId.slots}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Maintenance
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      ₹{room.roomId.maintenanceCharge}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Security Deposit
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      ₹{room.roomId.securityDeposit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Notice Period
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {room.roomId.noticePeriod} days
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {room.roomId.mobile}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    ₹{room.amount}
                  </p>
                </div>
                <div className="w-full mt-1 flex justify-end gap-1 items-end">
                  <Button
                    size="sm"
                    className="bg-lime-300"
                    endContent={<TbStarsFilled />}
                    onClick={() => {
                      setSelectedRoom(room);
                      onOpen();
                    }}
                  >
                    Rate Room
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-300"
                    endContent={<MdFreeCancellation />}
                    onClick={() => {
                      handleCancellBooking(room)
                      
                    }}
                  >
                    Cancel Booking 
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="xs"
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{`Rate ${selectedRoom?.roomName}`}</ModalHeader>
              <ModalBody>
                <h1>{}</h1>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setSelectedStars(index + 1)}
                      className={`cursor-pointer ${
                        index < selectedStars
                          ? "text-yellow-500"
                          : "text-gray-400"
                      } || ${
                        index < selectedHoveredStars
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      onMouseEnter={() => setSelectedHoveredStars(index + 1)}
                      onMouseLeave={() => setSelectedHoveredStars(0)}
                    >
                      <RiStarSFill size={40} />
                    </span>
                  ))}
                </div>
                {errVal.rateErr && (
                  <p className="text-red-600 text-sm">{errVal.rateErr}</p>
                )}

                {/* Review input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Write Review
                  </label>

                  <TextArea
                    rows={4}
                    placeholder="Write your experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    maxLength={150}
                  />
                  {errVal.reviewErr && (
                    <p className="text-red-600 text-sm">{errVal.reviewErr}</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button size="sm" color="primary" onClick={handleReviewSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default myBookings;
