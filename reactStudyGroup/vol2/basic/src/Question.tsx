import React from "react";
import ReactDom from "react-dom";

const UserList = () => {
  const data = [
    { uniqueId: 1, name: "abigail", private: false },
    { uniqueId: 2, name: "brian", private: false },
    { uniqueId: 3, name: "caroline", private: false },
    { uniqueId: 4, name: "david", private: true },
    { uniqueId: 5, name: "eva", private: false },
    { uniqueId: 6, name: "fernando", private: true },
    { uniqueId: 7, name: "george", private: false },
  ];
  return (
    <ul>
      {data.map(
        (user) =>
          user.private || <li key={user.uniqueId}>{user.name.toUpperCase()}</li>
      )}
    </ul>
  );
};

ReactDom.render(<UserList />, document.getElementById("root"));
