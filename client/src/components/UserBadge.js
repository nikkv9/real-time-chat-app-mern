import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import "./UserBadge.css";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <div className="userbadge" onClick={handleFunction}>
      <p>{user.name}</p>
      <p>
        <ClearIcon style={{ fontSize: "1rem", marginLeft: ".2rem" }} />
      </p>
    </div>
  );
};

export default UserBadge;
