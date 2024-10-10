import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviews, fetchRoom } from "../../api/user";
import { Room } from "../../services/types";
import { Image, Rate, Drawer } from "antd";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the CSS
import { Button, Chip } from "@nextui-org/react";
import { MdOutlineMessage } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { IReview } from "../../services/types";
import { useDisclosure } from "@nextui-org/react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import CardCarousel from "../../components/cardCarousel";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";
import Chat from "../../components/chat";
import { FaMapMarkerAlt } from "react-icons/fa";
import BookingModal from "../../components/BookingModal";

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  width: string;
  height: string;
};

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
  const [viewPort, setViewPort] = useState<Viewport>({
    latitude: 0,
    longitude: 0,
    zoom: 13,
    width: "100%",
    height: "100%",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [open, setOpen] = useState(false);

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
          <div className="w-full   mt-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium p-2">Mobile:</span> {room.mobile}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium p-2">Bed Spaces:</span>{" "}
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
                <span className="font-medium p-2">Type:</span> {room.roomType}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium p-2">Gender:</span> {room.gender}
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
            {room.additionalOptions.map((feature: any) => (
              <Chip color="warning" size="sm" radius="sm" variant="bordered">
                {feature}
              </Chip>
            ))}
          </div>
        )}

        {/* Map section */}
        <div className="w-full h-[250px] mt-4 rounded-2xl overflow-hidden">
          <style>{bounceAnimation}</style>
          <ReactMapGL
            {...viewPort}
            mapboxAccessToken={token}
            mapStyle="mapbox://styles/murshidiqbal/cm0kk182d006q01o335mghxkh"
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
      <BookingModal isOpen={isOpen} onOpenChange={onOpenChange} room={room} />
    </div>
  );
}

export default RoomDetails;
