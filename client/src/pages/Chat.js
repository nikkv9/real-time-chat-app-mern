import React from "react";
import "./Chat.css";
import { AppState } from "../context/ContextProvider";
import Sidedrawer from "../components/Sidedrawer";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";

const Chat = () => {
  const { user } = AppState();

  return (
    <div className="chat">
      {user && <Sidedrawer />}

      <div className="chatContainer">
        {user && <Leftbar />}
        {user && <Rightbar />}
      </div>
    </div>
  );
};

export default Chat;
