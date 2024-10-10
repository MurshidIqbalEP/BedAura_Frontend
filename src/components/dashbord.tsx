import AreaChart from "./userBarChart";
import CustomPieChart from "./usersPieChart";

function dashbord() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Room Booking Area Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">My Rooms Bookings</h3>
          <div className="h-64 w-full">
            <AreaChart />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">My Rooms</h3>
          <div className="h-64 w-full">
            <CustomPieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default dashbord;
