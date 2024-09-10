import React, { useState } from "react";

interface Item {
  id: string;
  name: string;
  type: "friend" | "room";
}

interface SidebarProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  onCreateRoom: (roomName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  onItemClick,
  onCreateRoom,
}) => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleCreateRoomClick = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName("");
      setIsCreatingRoom(false);
    }
  };

  return (
    <div
      style={{ width: "300px", borderRight: "1px solid #ccc", padding: "10px" }}
    >
      <h3>Friends and Rooms</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => onItemClick(item)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {isCreatingRoom ? (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={handleCreateRoomClick} style={{ width: "100%" }}>
            Create Room
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingRoom(true)}
          style={{ width: "100%" }}
        >
          Create New Room
        </button>
      )}
    </div>
  );
};

export default Sidebar;
