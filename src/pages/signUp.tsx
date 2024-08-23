import Img from "../assets/img/loging-bg.png";
import Logo from "../assets/img/white.png";
import { Input } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate,NavigateFunction } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGoogleLogin } from '@react-oauth/google';
import {sign_up} from "../api/user"
import {Gsign_up} from "../api/user"
import {  useDispatch } from 'react-redux';

import { setCredentials } from '../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import axios from "axios";
import { RootState } from "../redux/store";

type ErrorState = {
  name: string;
  email: string;
  password: string;
  repassword: string;
  number: string;
};

export default function SignUp() {

  const dispatch = useDispatch();
  const {userInfo }= useSelector((state:RootState) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      // If user is already logged in, redirect them to the homepage
      navigate('/');
    }
  }, []);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const [err, setErr] = useState<ErrorState>({
    name: "",
    email: "",
    password: "",
    repassword: "",
    number: "",
  });

  const navigate: NavigateFunction = useNavigate();



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationErrors: ErrorState = {
      name: "",
      email: "",
      password: "",
      repassword: "",
      number: "",
    };
    let valid = true;

    if (name.trim() === "") {
      validationErrors.name = "Name is required.";
      valid = false;
    }

    if (email.trim() === "") {
      validationErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid.";
      valid = false;
    }

    if (number.trim() === "") {
      validationErrors.number = "Number is required.";
      valid = false;
    } else if (!/^\d{10}$/.test(number)) {
      validationErrors.number = "Number is invalid.";
      valid = false;
    }

    if (password.trim() === "") {
      validationErrors.password = "Password is required.";
      valid = false;
    }

    if (repassword.trim() === "") {
      validationErrors.repassword = "Confirm Password is required.";
      valid = false;
    }

    if (password !== repassword) {
      validationErrors.repassword = "Passwords do not match.";
      valid = false;
    }

    setErr(validationErrors);

    if (valid) {
      try {

       const response = await sign_up(name,email,password,number)
        
       if (response) {
        toast.success(response.data.message);
        navigate("/Otp", {
          state: {
            email: email,
            name: name,
            password: password,
            number: number,
          },
        });
      }
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  const Glogin = useGoogleLogin({
    onSuccess: async(response) =>{
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
        );

      console.log(res);
      
        
        const name = res.data.name
        const email = res.data.email
        const  password = "qwerty123"
        const isGoogle = true

        const response2 = await Gsign_up(name,email,password,isGoogle);
  
        
        if (response2) {
          localStorage.setItem("token", response2.data.token);
          dispatch(setCredentials(response2.data.user));
          navigate("/");
        }
      } catch (error) {}
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-200 p-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 space-y-3 md:space-y-4">
            <img className="h-8 md:h-10 mx-auto md:mx-0" src={Logo} alt="logo" />

            <p className="text-center md:text-left text-xs md:text-sm text-gray-600">
              Please enter your details
            </p>

            <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Name"
                labelPlacement="outside"
                className="max-w-xs w-full mx-auto md:mx-0"
                size="sm"
                variant="bordered"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
              {err.name && <p className="text-xs text-red-500 ">{err.name}</p>}
              <Input
                type="email"
                label="Email"
                labelPlacement="outside"
                className="max-w-xs w-full mx-auto md:mx-0"
                size="sm"
                variant="bordered"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              {err.email && <p className="text-xs text-red-500 -mt-2">{err.email}</p>}
              <Input
                type="text"
                label="Number"
                labelPlacement="outside"
                className="max-w-xs w-full mx-auto md:mx-0"
                size="sm"
                variant="bordered"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)}
              />
              {err.number && <p className="text-xs text-red-500 -mt-2">{err.number}</p>}
              <Input
                type="password"
                label="Password"
                labelPlacement="outside"
                className="max-w-xs w-full mx-auto md:mx-0"
                size="sm"
                variant="bordered"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              {err.password && <p className="text-xs text-red-500 -mt-2">{err.password}</p>}
              <Input
                type="password"
                label="Confirm Password"
                labelPlacement="outside"
                className="max-w-xs w-full mx-auto md:mx-0"
                size="sm"
                variant="bordered"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRepassword(e.target.value)}
              />
              {err.repassword && <p className="text-xs text-red-500 -mt-2">{err.repassword}</p>}

              <button
                className="w-full max-w-xs mx-auto md:mx-0 bg-[#EA454C] text-white px-3 py-2 rounded-md text-xs md:text-sm"
                type="submit"
              >
                Create account
              </button>

              <div className="flex justify-center items-center gap-2">
                <p className="text-xs md:text-sm text-gray-500">
                  Already have an account?
                </p>
                <Link to="/login" className="text-xs md:text-sm text-[#EA454C] font-semibold">
                  Log in
                </Link>
              </div>
            </form>

            <div className="flex items-center justify-center">
              <div className="border-b w-10 border-gray-300"></div>
              <p className="text-xs md:text-sm text-gray-600 mx-2">Or</p>
              <div className="border-b w-10 border-gray-300"></div>
            </div>

            <button
              className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto md:mx-0 border border-gray-300 px-3 py-2 rounded-md text-xs md:text-sm"
              onClick={() => Glogin()}
            >
              <FcGoogle className="w-4 h-4" /> Sign up with Google
            </button>
          </div>
          <div className="hidden md:block md:w-1/2">
            <img className="h-full w-full object-cover" src={Img} alt="sign in background" />
          </div>
        </div>
      </div>
    </div>
  );
}
