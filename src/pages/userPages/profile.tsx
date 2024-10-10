import {
  Image,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import { setCredentials } from "../../redux/Slices/authSlice";
import { useState } from "react";
import { editUser } from "../../api/user";
import { toast } from "sonner";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";

import ChangePassword from "../userPages/changePassword";
import Wallet from "../userPages/wallet";
import ChatPage from "../../components/chatPage";
import Dashbord from "../../components/dashbord";

const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const dispatch = useDispatch();
  const [user, setUser] = useState(userInfo);

  const [currentTab, setCurrentTab] = useState<
    "about" | "changePassword" | "wallet" | "chat" | "dashbord"
  >("about"); // Tab state
  const [valErr, setValerr] = useState({
    nameErr: "",
    emailErr: "",
    phoneErr: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (onClose: () => void) => {
    const validationError = { nameErr: "", emailErr: "", phoneErr: "" };
    let valid = true;
    const { name, email, number } = user;

    if (name.trim() === "") {
      validationError.nameErr = "Name required";
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationError.emailErr = "Invalid email format.";
      valid = false;
    }
    if (number.length < 10) {
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      {/* Aside Navigation */}
      <aside className="w-1/4 p-4 min-h-screen bg-white shadow-md">
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
        <nav className="mt-8 space-y-4 ">
          <Button
            className={`w-full ${
              currentTab === "about" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("about")}
          >
            About
          </Button>
          <Button
            className={`w-full ${
              currentTab === "dashbord" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("dashbord")}
          >
            Dashbord
          </Button>
          <Button
            className={`w-full ${
              currentTab === "changePassword" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("changePassword")}
          >
            Change Password
          </Button>
          <Button
            className={`w-full ${
              currentTab === "wallet" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("wallet")}
          >
            Wallet
          </Button>
          <Button
            className={`w-full ${
              currentTab === "chat" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("chat")}
          >
            Chat
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full  p-6 ">
        {currentTab === "about" ? (
          <div className="flex  justify-center min-h-screen ">
            <div className="bg-white mt-[30px]  p-6 rounded-lg h-[250px] shadow-lg space-y-6 w-full max-w-sm">
              <h2 className="text-2xl font-bold text-center">User Info</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser size={18} className="text-blue-500 mr-2" />
                  <p className="text-sm text-gray-600">{user.name}</p>
                </div>
                <div className="flex items-center">
                  <IoMail size={18} className="text-blue-500 mr-2" />
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex items-center">
                  <FaPhoneAlt size={18} className="text-blue-500 mr-2" />

                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
                <Button onPress={onOpen} color="primary">
                  Edit Profile
                </Button>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  placement="top-center"
                >
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
                            <p className="text-red-500 text-xs">
                              {valErr.nameErr}
                            </p>
                          )}
                          <Input
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            variant="bordered"
                          />
                          {valErr.emailErr && (
                            <p className="text-red-500 text-xs">
                              {valErr.emailErr}
                            </p>
                          )}
                          <Input
                            label="Number"
                            name="phone"
                            type="number"
                            value={user.phone}
                            onChange={handleInputChange}
                            variant="bordered"
                          />
                          {valErr.phoneErr && (
                            <p className="text-red-500 text-xs">
                              {valErr.phoneErr}
                            </p>
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onPress={() => handleSave(onClose)}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>
          </div>
        ) : currentTab === "changePassword" ? (
          <ChangePassword />
        ) : currentTab === "chat" ? (
          <ChatPage currentUserId={user._id} />
        ) : currentTab === "wallet" ? (
          <Wallet />
        ) : (
          <Dashbord />
        )}
      </main>
    </div>
  );
};

export default Profile;
