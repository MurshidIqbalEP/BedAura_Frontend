import { Input, Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { addRoom } from "../api/user";
import { fetchOptions } from "../api/admin";
import imageCompression from "browser-image-compression";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/loading.json";
import { Progress } from "@nextui-org/react";
import { Popconfirm } from "antd";

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

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface Options {
  securityDeposit: string[];
  genders: string[];
  roomType: string[];
  noticePeriod: string[];
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drsh8bkaf/upload";
const CLOUDINARY_UPLOAD_PRESET = "BedAura";

function AddSpace() {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.userInfo);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [maintenanceCharge, setMaintenanceCharge] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [gender, setGender] = useState("");
  const [type, setType] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [slots, setSlots] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File[]>([]);
  const [imgCount, setImgCount] = useState(3);
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
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
  const [isLoading, setLoading] = useState(false);
  const [filledFields, setFilledFields] = useState(0);
  const totalFields = 11; // Total number of input fields, including the file input
  const progress = Math.round((filledFields / totalFields) * 100);
  type ProgressFields = {
    name: boolean;
    mobile: boolean;
    maintenanceCharge: boolean;
    securityDeposit: boolean;
    gender: boolean;
    type: boolean;
    noticePeriod: boolean;
    slots: boolean;
    location: boolean;
    description: boolean;
    image: boolean;
  };
  const [progressFilled, setProgressFilled] = useState<ProgressFields>({
    name: false,
    mobile: false,
    maintenanceCharge: false,
    securityDeposit: false,
    gender: false,
    type: false,
    noticePeriod: false,
    slots: false,
    location: false,
    description: false,
    image: false,
  });

  // Error state management
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    maintenanceCharge: "",
    securityDeposit: "",
    gender: "",
    type: "",
    noticePeriod: "",
    slots: "",
    location: "",
    description: "",
    image: "",
  });

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
    const fetchOptionsData = async () => {
      const response = await fetchOptions();
      setOptions(response.data);
    };

    fetchOptionsData();
  }, []);

  useEffect(() => {
    const savedFormData = localStorage.getItem("addRoomFormData");

    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      console.log(formData);

      setName(formData.name);
      setMobile(formData.mobile);
      setMaintenanceCharge(formData.maintenanceCharge);
      setSecurityDeposit(formData.securityDeposit);
      setGender(formData.gender);
      setType(formData.type);
      setNoticePeriod(formData.noticePeriod);
      setSlots(formData.slots);
      setLocation(formData.location);
      setDescription(formData.description);
      setUploadedImageURLs(formData.images);
      setImgCount(0);
    }

    localStorage.removeItem("addRoomFormData");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > imgCount) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: `You can only upload up to ${imgCount} images.`,
      }));
      return;
    }

    setImage((prevImages) => [...prevImages, ...selectedFiles]);
    setImgCount(imgCount - selectedFiles.length);
    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));

    console.log(imgCount);

    if (imgCount == 3) {
      handleFieldFill("image");
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      name: "",
      mobile: "",
      maintenanceCharge: "",
      securityDeposit: "",
      gender: "",
      type: "",
      noticePeriod: "",
      slots: "",
      location: "",
      description: "",
      image: "",
    };

    // Name validation
    if (name.trim() === "") {
      newErrors.name = "Please Enter Name ";
      valid = false;
    }

    // Mobile number validation
    if (mobile.length < 10) {
      newErrors.mobile = "10 digit number Required";
      valid = false;
    }

    // Maintenance charge validation
    if (maintenanceCharge.trim() === "") {
      newErrors.maintenanceCharge = "Maintenance charge required";
      valid = false;
    }

    // Security deposit validation
    if (securityDeposit.trim() === "") {
      newErrors.securityDeposit = "Security deposit required";
      valid = false;
    }

    // Gender validation
    if (gender.trim() === "") {
      newErrors.gender = "Gender required";
      valid = false;
    }

    // Room type validation
    if (type.trim() === "") {
      newErrors.type = "Room type required";
      valid = false;
    }

    // Notice period validation
    if (noticePeriod.trim() === "") {
      newErrors.noticePeriod = "Notice period required";
      valid = false;
    }

    // Slots validation
    if (slots.trim() === "" || Number(slots) <= 0) {
      newErrors.slots = "Enter available slots";
      valid = false;
    }

    // Location validation
    if (location.trim() === "" || !selectedLocation) {
      newErrors.location = "Select location";
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
        newErrors.location = "Invalid location coordinates";
        valid = false;
      }
    }

    // Description validation
    if (description.trim() === "") {
      newErrors.description = "Enter description";
      valid = false;
    }

    // Image validation
    if (image.length !== 3) {
      newErrors.image = ` add ${imgCount}  more images`;
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      const uploadedURLs = await Promise.all(image.map(uploadToCloudinary));
      console.log(uploadedURLs);

      setUploadedImageURLs(uploadedURLs);
      setLoading(false);

      if (!userId) {
        const formDataObject = {
          name,
          mobile,
          maintenanceCharge,
          securityDeposit,
          gender,
          roomType: type,
          noticePeriod,
          slots,
          location,
          description,
          coordinates: selectedLocation ?? {},
          images: uploadedURLs,
        };

        localStorage.setItem("addRoomFormData", JSON.stringify(formDataObject));
        navigate("/login", { state: { from: "/addSpace" } });
        return;
      } else {
        console.log(userId, "user Data");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("userId", userId._id);
        formData.append("mobile", mobile);
        formData.append("maintenanceCharge", maintenanceCharge);
        formData.append("securityDeposit", securityDeposit);
        formData.append("gender", gender);
        formData.append("roomType", type);
        formData.append("noticePeriod", noticePeriod);
        formData.append("slots", slots);
        formData.append("location", location);
        formData.append("description", description);
        formData.append("coordinates", JSON.stringify(selectedLocation ?? {}));

        uploadedURLs.forEach((url) => {
          formData.append("images", url);
        });

        const response = await addRoom(formData);

        localStorage.removeItem("addRoomFormData");
        toast.success(response);
        navigate("/yourRooms");
      }
    }
  };

  const dltImage = (imgToDelete: any) => {
    setImage(image.filter((img) => img.name !== imgToDelete.name));
    setImgCount((prev) => prev + 1);
  };

  const handleFieldFill = (field: keyof ProgressFields) => {
    console.log(field);

    setProgressFilled((prev) => {
      if (prev[field]) {
        return prev;
      } else {
        const updatedProgressFilled = { ...prev, [field]: true };
        setFilledFields((prevCount) => prevCount + 1);
        return updatedProgressFilled;
      }
    });
  };

  return (
    <div className="bg-neutral-100 p-6 m-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Add Your Room/Space
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Three Input Fields in One Row */}
        <div className="flex flex-wrap gap-6 justify-center  ">
          <Progress
            aria-label="Add Post.."
            size="md"
            value={progress}
            color="success"
            showValueLabel={true}
            className="max-w-[80%] mb-1  "
          />
          {/* Name Field */}
          <div className="w-full md:w-1/4">
            <Input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleFieldFill("name");
              }}
              placeholder="Name"
              required
              variant="bordered"
              size="sm"
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mobile Field */}
          <div className="w-full md:w-1/4">
            <Input
              type="number"
              name="mobile"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                handleFieldFill("mobile");
              }}
              placeholder="Mobile"
              variant="bordered"
              required
              size="sm"
              className="w-full"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Maintenance Charge Field */}
          <div className="w-full md:w-1/4">
            <Input
              type="number"
              name="maintenanceCharge"
              value={maintenanceCharge}
              onChange={(e) => {
                setMaintenanceCharge(e.target.value),
                  handleFieldFill("maintenanceCharge");
              }}
              placeholder="Maintenance Charge"
              variant="bordered"
              required
              size="sm"
              className="w-full"
            />
            {errors.maintenanceCharge && (
              <p className="text-red-500 text-xs mt-1">
                {errors.maintenanceCharge}
              </p>
            )}
          </div>
        </div>

        {/* Select Inputs in Another Row */}
        <div className="flex flex-wrap gap-6 justify-center ">
          {/* Security Deposit Field */}
          <div className="w-full md:w-1/4">
            <Select
              placeholder="Select Security Deposit"
              aria-label="Security Deposit"
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setSecurityDeposit(e.target.value),
                  handleFieldFill("securityDeposit");
              }}
              className="w-full"
            >
              {options.securityDeposit.map((deposit) => (
                <SelectItem key={deposit} value={deposit}>
                  {deposit}
                </SelectItem>
              ))}
            </Select>
            {errors.securityDeposit && (
              <p className="text-red-500 text-xs mt-1">
                {errors.securityDeposit}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div className="w-full md:w-1/4">
            <Select
              placeholder="Select Gender"
              aria-label="Preferable Gender"
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setGender(e.target.value), handleFieldFill("gender");
              }}
              className="w-full"
            >
              {options.genders.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen}
                </SelectItem>
              ))}
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Room Type Field */}
          <div className="w-full md:w-1/4">
            <Select
              placeholder="Select Room Type"
              aria-label="Room Type"
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setType(e.target.value), handleFieldFill("type");
              }}
              className="w-full"
            >
              {options.roomType.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </Select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Another Row for Inputs */}
        <div className="flex flex-wrap gap-6 justify-center ">
          {/* Notice Period Field */}
          <div className="w-full md:w-1/4">
            <Select
              placeholder="Select Notice Period"
              aria-label="Notice Period"
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setNoticePeriod(e.target.value),
                  handleFieldFill("noticePeriod");
              }}
              className="w-full"
            >
              {options.noticePeriod.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </Select>
            {errors.noticePeriod && (
              <p className="text-red-500 text-xs mt-1">{errors.noticePeriod}</p>
            )}
          </div>

          {/* Available Slots Field */}
          <div className="w-full md:w-1/4">
            <Input
              type="number"
              name="slots"
              value={slots}
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setSlots(e.target.value), handleFieldFill("slots");
              }}
              placeholder="Available Slots"
              required
              className="w-full"
            />
            {errors.slots && (
              <p className="text-red-500 text-xs mt-1">{errors.slots}</p>
            )}
          </div>

          {/* Location Field */}
          <div className="w-full md:w-1/4 relative" ref={wrapperRef}>
            <Input
              type="text"
              name="location"
              value={location}
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setLocation(e.target.value), handleFieldFill("location");
              }}
              placeholder="Location"
              required
              className="w-full"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
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

        {/* Description Field */}
        <div>
          <Textarea
            name="description"
            value={description}
            size="sm"
            variant="bordered"
            onChange={(e) => {
              setDescription(e.target.value), handleFieldFill("description");
            }}
            placeholder="Description"
            required
            className="w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image Previews */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8">
            {uploadedImageURLs.length > 0
              ? uploadedImageURLs.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="flex items-center relative justify-center max-w-[200px]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-fit sm:h-40 md:h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))
              : image.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center relative justify-center max-w-[200px]"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-fit sm:h-40 md:h-48 object-cover rounded-lg shadow-md"
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this image?"
                      onConfirm={() => dltImage(img)}
                      
                    >
                      <button className="absolute top-0 right-0 p-1 rounded-md bg-black">
                        <MdDeleteOutline className="text-white" />
                      </button>
                    </Popconfirm>
                  </div>
                ))}
          </div>
        </div>

        {/* Image Upload Field */}
        {(image.length < 3 || uploadedImageURLs.length < 3) && (
          <div className="mt-4">
            <Input
              type="file"
              accept="image/*"
              multiple
              size="sm"
              variant="bordered"
              onChange={handleImageChange}
              required
              className="bg-gray-100 border-2 border-dashed border-gray-300  rounded-md p-3 text-center text-sm w-full"
              description={`Click or drag ${imgCount} images to upload`}
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        {isLoading ? (
          <div className="flex justify-center items-center h-[100px]">
            <Lottie options={defaultOptions} height={150} width={150} />
          </div>
        ) : (
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
  );
}

export default AddSpace;
