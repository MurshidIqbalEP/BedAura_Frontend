import Img from "../assets/img/loging-bg.png";
import Logo from "../assets/img/white.png";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {Link} from "react-router-dom"

export default function Login() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [err,SetErr] = useState({email:"",password:""})

  const submitLogin = async()=>{
    let validationErrors: {email:string,password:string} = {
      email: "",
      password: "",
    };
    let valid = true;

    if (email.trim() === "") {
      validationErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid.";
      valid = false;
    }

    if (password.trim() === "") {
      validationErrors.password = "Password is required.";
      valid = false;
    }else if(password.length < 4){
      validationErrors.password = " 4 Digit Password is required.";
      valid = false;
    }

    SetErr(validationErrors)

    if(valid){
      
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-200 rounded-md">
      {/* Centered div */}
      <div className="flex w-[900px] max-w-screen-sm h-[400px] ">
        <div className="w-1/2 bg-white p-4 rounded-tl-lg flex flex-col rounded-bl-lg items-center  shadow-2xl">
          <img className="p-5 pb-0" src={Logo} alt="logo" />

          <p className="font-mono font-light text-slate-500 text-xs">Please enter your details</p>

          <div className="flex flex-col w-full justify-center  mt-1 items-center md:flex-nowrap mb-0 md:mb-0 gap-1">
            <Input
              key="outside"
              type="email"
              label="Email"
              labelPlacement="outside"
              className="w-[250px]  "
              size="sm"
              variant="bordered"
              onChange={(e)=> setEmail(e.target.value)}
            />
            {err.email && <p className="text-xs font-mono font-light text-red-500 text-left w-[250px] ">{err.email}</p>}

           <Input
              key="outside"
              type="password"
              label="Password"
              labelPlacement="outside"
              className="w-[250px]  "
              size="sm"
              variant="bordered"
              onChange={(e)=> setPassword(e.target.value)}
            />
             {err.password && <p className="text-xs font-mono font-light  text-red-500 text-left w-[250px]">{err.password}</p>}

          </div>

          <button className="bg-custom-red w-[250px] mt-4 rounded-lg font-poppins text-sm  text-white h-8" onClick={submitLogin}> Sign in </button>

          <button className="bg-white w-[250px] mt-2 rounded-lg font-poppins text-sm  text-black h-8 border border-black flex items-center justify-center gap-2">
      <FcGoogle className="text-xl" />
      Sign in with Google
    </button>

    <p className="text-xs mt-2 text-gray-400">Don’t have an account? 
        <Link to='/register'>
        <span className="text-custom-red">Sign up fo free!</span>
        </Link>
        </p>



        </div>

        <div className="w-1/2">
          <img className="h-full rounded-tr-lg rounded-br-lg" src={Img} alt="background" />
        </div>
      </div>
    </div>
  );
}
