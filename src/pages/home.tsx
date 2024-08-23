import { Button } from "@nextui-org/react";
import LandingPageImage from "../assets/img/landing page img.png";
import secondLandingPageImg from "../assets/img/second landingPage img.png";
import { Link } from "react-router-dom";
import addSpace from "./addSpace";

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* First Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[80vh]">
        <div className="w-full lg:w-2/5 flex flex-col justify-center p-6 lg:p-12 space-y-4">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800 leading-tight">
            BOOK A SPACE
            <br />
            TO REMEMBER
          </h1>

          <p className="text-sm lg:text-base text-gray-600 max-w-md">
            Discover a world of comfort, luxury, and unparalleled hospitality at Hoteller.
            Nestled in the heart of the city, our exquisite hotel is your home away from home,
            where every stay is a memorable experience.
          </p>
          <Link to="/addSpace">
          <Button 
            radius="full" 
            className="self-start px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 ease-in-out"
          >
            Book Your Space
          </Button>
          </Link>
        </div>

        <div className="w-full lg:w-3/5 relative min-h-[300px] lg:min-h-[80vh]">
          <img
            src={LandingPageImage}
            alt="Luxurious hotel interior"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Second Hero Section */}
      <section className="flex flex-col lg:flex-row-reverse min-h-[80vh] mt-8">
  <div className="w-full lg:w-2/5 flex flex-col justify-center p-6 lg:p-12 space-y-4">
    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800 leading-tight">
      LIST YOUR
      <br />
      FREE SPACE
    </h1>

    <p className="text-sm lg:text-base text-gray-600 max-w-md">
      Have an extra room or property? Share it with travelers worldwide! 
      Turn your unused space into an opportunity. List your accommodation    
      easily and start earning by providing unique stays for guests.
    </p>

    <Button 
      radius="full" 
      className="self-start px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 ease-in-out"
    >
      Post Your Space
    </Button>
  </div>

  <div className="w-full lg:w-3/5 relative min-h-[300px] lg:min-h-[80vh]">
    <img
      src={secondLandingPageImg}
      alt="Cozy home interior"
      className="w-full h-full object-cover"
    />
  </div>
</section>
    </div>
  );
}