import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppState } from "../context/ContextProvider";
import "./Leftbar.css";
import AddIcon from "@mui/icons-material/Add";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/ChatLogic";

const Leftbar = () => {
  let { user, selectedChat, setSelectedChat, chats, setChats } = AppState();
  const [loggedUser, setloggedUser] = useState();
  user = user.data;
  // console.log(user);

  const fetchChats = async () => {
    const { data } = await axios.get("/chats", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    setChats(data);
  };

  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <div className="leftbar">
      <div className="leftbarBox">
        <h2>My chats</h2>
        <GroupChatModal>
          <Button className="button">
            New group chat
            <AddIcon />
          </Button>
        </GroupChatModal>
      </div>
      <div className="leftbarChat">
        {chats.map((chat) => (
          <Box
            onClick={() => setSelectedChat(chat)}
            key={chat._id}
            color={selectedChat === chat ? "white" : "black"}
            bgcolor={selectedChat === chat ? "#0072a2" : "#f3f3f3"}
            padding="1rem"
            marginTop="2rem"
            sx={{ cursor: "pointer" }}
          >
            <p>
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </p>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default Leftbar;
