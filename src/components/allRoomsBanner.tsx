import { Button } from "antd";
import BannerImage from "../assets/img/allRoomsBG.png";

interface AllRoomsBannerProps {
  handleFindNearestRooms: () => void;
}

function allRoomsBanner({ handleFindNearestRooms }: AllRoomsBannerProps) {
  return (
    <div>
  <div className="relative w-full h-80 overflow-hidden">
    {/* Overlay Div */}
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
    
    {/* Image */}
    <img
      src={BannerImage}
      alt="Banner"
      className="w-full h-full object-cover"
    />
    
    {/* Centered Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Find Affordable Bedspace</h1>
      <div className="flex w-full max-w-md p-2">
        <input
          type="text"
          placeholder="Search Location"
          className="w-full px-4 py-2 rounded-l-md focus:outline-none"
        />
        <button className="bg-custom-yellow text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none">
          Search
        </button>
      </div>
      <Button className="bg-transparent " type="dashed" ghost onClick={handleFindNearestRooms}>
      Find Nearest Room
    </Button>
    </div>
  </div>
</div>

  )
}

export default allRoomsBanner
