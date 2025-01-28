import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchBookingPerMounth } from "../api/admin";

const areaChart = () => {
  const [areaData, setAreaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBookingPerMounth();

        const formattedData = response?.data.data.map((item: any) => ({
          month: new Date(0, item.month - 1).toLocaleString("default", {
            month: "short",
          }), // Convert month number to short month name
          rooms: item.rooms,
          bookings: item.bookings,
        }));

        console.log(formattedData)

        setAreaData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart
        data={areaData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="rooms"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="bookings"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default areaChart;
