import React from "react";

interface Room {
  id: string;
  name: string;
}

interface RoomsListProps {
  items: Room[];
  onClick: (item: {
    id: string;
    name: string;
    type: "friend" | "room";
  }) => void;
}

const RoomsList: React.FC<RoomsListProps> = ({ items, onClick }) => {
  return (
    <ul>
      {items.map((room) => (
        <li key={room.id} onClick={() => onClick({ ...room, type: "room" })}>
          {room.name}
        </li>
      ))}
    </ul>
  );
};

export default RoomsList;
