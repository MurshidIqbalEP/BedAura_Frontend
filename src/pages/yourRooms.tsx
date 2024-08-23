import { useEffect,useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { fetchRooms } from "../api/user";

function yourRooms() {
  const [rooms,setRooms] = useState([])
  const userId = useSelector((state: RootState) => state.auth.userInfo._id);

    useEffect(()=>{
        const getRooms = async () => {
            try {
  
              const rooms = await fetchRooms(userId);
              
              setRooms(rooms.data)
            } catch (error) {
              console.error("Error fetching rooms:", error);
            }
          };

          getRooms()

    },[userId])
   console.log(rooms);
   
  return (
    <div >
     
     
   
    </div>
  )
}

export default yourRooms
