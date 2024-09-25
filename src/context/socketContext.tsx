import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";  // Import Socket type
import sound from "../assets/notificationSound.wav"
import videoCallSound from "../assets/videocallNotification.wav"
import { Button, notification, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Define a type for your socket
type SocketType = Socket | null;

const SocketContext = createContext<SocketType>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType>(null);  // Use SocketType to allow both null and Socket instance
  const notificationSound = new Audio(sound);
  const videoCallNotificationSound = new Audio(videoCallSound);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

 const navigate = useNavigate()
  useEffect(() => {
    if(userInfo){
       const socketConnection = io("http://localhost:3000");  // Connect to your server
    setSocket(socketConnection);  // Set the socket instance

    socketConnection.emit('registerUser', userInfo._id);

    socketConnection.on("receiveMessage", (messageData) => {
        console.log(messageData);
      
        if(messageData.senderId !==userInfo._id  ){
          toast.info(`message recieved from ${messageData.sender}`)
          notificationSound.play()
        }
        
      });
    
      socketConnection.on("receiveVideoCall", ({ sender,senderId, roomId }) => {
        console.log("call comming", roomId);
        // !== currentUserId
        if (senderId !== userInfo._id ) {
          const key = `open${Date.now()}`;
          const handleJoin = () => {
            navigate(`/videocallRoom/${roomId}`); 
            notification.destroy();
          };
  
          const btn = (
            <Space>
              <Button
                type="dashed"
                size="middle"
                onClick={()=>notification.destroy()}
              >
                Close
              </Button>
              <Button
                type="primary"
                size="middle"
                onClick={handleJoin}
              >
                Join
              </Button>
            </Space>
          );
  
          notification.open({
            message: "Incoming Video Call!",
            description: `You have a video call from ${sender} .`,
            btn,
            key,
            duration: 0,
            onClose: () => {
              console.log("Notification closed");
            },
          });
          videoCallNotificationSound.play()
        }
      });

    return () => {
      socketConnection.disconnect();  // Cleanup on component unmount
    };
    }
    
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
