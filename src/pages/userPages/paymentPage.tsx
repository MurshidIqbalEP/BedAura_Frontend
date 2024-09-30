import Stepper from "../../components/stepper"
import BookingInfo from "../../components/bookingInfo"
import PaymentMethods from "../../components/paymentMethods"
import { useState } from "react"
function paymentPage() {
    const [currentStep,setCurrentStep] = useState(1)
    const steps = [
        "Booking Info",
        "Payment Method"
    ]

    const displayStep = (step:any)=>{
      switch(step){
        case 1:
            return <BookingInfo />
        case 2:
            return <PaymentMethods />
        default :
        return <BookingInfo />
      }
    }
  return (
    <div className=" md:w-1/2 mx-auto shadow-xl rounded-lg pb-2 bg-white ">
        <div className=" container horizontal mt-5">
        <Stepper steps={steps} currentStep={currentStep} />
        </div>
      
      <button className=" bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out"  >
        Next
      </button>

    </div>
  )
}

export default paymentPage
