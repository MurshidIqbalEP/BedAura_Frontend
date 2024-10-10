import AreaChart from "../../components/areaChart";
import CustomPieChart from "../../components/customPieChart";
import CustomBarChart from "../../components/barChart";

const Dashboard = () => {
  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Room Booking Area Chart */}
        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            Rooms and Bookings Per Month
          </h3>
          <div className="h-64 w-full">
            <AreaChart />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Total Rooms</h3>
          <div className="h-64 w-full">
            <CustomPieChart />
          </div>
        </div>
      </div>

      {/* Bar Chart for Most Bookings from City */}
      <div className="bg-gray-100 shadow-lg rounded-lg p-6 mt-8">
        <h3 className="text-xl font-bold mb-4">Most Bookings from Cities</h3>
        <div className="h-64 w-full">
          <CustomBarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
