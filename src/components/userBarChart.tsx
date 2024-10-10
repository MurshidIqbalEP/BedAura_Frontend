import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../redux/store";
import { fetchUsersRoomBookings } from "../api/user";

const UsersRoomBookingChart = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the booking data from your backend
    const fetchBookingData = async () => {
      try {
        const response = await fetchUsersRoomBookings(userInfo._id);

        const formattedData = response?.data.data.map((item: any) => ({
          roomName: item.roomName,
          totalBookings: item.totalBookings,
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
        <XAxis dataKey="roomName" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalBookings" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsersRoomBookingChart;
