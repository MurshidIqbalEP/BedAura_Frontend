import { Button } from "@nextui-org/react";
import LandingPageImage from "../../assets/img/landing page img.png";
import secondLandingPageImg from "../../assets/img/second landingPage img.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* First Hero Section */}
      <motion.section
        className="flex flex-col lg:flex-row min-h-[60vh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full lg:w-2/5 flex flex-col justify-center p-6 lg:p-12 space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Find the Perfect <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Space
            </span>{" "}
            for You
          </h1>

          <p className="text-sm lg:text-base text-gray-600 max-w-md">
            Discover a world of comfort, luxury, and unparalleled hospitality at
            Hoteller. Nestled in the heart of the city, our exquisite hotel is
            your home away from home, where every stay is a memorable
            experience.
          </p>

          <Button
            as={Link}
            to={"/allrooms"}
            type="button"
            radius="full"
            className="self-start px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 ease-in-out"
          >
            Book Your Space
          </Button>
        </motion.div>

        <motion.div
          className="w-full lg:w-3/5 relative min-h-[300px] lg:min-h-[80vh]"
          variants={itemVariants}
        >
          <img
            src={LandingPageImage}
            alt="Luxurious hotel interior"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.section>

      {/* Second Hero Section */}
      <motion.section
        className="flex flex-col lg:flex-row-reverse min-h-[60vh] mt-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full lg:w-2/5 flex flex-col justify-center p-6 lg:p-12 space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            LIST YOUR
            <br />
            FREE{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
              Space
            </span>
          </h1>

          <p className="text-sm lg:text-base text-gray-600 max-w-md">
            Have an extra room or property? Share it with travelers worldwide!
            Turn your unused space into an opportunity. List your accommodation
            easily and start earning by providing unique stays for guests.
          </p>

          <Button
            as={Link}
            to={"/addSpace"}
            type="button"
            radius="full"
            className="self-start px-6  py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 ease-in-out"
          >
            Post Your Space
          </Button>
        </motion.div>

        <motion.div
          className="w-full lg:w-3/5 relative min-h-[300px] lg:min-h-[80vh]"
          variants={itemVariants}
        >
          <img
            src={secondLandingPageImg}
            alt="Cozy home interior"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.section>
    </div>
  );
}
