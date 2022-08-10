import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Profile />
      <Profile />
    </div>
  );
}

const Profile = () => {
  return (
    <div className="profile-card">
      <div className="image">
        <img
          src="https://picsum.photos/id/101/100"
          width="100"
          height="100"
          alt="icon"
        />
      </div>
      <div>
        <div className="name">hanako yamada</div>
        <div className="company">Uzabase</div>
        <div className="position">CEO</div>
      </div>
    </div>
  );
};

export default App;
