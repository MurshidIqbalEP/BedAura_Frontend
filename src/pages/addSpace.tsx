import { Input, Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useState, FormEvent, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { addRoom } from "../api/user";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const RoomType = [
  { key: "BedSpace", label: "BedSpace" },
  { key: "Room", label: "Room" },
];

const Gender = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Both", label: "Both" },
];

const SecurityDeposit = [
  { key: "1000", label: "1000" },
  { key: "2000", label: "2000" },
  { key: "4000", label: "4000" },
];

const NoticePeriod = [
  { key: "15 Days", label: "15 Days" },
  { key: "20 Days", label: "20 Days" },
  { key: "30 Days", label: "30 Days" },
];

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

function AddSpace() {

  
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);
  const navigate = useNavigate();
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

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

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

    if (selectedFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    setImage(selectedFiles);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let valid = true;

    // Name validation
    if (name.trim() === "") {
      toast.error("Name required");
      valid = false;
    }

    // Mobile number validation
    if (mobile.length < 10) {
      toast.error("10 digit number needed");
      valid = false;
    }

    // Maintenance charge validation
    if (maintenanceCharge.trim() === "") {
      toast.error("Maintenance charge required");
      valid = false;
    }

    // Security deposit validation
    if (securityDeposit.trim() === "") {
      toast.error("Security deposit required");
      valid = false;
    }

    // Gender validation
    if (gender.trim() === "") {
      toast.error("Gender required");
      valid = false;
    }

    // Room type validation
    if (type.trim() === "") {
      toast.error("Room type required");
      valid = false;
    }

    // Notice period validation
    if (noticePeriod.trim() === "") {
      toast.error("Notice period required");
      valid = false;
    }

    if (slots.trim() === "" || Number(slots) <= 0) {
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
    if (description.trim() === "") {
      toast.error("Enter description");
      valid = false;
    }

    // Image validation
    if (image.length !== 3) {
      toast.error("3 images required");
      valid = false;
    }

    // Set errors and check validity

    if (valid) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", userId);
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

      image.forEach((img) => {
        formData.append("images", img);
      });

      let response = await addRoom(formData);

      if (response) {
        toast.success(response.message);
        navigate("/yourRooms");
      }
    }
  };

  return (
    <div className="bg-white p-6 m-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Add Your Room/Space
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            variant="bordered"
            size="sm"
          />

          <Input
            type="tel"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile"
            variant="bordered"
            required
            size="sm"
          />

          <Input
            type="number"
            name="maintenanceCharge"
            value={maintenanceCharge}
            onChange={(e) => setMaintenanceCharge(e.target.value)}
            placeholder="Maintenance Charge"
            variant="bordered"
            required
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            placeholder="Select Security Deposit"
            aria-label="Security Deposit"
            size="sm"
            variant="bordered"
            onChange={(e) => setSecurityDeposit(e.target.value)}
          >
            {SecurityDeposit.map((deposit) => (
              <SelectItem key={deposit.key} value={deposit.key}>
                {deposit.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Select Gender"
            aria-label="Preferable Gender"
            size="sm"
            variant="bordered"
            onChange={(e) => setGender(e.target.value)}
          >
            {Gender.map((gen) => (
              <SelectItem key={gen.key} value={gen.key}>
                {gen.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Select Room Type"
            aria-label="Room Type"
            size="sm"
            variant="bordered"
            onChange={(e) => setType(e.target.value)}
          >
            {RoomType.map((room) => (
              <SelectItem key={room.key} value={room.key}>
                {room.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            placeholder="Select Notice Period"
            aria-label="Notice Period"
            size="sm"
            variant="bordered"
            onChange={(e) => setNoticePeriod(e.target.value)}
          >
            {NoticePeriod.map((period) => (
              <SelectItem key={period.key} value={period.key}>
                {period.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="number"
            name="slots"
            value={slots}
            size="sm"
            variant="bordered"
            onChange={(e) => setSlots(e.target.value)}
            placeholder="Available Slots"
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
              placeholder="Location"
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
          value={description}
          size="sm"
          variant="bordered"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />

        <div className="mt-4">
          <Input
            type="file"
            accept="image/*"
            multiple
            size="sm"
            variant="bordered"
            onChange={handleImageChange}
            required
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-3 text-center text-sm"
            description="Click or drag images to upload"
          />
        </div>

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
      </form>
    </div>
  );
}

export default AddSpace;
