import { Image, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaPhone, FaPhoneAlt, FaRegUser, FaUser } from "react-icons/fa";
import { setCredentials } from "../../redux/Slices/authSlice";
import defaultProfile from "../../assets/img/Default_pfp.svg.png";
import {  toast } from 'sonner'
import { IoMail } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { editUser } from "../../api/user";
// import { toast } from "react-toastify";

const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  
  
  const [user, setUser] = useState(userInfo);
  const dispatch = useDispatch();
  const [valErr, setValerr] = useState({
    nameErr: "",
    emailErr: "",
    phoneErr: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone } = user;
    if (!name || !email || !phone) {
      return "All fields are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    return null;
  };

  const handleSave = async (onClose: () => void) => {
    const validationError = {
      nameErr: "",
      emailErr: "",
      phoneErr: "",
    };

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
      let response = await editUser(user)
      if(response){
        dispatch(setCredentials(response));
        
        toast.success("Edit successfull")
      }
      onClose();
    }
  };

  return (
    <div className="w-full  flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-[450px]  h-[280px]  sm:p-4 bg-white rounded-xl shadow-lg mt-[60px] relative">
        <div className="w-[150px] h-[150px] flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full absolute -top-16 -left-6 shadow-xl overflow-hidden">
          <Image
            isZoomed
            width={150}
            height={150}
            alt="User Profile Picture"
            src={userInfo.image || defaultProfile} 
            className="object-cover"
          />

        </div>
        <div className="absolute top-[140px] left-4 text-center">
          <h2 className="font-bold text-lg text-gray-800">{userInfo.name}</h2>
        </div>

        <div className="absolute top-0 right-0 w-[260px] h-full p-6 rounded-r-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            User Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <FaUser size={18} className="text-blue-500 mr-2" />
              <p className="text-sm text-gray-600">{userInfo.name}</p>
            </div>
            <div className="flex items-center">
              <IoMail size={18} className="text-blue-500 mr-2" />
              <p className="text-sm text-gray-600">{userInfo.email}</p>
            </div>
            <div className="flex items-center">
              <FaPhone size={18} className="text-blue-500 mr-2" />
              <p className="text-sm text-gray-600">{userInfo.number}</p>
            </div>
            <Button
              onPress={onOpen}
              color="primary"
              size="sm"
              className="mt-2 w-full"
            >
              Edit
            </Button>
            <Modal
              size="sm"
              backdrop="blur"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Edit Profile
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        endContent={
                          <FaRegUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        variant="bordered"
                      />
                      {valErr.nameErr && (
                        <p className="text-red-500 text-xs ">
                          {valErr.nameErr}
                        </p>
                      )}

                      <Input
                        autoFocus
                        endContent={
                          <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        variant="bordered"
                      />
                      {valErr.emailErr && (
                        <p className="text-red-500 text-xs ">
                          {valErr.emailErr}
                        </p>
                      )}

                      <Input
                        autoFocus
                        endContent={
                          <FaPhoneAlt className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="phone"
                        name="phone"
                        type="number"
                        value={user.phone}
                        onChange={handleInputChange}
                        variant="bordered"
                      />
                      {valErr.phoneErr && (
                        <p className="text-red-500 text-xs ">
                          {valErr.phoneErr}
                        </p>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
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
    </div>
  );
};

export default Profile;
