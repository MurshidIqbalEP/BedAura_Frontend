import React, { useState } from "react";
import { bookRoom, checkBookingValid } from "../api/user";
import StripeCheckout from "react-stripe-checkout";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const MultiStepForm = ({ closeModal, room }: any) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    numberOfSlots: 0,
    checkInDate: "",
    checkOutDate: "",
    amount: 0,
  });
  const navigate = useNavigate()

  const [formErr, setFormErr] = useState({
    numberOfSlotsErr: "",
    checkInDateErr: "",
    checkOutDateErr: "",
    amountErr: "",
  });

  const nextStep = async () => {
  
    
    let valid = true;
    let newErrors = { ...formErr };

    // Validate Check-In and Check-Out dates
    if (!formData.checkInDate) {
      newErrors.checkInDateErr = "Select a Check-In Date!";
      valid = false;
    } else {
      newErrors.checkInDateErr = "";
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDateErr = "Select a Check-Out Date!";
      valid = false;
    } else {
      newErrors.checkOutDateErr = "";
    }

    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      newErrors.checkInDateErr = "Check-In date cannot be a past date!";
      valid = false;
    }

    if (checkInDate > checkOutDate) {
      newErrors.checkOutDateErr =
        "Check-Out date cannot be before Check-In date!";
      valid = false;
    }


    setFormErr(newErrors);
    if (!valid) return;
    
    
    let checkDateValid  = await checkBookingValid(
      room._id,
      checkInDate,
      checkOutDate
    );

    
    if (checkDateValid.result) {
      setFormData((prevState) => ({
        ...prevState,
        amount:  room.deposit,
      }));

      setStep(step + 1);
    }else{
        toast.message("A booking already exists for this date. Please choose another date to continue.")
        
    } 
  };

  const prevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "numberOfSlots") {
      const slotValue = Number(value);
      if (slotValue > 0 && slotValue <= room?.slots) {
        setFormData({ ...formData, [name.toString()]: slotValue });
      }
    } else {
      // Handle other input changes
      setFormData({ ...formData, [name]: value });
    }
  };

  const onToken = async (token: any) => {
    // console.log(token);
    // console.log(room?._id,userInfo._id,bookingSlots);

    let booked = await bookRoom(
      token,
      room?._id as string,
      userInfo._id,
      formData
    );
    if (booked) {
        navigate("/myBookings");
      toast.success("Room Booked");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg ">
        {step === 1 && (
          <Step1
            nextStep={nextStep}
            handleChange={handleChange}
            room={room}
            values={formData}
            Errs={formErr}
          />
        )}
        {step === 2 && (
          <Step2
            prevStep={prevStep}
            room={room}
            closeModal={closeModal}
            onToken={onToken}
            values={formData}
          />
        )}
      </div>
    </div>
  );
};

const Step1 = ({ nextStep, handleChange, values, room, Errs }: any) => (
  <div className="flex flex-col gap-6 p-6 bg-white  rounded-lg w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Booking Information
    </h2>

    {/* Grid for Available Slots and Deposit */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-gray-500 font-semibold mb-1">
          Available Beds
        </p>
        <p className="text-lg text-gray-700 font-medium">{room?.slots}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-semibold mb-1">Deposit</p>
        <p className="text-lg text-gray-700 font-medium">
          ₹ {room?.securityDeposit}
        </p>
      </div>
    </div>

    {/* Number of Slots to Book */}
    {/* <div>
      <label
        htmlFor="numberOfSlots"
        className="block text-sm font-semibold text-gray-600 mb-2"
      >
        Enter number of slots to book:
      </label>
      <input
        type="number"
        value={values.numberOfSlots}
        onChange={handleChange}
        name="numberOfSlots"
        className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out"
        placeholder="Enter slots"
      />
      {Errs.numberOfSlotsErr && (
        <p className="text-sm text-red-500">{Errs.numberOfSlotsErr}</p>
      )}
    </div> */}

    {/* Check-in Date */}

    
    <div>
      <label
        htmlFor="checkInDate"
        className="block text-sm font-semibold text-gray-600 mb-2"
      >
        Check-in Date:
      </label>
      <input
        type="date"
        value={values.checkInDate}
        onChange={handleChange}
        name="checkInDate"
        className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out"
      />
      {Errs.checkInDateErr && (
        <p className="text-sm text-red-500">{Errs.checkInDateErr}</p>
      )}
    </div>

    {/* Check-out Date */}
    <div>
      <label
        htmlFor="checkOutDate"
        className="block text-sm font-semibold text-gray-600 mb-2"
      >
        Check-out Date:
      </label>
      <input
        type="date"
        value={values.checkOutDate}
        onChange={handleChange}
        name="checkOutDate"
        className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out"
      />
      {Errs.checkOutDateErr && (
        <p className="text-sm text-red-500">{Errs.checkOutDateErr}</p>
      )}
    </div>

    {/* Next Button */}
    <button
      type="button"
      onClick={nextStep}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      Next
    </button>
  </div>
);

const Step2 = ({ prevStep, onToken, values, room, closeModal }: any) => {

  return (
    <div className="flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Payment Methods
      </h2>

      <div className="bg-gray-300 p-4 rounded-lg shadow-sm mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Booking Summary</h3>
        <p className="text-lg font-bold text-gray-800">
          Amount: ₹
          {(room.securityDeposit).toLocaleString()}
        </p>
        {/* <p className="text-lg text-gray-600">Slots: {values.numberOfSlots}</p> */}
        <p className="text-lg text-gray-600">Check-In: {values.checkInDate}</p>
        <p className="text-lg text-gray-600">
          Check-Out: {values.checkOutDate}
        </p>
      </div>

      <div className="flex justify-around mt-4">
        <button
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Back
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200">
          Pay with Wallet
        </button>

        {/* Stripe Checkout component */}
        <Button
          onPress={() => {
            closeModal();
          }}
          size="sm"
          className="bg-transparent"
        >
          <StripeCheckout
            token={onToken} // Call handleToken instead of onToken
            amount={ room.securityDeposit * 100}
            currency="INR"
            stripeKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
          />
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
