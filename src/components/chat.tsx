import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
import { Avatar } from "@nextui-org/react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import defaultProfile from "../assets/img/Default_pfp.svg.png";
import { fetchOwnerDetails, fetchPrevMsgs, postMessage } from "../api/user";
import { useSocket } from "../context/socketContext";

interface ChatProps {
  currentUserId: string;
  chattingWithUserId: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, chattingWithUserId }) => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState({
    name: "",
    image: "",
  });
  const [chat, setChat] = useState<
    Array<{ fromSelf: boolean; message: string; timestamp: string }>
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Join the chat room
    socket.emit("joinRoom", {
      senderId: currentUserId,
      receiverId: chattingWithUserId,
    });

    const handleReceiveMessage = (messageData: any) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          fromSelf: messageData.senderId === currentUserId,
          message: messageData.message,
          timestamp: messageData.timestamp,
        },
      ]);
    };

    // Remove previous event listener before adding a new one
    socket.off("receiveMessage").on("receiveMessage", handleReceiveMessage);

    const fetchPrevMsg = async () => {
      const prevMsg = await fetchPrevMsgs(currentUserId, chattingWithUserId);
      setChat(prevMsg?.data.data);
    };

    const FetchOwnerDetails = async () => {
      const ownerDetails = await fetchOwnerDetails(chattingWithUserId);
      setOwner(ownerDetails?.data.owner);
    };

    FetchOwnerDetails();
    fetchPrevMsg();

    // // Cleanup to prevent multiple event listeners
    // return () => {
    //   socket.off("receiveMessage", handleReceiveMessage);
    // };
  }, [currentUserId, chattingWithUserId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: chattingWithUserId,
      message,
    };

    const response = await postMessage(messageData);

    // Emit the message to the server (ensure this happens once)
    socket!.emit("sendMessage", messageData);
    setMessage("");
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Close emoji picker
  };

  return (
    <div className="flex flex-col h-full p-0">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center">
        <Avatar
          isBordered
          radius="full"
          size="sm"
          src={owner.image ?? defaultProfile}
          className="mr-2"
        />
        <h3 className="font-semibold">{owner.name}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {chat.length > 0 ? (
          chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.fromSelf ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                  msg.fromSelf
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p>{msg.message}</p>
                <span
                  className={`text-[9px] mt-1 block  ${
                    msg.fromSelf
                      ? "text-white  text-right"
                      : "text-gray-500  text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No messages yet.</p>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-gray-200 p-4 flex items-center space-x-2"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <BsEmojiSmileFill size={24} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-10 left-10 ">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoMdSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
