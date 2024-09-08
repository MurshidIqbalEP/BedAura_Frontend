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
import { FaPhoneAlt, FaUser, FaRegUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { setCredentials } from "../../redux/Slices/authSlice";
import { useState } from "react";
import { changePassword, editUser } from "../../api/user";
import { toast } from "sonner";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";

const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [user, setUser] = useState(userInfo);
  const [currentTab, setCurrentTab] = useState<"about" | "changePassword">(
    "about"
  ); // Tab state
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
    const { name, email, number } = user;
    if (!name || !email || !number) return "All fields are required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
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
      console.log(response);

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
    const [conform, setConform] = useState("");
    const [changepassErr, setChangepassErr] = useState({
      oldPasswordErr: "",
      newPasswordErr: "",
      conformErr: "",
    });

    const handlePasswordChange = async () => {
      console.log(oldPassword, newPassword, conform);

      const validationError = {
        oldPasswordErr: "",
        newPasswordErr: "",
        conformErr: "",
      };
      let valid = true;

      if (oldPassword.trim() === "" || oldPassword.length < 6) {
        validationError.oldPasswordErr = "6 digit number is required.";
        valid = false;
      }

      if (newPassword.trim() === "" || newPassword.length < 6) {
        validationError.newPasswordErr = "6 digit number is required.";
        valid = false;
      }
      if (conform !== newPassword ) {
        validationError.conformErr = "Wrong conform password!";
        valid = false;
      }
      setChangepassErr(validationError)

      if (valid) {
        let response = await changePassword(oldPassword, newPassword , userInfo.email);
        // console.log(response);

        // if (response) {
        //   toast.success(response.data);
        // }
      }

      
    };
    return (
      <div className="flex  justify-center min-h-screen ">
        <div className="bg-white mt-[30px] p-6 rounded-lg shadow-lg w-full h-fit max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-4">
            Change Password
          </h2>
          <div className="space-y-3">
            <Input
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              variant="bordered"
            />
            {changepassErr.oldPasswordErr && (
              <p className="text-red-500 text-xs mt-0">
                {changepassErr.oldPasswordErr}
              </p>
            )}
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="bordered"
            />
            {changepassErr.newPasswordErr && (
              <p className="text-red-500 text-xs mt-0">
                {changepassErr.newPasswordErr}
              </p>
            )}
            <Input
              label="Conform Password"
              type="password"
              value={conform}
              onChange={(e) => setConform(e.target.value)}
              variant="bordered"
            />
            {changepassErr.conformErr && (
              <p className="text-red-500 text-xs mt-0">{changepassErr.conformErr}</p>
            )}
            <Button onPress={handlePasswordChange} color="primary" fullWidth>
              Change Password
            </Button>
          </div>
        </div>
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
              currentTab === "changePassword" ? "bg-blue-500 text-white" : ""
            }`}
            onPress={() => setCurrentTab("changePassword")}
          >
            Change Password
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6 ">
        {currentTab === "about" ? (
          <div className="flex  justify-center min-h-screen ">
            <div className="bg-white mt-[30px]  p-6 rounded-lg h-[250px] shadow-lg space-y-6 w-full max-w-sm">
              <h2 className="text-2xl font-bold text-center">User Info</h2>
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
                            name="number"
                            type="number"
                            value={user.number}
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
        ) : (
          <ChangePassword />
        )}
      </main>
    </div>
  );
};

export default Profile;
