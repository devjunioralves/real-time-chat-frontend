import { generateUniqueUserId } from "@/app/page";
import React, { KeyboardEvent, useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  roomId: string;
}

interface ChatProps {
  id: string;
  name: string;
  type: "friend" | "room";
  messages: Message[];
  onNewMessage: (message: Message) => void;
}

const socket = io("http://localhost:5000");

const Chat: React.FC<ChatProps> = ({ id, name, messages, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("new_message", (message: Message) => {
      onNewMessage(message);
    });

    return () => {
      socket.off("new_message");
    };
  }, [onNewMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: generateUniqueUserId(),
      timestamp: new Date(),
      roomId: id,
    };

    socket.emit("sendMessage", message);
    setNewMessage("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          borderBottom: "1px solid #ccc",
          marginBottom: "10px",
          padding: "10px",
          background: "#fff",
        }}
      >
        <h2>{name}</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages?.map((message) => (
            <li key={message.id} style={{ marginBottom: "5px" }}>
              <div style={{ fontSize: "0.8em", color: "#888" }}>
                {message.timestamp as unknown as string}
              </div>
              <strong>{message.sender}: </strong>
              {message.text}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ padding: "10px", background: "#eee" }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />
        <button onClick={handleSendMessage} style={{ width: "100%" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
