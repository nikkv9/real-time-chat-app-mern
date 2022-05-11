import React from "react";
import Notifications from "@mui/icons-material/Notifications";
import { Menu, MenuItem } from "@mui/material";
import "./Notification.css";
import { getSender } from "../config/ChatLogic";
import { AppState } from "../context/ContextProvider";
import NotificationBadge, { Effect } from "react-notification-badge";
const Notification = ({ notification, setNotification }) => {
  const { user, setSelectedChat } = AppState();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="notification">
      <NotificationBadge count={notification.length} effect={Effect.SCALE} />
      <Notifications
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose} style={{ padding: "0.5rem" }}>
          {!notification.length && "no new messages!"}
          {notification.map((ntf) => (
            <div
              key={ntf._id}
              onClick={() => {
                setSelectedChat(ntf.chat);
                setNotification(notification.filter((n) => n !== ntf));
              }}
            >
              {ntf.chat.groupChat
                ? `New message in ${ntf.chat.chatName}`
                : `New message from ${getSender(user, ntf.chat.users)}`}
            </div>
          ))}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Notification;
