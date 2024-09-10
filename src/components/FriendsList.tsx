import React from "react";

interface Friend {
  id: string;
  name: string;
}

interface FriendsListProps {
  items: Friend[];
  onClick: (item: {
    id: string;
    name: string;
    type: "friend" | "room";
  }) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ items, onClick }) => {
  return (
    <ul>
      {items.map((friend) => (
        <li
          key={friend.id}
          onClick={() => onClick({ ...friend, type: "friend" })}
        >
          {friend.name}
        </li>
      ))}
    </ul>
  );
};

export default FriendsList;
