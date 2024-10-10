import Img from "../../assets/img/loging-bg.png";
import Logo from "../../assets/img/white.png";
import { Input } from "@nextui-org/react";
import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { changePass } from "../../api/user";
import { toast } from "react-toastify";

type LocationState = {
  email: string;
};

export default function Login() {
  const [password, setPassword] = useState("");
  const [conformPass, setConformPass] = useState("");
  const [errors, setErrors] = useState({ password: "", conformPass: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = (location.state as LocationState) || {};

  const validateForm = () => {
    let valid = true;
    let tempErrors = { password: "", conformPass: "" };

    if (!password || password.trim() === "" || password.length < 6) {
      tempErrors.password = "Invalid Password";
      valid = false;
    }

    if (conformPass !== password) {
      tempErrors.password = "Conform password is not Correct";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let response = await changePass(email, password);

      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-200 rounded-md">
      <div className="flex w-[900px] max-w-screen-sm h-[400px]">
        <div className="w-1/2 bg-white p-4 rounded-tl-lg flex flex-col rounded-bl-lg items-center shadow-2xl">
          <img className="p-5 pb-0" src={Logo} alt="logo" />
          <p className="font-mono font-light text-slate-500 text-xs">
            Please enter your Email
          </p>
          <form
            className="flex flex-col w-full justify-center mt-1 items-center md:flex-nowrap mb-0 md:mb-0 gap-1"
            onSubmit={handleSubmit}
          >
            <Input
              type="password"
              label="Password"
              labelPlacement="outside"
              className="w-[250px]"
              size="sm"
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-xs font-mono font-light text-red-500 text-left w-[250px]">
                {errors.password}
              </p>
            )}

            <Input
              type="password"
              label="Conform Password"
              labelPlacement="outside"
              className="w-[250px]"
              size="sm"
              variant="bordered"
              onChange={(e) => setConformPass(e.target.value)}
            />
            {errors.conformPass && (
              <p className="text-xs font-mono font-light text-red-500 text-left w-[250px]">
                {errors.conformPass}
              </p>
            )}

            <button
              type="submit" // Use type="submit" here
              className="bg-custom-red w-[250px] mt-4 rounded-lg font-poppins text-sm text-white h-8"
            >
              Change Password
            </button>
          </form>
          <p className="text-xs mt-2 text-gray-400">
            Back to?{" "}
            <Link to="/register">
              <span className="text-custom-red hover:text-gray-400">
                Sign up!
              </span>
            </Link>
          </p>
        </div>
        <div className="w-1/2">
          <img
            className="h-full rounded-tr-lg rounded-br-lg"
            src={Img}
            alt="background"
          />
        </div>
      </div>
    </div>
  );
}
