import React, { useState, useEffect, FormEvent } from 'react';
import io from 'socket.io-client';
import { Avatar } from "@nextui-org/react"; 
import { Button, Input } from "@nextui-org/react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import defaultProfile from "../assets/img/Default_pfp.svg.png";
import { fetchPrevMsgs, postMessage } from '../api/user';

interface ChatProps {
  currentUserId: string;
  chattingWithUserId: string;
}

const socket = io('http://localhost:3000');  // Ensure this URL is correct

  
  const Chat: React.FC<ChatProps> = ({ currentUserId, chattingWithUserId }) => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<Array<{ fromSelf: boolean; message: string }>>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
    useEffect(() => {
      // Join the chat room
      socket.emit("joinRoom", { senderId: currentUserId, receiverId: chattingWithUserId });
      
      const fetchPrevMsg = async ()=>{
        console.log(currentUserId,  chattingWithUserId );
        
         const  prevMsg = await fetchPrevMsgs( currentUserId,  chattingWithUserId );
         setChat(prevMsg?.data.data) 
      }
      
      fetchPrevMsg()
    }, [currentUserId, chattingWithUserId]);
  
    const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
  
      const messageData = {
        senderId: currentUserId,
        receiverId: chattingWithUserId,
        message,
      };
    
     
      const response = await postMessage(messageData)
      if(response){
        setChat((prevChat) => [
          ...prevChat, 
          {
            fromSelf: true,
            message: message,
          }
        ]);
      }
      
      socket.emit("sendMessage", messageData);
      setMessage(""); 
    };
  
    const handleEmojiClick = ( emojiObject: any) => {
   
      
      setMessage((prevMessage) => prevMessage + emojiObject.emoji);
      setShowEmojiPicker(false); // Close emoji picker
    };
  
    return (
      <div className="flex flex-col h-full">
        {/* Header with Avatar and Contact Name */}
        <div className="flex w-full gap-2 items-center mb-4">
          <Avatar isBordered radius="full" size="sm" className="bg-black" src={defaultProfile} />
          {/* <h3 className="font-bold">{contactName}</h3> */}
        </div>
  
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 border-b border-gray-300">
          {chat.length > 0 ? (
            chat.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.fromSelf === true ? "text-right" : "text-left"}`}>
                <p className={`inline-block p-2 rounded-lg ${msg.fromSelf === true ? "bg-blue-200" : "bg-gray-200"}`}>
                  {msg.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
        </div>
  
        {/* Input Area */}
        <form onSubmit={sendMessage} className="flex items-center p-2">
          <div className="relative">
            <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <BsEmojiSmileFill size={24} />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-10">
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <Input
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="mx-2"
          />
          <Button type="submit"  icon={<IoMdSend size={24} />} />
        </form>
      </div>
    );
  };

export default Chat;
