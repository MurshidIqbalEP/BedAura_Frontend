import { Input } from "@nextui-org/react";
import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verify_Forgetotp } from "../api/user";
import { resend_otp } from "../api/user";

type LocationState = {
  email: string;
};

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = (location.state as LocationState) || {};
  const [showResendLink, setShowResendLink] = useState(false);
  const [counter, setCounter] = useState(120); // 2 minutes in seconds
  // @ts-ignore
  const [resetCount, setResetCount] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    const linkTimer = setTimeout(() => {
      setShowResendLink(true);
      clearInterval(timer);
    }, 2 * 60 * 1000);

    // Cleanup the timers if the component is unmounted
    return () => {
      clearInterval(timer);
      clearTimeout(linkTimer);
    };
  }, [resetCount]);

  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const [errMsg, setErrMsg] = useState<string>("");

  const handleOtpChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValues = [...otpValues];
    newValues[index] = event.target.value;
    setOtpValues(newValues);
  };

  const verifyOtp = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let otp = otpValues.join("");

    if (otp.length < 4) {
      setErrMsg("Enter Your OTP");
    }
    if (email && otp.length === 4) {
      try {
        const response = await verify_Forgetotp(otp, email);

        if (response) {
          toast.success(response.data);
          setTimeout(() => {
            navigate("/change-Pass", { state: { email } });
          }, 1000);
        }
      } catch (error) {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  };

  const resendOtp = async () => {
    try {
      toast.info("Resending OTP...");

      const response = await resend_otp(email);

      if (response) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(
        "An error occurred while resending the OTP. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-200 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          OTP Verification
        </h2>
        <p className="mt-2 text-gray-500 text-center">
          Please enter the OTP sent to your email.
        </p>

        <p className="mt-2 text-custom-red text-center text-sm">
          {errMsg && errMsg}
        </p>

        <form className="mt-6 space-y-4">
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((_, index) => (
              <Input
                key={index}
                className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={1}
                onChange={(e) => handleOtpChange(e, index)}
                inputMode="numeric"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-custom-red text-white rounded-lg py-2 font-medium hover:bg-red-600 transition duration-300"
            onClick={verifyOtp}
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {!showResendLink ? (
            <>
              Resend OTP in {Math.floor(counter / 60)}:
              {String(counter % 60).padStart(2, "0")}{" "}
              <span>(waiting for {counter} seconds...)</span>
            </>
          ) : (
            <>
              Didn't receive the code?{" "}
              <span
                className="text-custom-red hover:underline"
                onClick={resendOtp}
              >
                Resend OTP
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
