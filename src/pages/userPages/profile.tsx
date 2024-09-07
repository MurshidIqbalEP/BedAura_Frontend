import { Image, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaPhoneAlt, FaUser, FaRegUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { setCredentials } from "../../redux/Slices/authSlice";
import { useState } from "react";
import { editUser } from "../../api/user";
import { toast } from "sonner";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";

const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [user, setUser] = useState(userInfo);
  const [currentTab, setCurrentTab] = useState<"about" | "changePassword">("about"); // Tab state
  const [valErr, setValerr] = useState({
    nameErr: "",
    emailErr: "",
    phoneErr: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone } = user;
    if (!name || !email || !phone) return "All fields are required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
  };

  const handleSave = async (onClose: () => void) => {
    const validationError = { nameErr: "", emailErr: "", phoneErr: "" };
    let valid = true;
    const { name, email, phone } = user;

    if (name.trim() === "") {
      validationError.nameErr = "Name required";
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationError.emailErr = "Invalid email format.";
      valid = false;
    }
    if (phone.length < 10) {
      validationError.phoneErr = "10 Digit is Required";
      valid = false;
    }

    setValerr(validationError);
    if (valid) {
      let response = await editUser(user);
      if (response) {
        dispatch(setCredentials(response));
        toast.success("Edit successful");
      }
      onClose();
    }
  };

  // Change Password Form (example)
  const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const handlePasswordChange = () => {
      // Handle password change logic here
      toast.success("Password changed successfully!");
    };
    return (
      <div className="space-y-4">
        <Input
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          variant="bordered"
        />
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="bordered"
        />
        <Button onPress={handlePasswordChange} color="primary">
          Change Password
        </Button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      {/* Aside Navigation */}
      <aside className="w-[210px] p-4 bg-white shadow-md">
      <div className="flex flex-col items-center justify-center text-center">
  <Image
    isZoomed
    width={150}
    height={150}
    alt="User Profile Picture"
    src={userInfo.image || defaultProfile}
    className="object-cover rounded-full"
  />
  <h2 className="font-bold text-lg mt-4">{userInfo.name}</h2>
</div>
        <nav className="mt-8 space-y-4">
          <Button
            className={`w-full ${currentTab === "about" ? "bg-blue-500" : ""}`}
            onPress={() => setCurrentTab("about")}
          >
            About
          </Button>
          <Button
            className={`w-full ${currentTab === "changePassword" ? "bg-blue-500" : ""}`}
            onPress={() => setCurrentTab("changePassword")}
          >
            Change Password
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-8 ">
        {currentTab === "about" ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Info</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser size={18} className="text-blue-500 mr-2" />
                <p className="text-sm text-gray-600">{userInfo.name}</p>
              </div>
              <div className="flex items-center">
                <IoMail size={18} className="text-blue-500 mr-2" />
                <p className="text-sm text-gray-600">{userInfo.email}</p>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt size={18} className="text-blue-500 mr-2" />
                <p className="text-sm text-gray-600">{userInfo.number}</p>
              </div>
              <Button onPress={onOpen} color="primary">
                Edit Profile
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>Edit Profile</ModalHeader>
                      <ModalBody>
                        <Input
                          label="Name"
                          name="name"
                          value={user.name}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                        {valErr.nameErr && (
                          <p className="text-red-500 text-xs">{valErr.nameErr}</p>
                        )}
                        <Input
                          label="Email"
                          name="email"
                          value={user.email}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                        {valErr.emailErr && (
                          <p className="text-red-500 text-xs">{valErr.emailErr}</p>
                        )}
                        <Input
                          label="Phone"
                          name="phone"
                          type="number"
                          value={user.phone}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                        {valErr.phoneErr && (
                          <p className="text-red-500 text-xs">{valErr.phoneErr}</p>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Close
                        </Button>
                        <Button color="primary" onPress={() => handleSave(onClose)}>
                          Save
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
        ) : (
          <ChangePassword />
        )}
      </main>
    </div>
  );
};

export default Profile;
