import { Avatar, Box } from "@mui/material";
import React from "react";
import "./UserList.css";

const UserList = ({ user, handleFunction }) => {
  const IP = process.env.REACT_APP_IMAGE_PATH;

  return (
    <div className="userlist">
      <Box onClick={handleFunction} className="userlistContainer">
        <Avatar src={IP + user.dp} style={{ marginRight: "1rem" }} />
        <Box style={{ marginRight: "1rem" }}>
          <h3 style={{ marginBottom: "0.3rem" }}>{user.name}</h3>
          <span>{user.email}</span>
        </Box>
      </Box>
    </div>
  );
};

export default UserList;
