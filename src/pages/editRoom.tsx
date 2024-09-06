import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { editRoomApi, fetchRoom } from "../api/user";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { fetchOptions } from "../api/admin";
import uploadToCloudinary from "../services/cloudinary";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/loading.json"

interface Coordinates {
  lat: number;
  lng: number;
}

interface Room {
  _id: string;
  name: string;
  mobile: string;
  maintenanceCharge: string;
  securityDeposit: string;
  gender: string;
  userId: string;
  slots: string;
  roomType: string;
  noticePeriod: string;
  electricityCharge: string;
  location: string;
  description: string;
  coordinates: Coordinates;
  images: string[];
  isAproved: boolean;
}


const fetchSuggestions = async (query: string) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;
    const response = await axios.get(url);

    if (response.data && response.data.features) {
      console.log("Mapbox response data:", response.data.features);
      return response.data.features;
    } else {
      console.error("No features found in response:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

interface Options {
  securityDeposit: string[];
  genders: string[];
  roomType: string[];
  noticePeriod: string[];
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function editRoom() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room>();
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [imgCount, setImgCount] = useState(0);
  const [options, setOptions] = useState<Options>({
    securityDeposit: [],
    genders: [],
    roomType: [],
    noticePeriod: [],
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [isLoading,setLoading] = useState(false)

  useEffect(() => {
    if (location) {
      fetchSuggestions(location)
        .then((data) => {
          setSuggestions(data);
          setIsOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const getRoom = async () => {
      try {
        const room = await fetchRoom(id as string);
        setRoom(room.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRoom();
  }, [id]);

  useEffect(() => {
    const fetchOptionsData = async () => {
      const response = await fetchOptions();
      setOptions(response.data);
    };

    fetchOptionsData();
  }, []);

  const handleSelect = (suggestion: any) => {
    setSelectedLocation({
      lat: suggestion.center[1],
      lng: suggestion.center[0],
    });
    setLocation(suggestion.place_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > imgCount) {
      toast.error(`select ${imgCount} images`);
      return;
    }
    setLoading(true)
    const uploadedURLs = await Promise.all(
      selectedFiles.map((file) => uploadToCloudinary(file))
    );
    console.log(uploadedURLs);
    setLoading(false)
    
    setRoom((prevRoom:any) => ({
      ...prevRoom,
      images: [...prevRoom.images, ...uploadedURLs], // Append new URLs to existing images
    }));

    setImgCount((prev)=> prev-uploadedURLs.length)
    
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("submiteddddddddddddddd");

    let valid = true;

    // Name validation
    if (room?.name.trim() === "") {
      toast.error("enter name");
      return;
    }

    // Mobile number validation
    if (room?.mobile && room.mobile.length < 10) {
      toast.error("10 digit number needed");
      valid = false;
    }

    // Maintenance charge validation
    if (room?.maintenanceCharge.trim() === "") {
      toast.error("Maintenance charge required");
      valid = false;
    }

    // Security deposit validation
    if (room?.securityDeposit.trim() === "") {
      toast.error("Security deposit required");
      valid = false;
    }

    // Gender validation
    if (room?.gender.trim() === "") {
      toast.error("Gender required");
      valid = false;
    }

    // Room type validation
    if (room?.roomType.trim() === "") {
      toast.error("Room type required");
      valid = false;
    }

    // Notice period validation
    if (room?.noticePeriod.trim() === "") {
      toast.error("Notice period required");
      valid = false;
    }

    if (!room?.slots || Number(room?.slots) <= 0) {
      toast.error(" Enter Available Slots");
      valid = false;
    }

    // Location validation
    if (location.trim() === "" || !selectedLocation) {
      toast.error("Select location");
      valid = false;
    } else if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        toast.error("Invalid location coordinates");
        valid = false;
      }
    }

    // Description validation
    if (room?.description.trim() === "") {
      toast.error("Enter description");
      valid = false;
    }

    // Image validation
    if (room?.images.length !== 3 ) {
      let msg = `${imgCount} expected`;
      toast.error(msg);
      valid = false;
    }

    if (valid) {
      const formData = new FormData();
      formData.append("name", room?.name as string);
      formData.append("mobile", room?.mobile as string);
      formData.append("maintenanceCharge", room?.maintenanceCharge as string);
      formData.append("securityDeposit", room?.securityDeposit as string);
      formData.append("gender", room?.gender as string);
      formData.append("roomType", room?.roomType as string);
      formData.append("noticePeriod", room?.noticePeriod as string);
      formData.append("slots", room?.slots as string);
      formData.append("location", location);
      formData.append("description", room?.description as string);
      formData.append("coordinates", JSON.stringify(selectedLocation ?? {}));
      formData.append("roomId", room?._id as string);
      formData.append("userId", room?.userId as string);

     

      room?.images.forEach((url) => {
        formData.append("images", url);  
      });


      let response = await editRoomApi(formData);

      if (response) {
        toast.success(response.message);
        navigate("/yourRooms");
      }
    }
  };

  const dltImage = (img: string) => {
    let newImages: any = room?.images.filter((image) => image !== img);

    console.log(newImages);

    setRoom((prevRoom) => {
      if (!prevRoom) return prevRoom;

      return {
        ...prevRoom,
        images: newImages,
      };
    });

    setImgCount(3 - (room?.images?.length ?? 0) + 1);
  };

  return (
    <div>
      <div className="bg-neutral-100 p-6 m-6 rounded-md shadow-inner  max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Edit Your Room/Space
        </h2>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              name="name"
              value={room?.name}
              onChange={(e) =>
                setRoom({ ...room, name: e.target.value } as Room)
              }
              required
              variant="bordered"
              size="sm"
            />
            <Input
              type="tel"
              name={room?.mobile}
              value={room?.mobile}
              onChange={(e) =>
                setRoom({ ...room, mobile: e.target.value } as Room)
              }
              variant="bordered"
              required
              size="sm"
            />
            <Input
              type="number"
              name="maintenanceCharge"
              value={room?.maintenanceCharge}
              onChange={(e) =>
                setRoom({ ...room, maintenanceCharge: e.target.value } as Room)
              }
              variant="bordered"
              required
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              placeholder={room?.securityDeposit}
              aria-label="Security Deposit"
              size="sm"
              variant="bordered"
              onChange={(e) =>
                setRoom({ ...room, securityDeposit: e.target.value } as Room)
              }
            >
             {options.securityDeposit.map((deposit) => (
                <SelectItem key={deposit} value={deposit}>
                  {deposit}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder={room?.gender}
              aria-label="Preferable Gender"
              size="sm"
              variant="bordered"
              onChange={(e) =>
                setRoom({ ...room, gender: e.target.value } as Room)
              }
            >
              {options.genders.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder={room?.roomType}
              aria-label="Room Type"
              size="sm"
              variant="bordered"
              onChange={(e) =>
                setRoom({ ...room, roomType: e.target.value } as Room)
              }
            >
               {options.roomType.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              placeholder={room?.noticePeriod}
              aria-label="Notice Period"
              size="sm"
              variant="bordered"
              onChange={(e) =>
                setRoom({ ...room, noticePeriod: e.target.value } as Room)
              }
            >
              {options.noticePeriod.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              name="slots"
              value={room?.slots}
              size="sm"
              variant="bordered"
              onChange={(e) =>
                setRoom({ ...room, slots: e.target.value } as Room)
              }
              required
            />

            <div className="relative" ref={wrapperRef}>
              <Input
                type="text"
                name="location"
                value={location}
                size="sm"
                variant="bordered"
                onChange={(e) => setLocation(e.target.value)}
                placeholder={room?.location}
                required
              />

              {isOpen && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="font-medium">{suggestion.place_name}</div>
                      {suggestion.description && (
                        <div className="text-xs text-gray-500">
                          {suggestion.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Textarea
            name="description"
            value={room?.description}
            size="sm"
            variant="bordered"
            onChange={(e) =>
              setRoom({ ...room, description: e.target.value } as Room)
            }
            required
          />

          <div className="mt-4">
            {room?.images && room.images.length > 0 && (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 ">
                  {room.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center relative justify-center  max-w-[200px]"
                    >
                      <img
                        src={image}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-fit sm:h-40 md:h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        className="absolute top-0 right-0 p-1 rounded-md bg-black"
                        onClick={() => dltImage(image)}
                      >
                        <MdDeleteOutline className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {(room?.images?.length ?? 0) < 3 && (
            <div className="mt-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                size="sm"
                variant="bordered"
                onChange={handleImageChange}
                required
                className="bg-gray-100 border-2 border-dashed border-gray-300  rounded-md p-3 text-center text-sm"
              />
              <div className="mt-2 text-red-500 text-sm font-mono font-light">
                Add {imgCount} images
              </div>
            </div>
          )}

{isLoading ?(
            <div className="flex justify-center items-center h-[100px]">
           <Lottie options={defaultOptions} height={150} width={150} />
          </div>
        ):(
          <div className="mt-6 text-center">
          <Button
            type="submit"
            color="success"
            size="md"
            className="w-full"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        )}
        </form>
      </div>
    </div>
  );
}

export default editRoom;
