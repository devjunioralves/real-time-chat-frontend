"use client";
import instance from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
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
  _id: string;
  name: string;
  type: "friend" | "room";
}

export const generateUniqueUserId = (): string => {
  return uuidv4();
};

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [messagesMap, setMessagesMap] = useState<{ [key: string]: Message[] }>(
    {}
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await instance.get("/room");
        setItems(response.data);
      } catch (error) {
        console.error("Error on find rooms", error);
      }
    };

    fetchItems();
  }, []);

  const handleItemClick = async (item: Item) => {
    setSelectedItem(item);

    if (!messagesMap[item._id]) {
      const response = await instance(`/message/recent?roomId=${item._id}`);
      const messages = response.data;
      setMessagesMap((prevMessages) => ({
        ...prevMessages,
        [item._id]: messages,
      }));
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessagesMap((prevMessages) => ({
      ...prevMessages,
      [message.roomId]: [...(prevMessages[message.roomId] || []), message],
    }));
  };

  const handleCreateRoom = async (roomName: string) => {
    const response = await instance.post("/room", { name: roomName });

    const newRoom: Item = {
      _id: response.data.id,
      name: response.data.name,
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
            id={selectedItem._id}
            name={selectedItem.name}
            type={selectedItem.type}
            messages={messagesMap[selectedItem._id] || []}
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
