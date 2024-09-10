"use client";
import instance from "@/config/axiosConfig";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  roomId: string;
}

interface Item {
  id: string;
  name: string;
  type: "friend" | "room";
}

export const generateUniqueUserId = (): string => {
  return uuidv4();
};

const initialItems: Item[] = [
  { id: "1", name: "Friend 1", type: "friend" },
  { id: "2", name: "Room 1", type: "room" },
];

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [messagesMap, setMessagesMap] = useState<{ [key: string]: Message[] }>(
    {}
  );

  const handleItemClick = async (item: Item) => {
    setSelectedItem(item);

    if (!messagesMap[item.id]) {
      const response = await instance(`/message/recent?roomId=${item.id}`);
      const messages = response.data;
      setMessagesMap((prevMessages) => ({
        ...prevMessages,
        [item.id]: messages,
      }));
    }
  };

  const handleNewMessage = (message: Message) => {
    console.log("New message", message);
    setMessagesMap((prevMessages) => ({
      ...prevMessages,
      [message.roomId]: [...(prevMessages[message.roomId] || []), message],
    }));
  };

  const handleCreateRoom = (roomName: string) => {
    const newRoom: Item = {
      id: generateUniqueUserId(),
      name: roomName,
      type: "room",
    };

    setItems((prevItems) => [...prevItems, newRoom]);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        items={items}
        onItemClick={handleItemClick}
        onCreateRoom={handleCreateRoom}
      />
      <div style={{ flex: 1 }}>
        {selectedItem ? (
          <Chat
            id={selectedItem.id}
            name={selectedItem.name}
            type={selectedItem.type}
            messages={messagesMap[selectedItem.id] || []}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div>Select a chat to start</div>
        )}
      </div>
    </div>
  );
};

export default Home;
