import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookRoom, fetchReviews, fetchRoom } from "../../api/user";
import { Room } from "../../services/types";
import { Image, Rate, Drawer } from "antd";
import ReactMapGL, { Marker, ViewportProps } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the CSS
import { Button, Chip } from "@nextui-org/react";
import { MdOutlineMessage } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { IReview } from "../../services/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";
import StripeCheckout from "react-stripe-checkout";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import CardCarousel from "../../components/cardCarousel";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";
import Chat from "../../components/chat";
import { FaMapMarkerAlt } from "react-icons/fa";

// Keyframes for bounce animation
const bounceAnimation = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: 0,
    longitude: 0,
    zoom: 13,
    width: "100%",
    height: "100%",
  });
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;
  const [bookingSlots, setBookingSlots] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [open, setOpen] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [validationMessage, setValidationMessage] = useState("");
  const [isSlotAvailable, setIsSlotAvailable] = useState(true);

  const handleCheckInTime = (time: any) => {
    setCheckInTime(time);
  };

  const handleCheckOutTime = (time: any) => {
    setCheckOutTime(time);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomResponse = await fetchRoom(id as string);
      const fetchedRoom = roomResponse.data;

      setRoom(fetchedRoom);

      if (
        fetchedRoom.coordinates &&
        Array.isArray(fetchedRoom.coordinates.coordinates)
      ) {
        const [longitude, latitude] = fetchedRoom.coordinates.coordinates;
        setViewPort((prev: any) => ({
          ...prev,
          latitude,
          longitude,
        }));
      }
    };

    const fetchReview = async () => {
      const reviews = await fetchReviews(id as string);
      console.log(reviews?.data.reviews);
      setReviews(reviews?.data.reviews);
    };

    fetchRoomData();
    fetchReview();
  }, [id]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleBookingSlots = (value: string) => {
    const slotValue = Number(value);
    if (isNaN(slotValue) || slotValue > (room?.slots || 0) || slotValue <= 0) {
      toast.error("Slot exceeded");
      setBookingSlots(0);
      setAmount(0);
      return;
    }
    setBookingSlots(slotValue);
    let amt: number = (Number(room?.securityDeposit) || 0) * slotValue;
    setAmount(amt);
  };

  const onToken = async (token: any) => {
    // console.log(token);
    // console.log(room?._id,userInfo._id,bookingSlots);

    let booked = await bookRoom(
      token,
      room?._id as string,
      userInfo._id,
      bookingSlots
    );
    if (booked) {
      navigate("/myBookings");
      toast.success("Room Booked");
    }
  };

  // Function to validate the dates
  const validateDates = () => {
    const now = new Date();
    const checkInDate = new Date(checkInTime);
    const checkOutDate = new Date(checkOutTime);

    if (!checkInTime || !checkOutTime) {
      setValidationMessage("Both check-in and check-out dates are required.");
      return false;
    }

    if (checkInDate < now) {
      setValidationMessage("Check-in date cannot be in the past.");
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setValidationMessage("Check-out date must be after check-in date.");
      return false;
    }

    setValidationMessage(""); // Reset validation message
    onOpenChange();
    return true;
  };

  return (
    <div className="w-full h-full flex  flex-col justify-center  bg-gray-200 items-center">
      {/* Parent container with column layout */}
      <div className="w-[80%] m-[30px] p-9 rounded-2xl bg-white flex flex-col items-center space-y-4">
        {/* Image section */}
        <h1 className="text-2xl font-mono font-bold mb-2">{room?.name}</h1>
        <div className="flex flex-col sm:flex-row justify-center gap-6 ">
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {room?.images.map((imageSrc, index) => (
              <Image
                width={180}
                height={180}
                key={index}
                src={imageSrc}
                className="rounded-2xl object-cover transition-transform transform hover:scale-105"
                loading="lazy" // Optimize loading
              />
            ))}
          </Image.PreviewGroup>
        </div>

        {/* Room details section */}
        {room && (
          <div className="w-full mt-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium p-2">Mobile:</span> {room.mobile}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium p-2">Slots:</span> {room.slots}
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
        
          <div className="flex flex-wrap gap-2">
            {room.additionalOptions.map((feature: any) => (
              <span
                key={feature}
                className="border border-yellow-400 text-yellow-600 px-3 py-1 rounded-sm text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>        
        )}

        {/* Map section */}
        <div className="w-full h-[250px] mt-4 rounded-2xl overflow-hidden">
          <style>{bounceAnimation}</style>
          <ReactMapGL
            {...viewPort}
            mapboxAccessToken={token}
            mapStyle="mapbox://styles/murshidiqbal/cm0kk182d006q01o335mghxkh"
            onViewportChange={(newViewPort: ViewportProps) =>
              setViewPort(newViewPort)
            } // ensure viewport change is handled
          >
            <Marker
              latitude={viewPort.latitude}
              longitude={viewPort.longitude}
              anchor="bottom"
            >
              <div
                style={{
                  color: "red",
                  fontSize: "2rem",
                  animation: "bounce 2s infinite",
                }}
              >
                <FaMapMarkerAlt />
              </div>
            </Marker>
          </ReactMapGL>
        </div>
        <div className="flex  gap-2">
          <Button
            color="primary"
            size="sm"
            variant="bordered"
            onClick={showDrawer}
          >
            <MdOutlineMessage />
            Chat
          </Button>
          <Button onPress={onOpen} color="primary" size="sm" variant="bordered">
            <CiBookmarkCheck />
            Book
          </Button>

          <Drawer title="Chat" onClose={onClose} open={open}>
            {room?.userId ? (
              <Chat
                currentUserId={userInfo._id}
                chattingWithUserId={room?.userId}
              />
            ) : (
              <p>Loading chat...</p>
            )}
          </Drawer>

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 pb-4">
                Book Your Slot on {room?.name}
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Slots
                    </p>
                    <p className="text-sm text-gray-600">{room?.slots}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Deposit
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹ {room?.securityDeposit}
                    </p>
                  </div>
                </div>

                <div className="my-4">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Enter number of slots to book:
                  </label>
                  <input
                    type="number"
                    value={bookingSlots || ""}
                    onChange={(e) => handleBookingSlots(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Check-in time input */}
                <div className="my-4">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Check-in Date:
                  </label>
                  <input
                    type="date"
                    value={checkInTime || ""}
                    onChange={(e) => handleCheckInTime(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Check-out time input */}
                <div className="my-4">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Check-out Date:
                  </label>
                  <input
                    type="date"
                    value={checkOutTime || ""}
                    onChange={(e) => handleCheckOutTime(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {/* Validation Message */}
                {validationMessage && (
                  <p className="text-sm  p-2 rounded-md bg-red-500  text-white">
                    {validationMessage}
                  </p>
                )}
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Total Amount
                  </p>
                  <p className="text-lg text-gray-700">₹ {amount}</p>
                </div>
              </ModalBody>

              <ModalFooter>
                {amount && (
                  <Button
                    onPress={() => {
                      validateDates();
                    }}
                    size="sm"
                    className="bg-transparent"
                  >
                    <StripeCheckout
                      token={onToken}
                      amount={amount * 100}
                      currency="INR"
                      stripeKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
                    />
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        {reviews!.length <= 2 ? (
          <div className="text-center flex p-4">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="max-w-[400px] min-w-[340px] min-h-[180px] m-2 shadow-xl"
              >
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      className="bg-black"
                      src={userInfo.profilePicture || defaultProfile}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {review.userId.name}
                      </h4>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>Rating: {review.rating} / 5</p>
                  <p>{review.review}</p>
                </CardBody>
                <CardFooter className="gap-3"></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <CardCarousel reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomDetails;
