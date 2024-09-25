import React, { useState, useEffect } from "react";
import { Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import io from "socket.io-client";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { fetchContacts, fetchPrevMsgs, postMessage } from "../api/user";
import defaultProfile from "../assets/img/Default_pfp.svg.png";
import { FaVideo } from "react-icons/fa";
import chatLoadingAnimatio from "../assets/chatLoadingAnimation.json";
import Lottie from "react-lottie";


import { toast } from "react-toastify";
import {useSocket} from "../context/socketContext"; 



const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: chatLoadingAnimatio,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface Contact {
  id: string;
  name: string;
  message: string;
  updatedAt: string;
  image: string;
}

interface ChatProps {
  currentUserId: string;
  chattingWithUserId: string;
}


const ChatApp: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const response = await fetchContacts(currentUserId);
        setContacts(response?.data.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContactsData();
  }, [currentUserId]);

  return (
    <div className="flex h-[90%] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Contact List */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-bold p-2 border-b border-gray-200">
          Contacts
        </h2>
        <ul className="space-y-1">
          {contacts?.length > 0 ? (
            contacts.map((contact) => (
              <li
                key={contact.id}
                className={`flex items-center p-2 cursor-pointer transition-colors duration-200 ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={contact?.image ?? defaultProfile}
                  className="border-2 border-gray-200"
                />
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.message}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(contact.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center">No contacts available.</p>
          )}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <Chat
            currentUserId={currentUserId}
            chattingWithUserId={selectedContact.id}
            contactName={selectedContact.name}
          />
        ) : (
          <div className="flex flex-col items-center justify-center  bg-gray-50 min-h-screen">
            <Lottie options={defaultOptions} height={300} width={300} />
            <p className="text-2xl font-semibold text-gray-500 mt-4 mb-2 text-center">
              Select a contact to start chatting
            </p>
            <p className="text-base text-gray-400 text-center">
              Choose a conversation from the list to begin messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Chat: React.FC<ChatProps & { contactName: string }> = ({
  currentUserId,
  chattingWithUserId,
  contactName,
}) => {

  const socket = useSocket()
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    Array<{ fromSelf: boolean; message: string; timestamp: string }>
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status,setStatus] = useState(false)
  const navigate = useNavigate(); // Use navigate hook

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return ; // Or handle it accordingly
    }

    socket.emit("joinRoom", {
      senderId: currentUserId,
      receiverId: chattingWithUserId,
    }); 

    const fetchPrevMessages = async () => {
      try {
        const prevMessages = await fetchPrevMsgs(
          currentUserId,
          chattingWithUserId
        );
        setChat(prevMessages?.data.data);
      } catch (error) {
        console.error("Failed to fetch previous messages:", error);
      }
    };

    fetchPrevMessages();

    socket.on("receiveMessage", (messageData) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          fromSelf: messageData.senderId === currentUserId,
          message: messageData.message,
          timestamp:messageData.timestamp|| new Date().toLocaleTimeString(), 
        },
      ]);
      // toast.info("message recieved")
      // notificationSound.play()
    });

    socket.emit('checkStatus',{
      chattingWithUserId
    })

    socket.on("onlineStatus",(status)=>{
      setStatus(status)
    })
    

    // return () => {
    //   socket.off("receiveMessage");
    //   socket.off("receiveVideoCall");
    // };
  }, [currentUserId, chattingWithUserId]);

  // const updateUserOnlineStatus = (userId: string, online: boolean) => {
  //   // Update the contacts or chat list to show online/offline status
  //   setContacts((prevContacts) => prevContacts.map(contact => 
  //     contact.id === userId ? { ...contact, online } : contact
  //   ));
  // };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: chattingWithUserId,
      message,
    };
     
     // Immediately update the chat for the sender
     setChat((prevChat) => [
      ...prevChat,
      {
        fromSelf: true,
        message: message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    await postMessage(messageData);
    socket!.emit("sendMessage", messageData);
    setMessage("");

  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleVideoCall = () => {
    socket!.emit("videoCall", {
      senderId: currentUserId,
      receiverId: chattingWithUserId,
      roomId: currentUserId,
    });

    navigate(`/videocallRoom/${currentUserId}`);
  };

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            isBordered
            radius="full"
            size="sm"
            src={defaultProfile}
            className={`border-2 mr-2 ${status ? "border-green-500" : "border-red-700"}`}
          />
          <h3 className="font-semibold">{contactName}</h3>
          <h2>{status?"online":"offline"}</h2>
        </div>
        <button
          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          onClick={handleVideoCall}
        >
          <FaVideo />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200">
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
            <div className="absolute bottom-10 left-0">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <IoMdSend size={24} />
        </button>
      </form>
    </>
  );
};

export default ChatApp;
