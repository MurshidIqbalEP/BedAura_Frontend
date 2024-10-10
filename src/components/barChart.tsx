import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchBookingDataByCity } from "../api/admin";

const customBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetchBookingDataByCity();
        const formattedData = response?.data.data.map((item: any) => ({
          city: item.city.split(" ").slice(0, 3).join(" "),
          bookings: item.totalBookings,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookings" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default customBarChart;
