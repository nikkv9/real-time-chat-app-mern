import Visibility from "@mui/icons-material/Visibility";
import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { AppState } from "../context/ContextProvider";
import UserBadge from "./UserBadge";
import axios from "axios";
import UserList from "./UserList";

const UpdateGroupChatModel = ({ children, getMessages }) => {
  let { user, selectedChat, setSelectedChat } = AppState();
  user = user.data;
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renameGroup = async (e) => {
    e.preventDefault();
    if (!groupName) return;

    try {
      const { data } = await axios.put(
        "/chat/group/update",
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(data);
      setSelectedChat(data);
      // handleClose();
      window.location.reload();
    } catch (error) {
      alert("group rename failed!");
    }
    setGroupName("");
  };

  const userSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      const { data } = await axios.get(`/users?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      console.log(data);
      setSearchResult(data.users);
    } catch (error) {
      alert("something error!");
    }
  };

  const addUser = async (user1) => {
    // console.log(user1);
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      return alert("user already exist!");
    }
    if (selectedChat.groupAdmin._id !== user.userlog._id) {
      return alert("only admin can add someone!");
    }

    try {
      const { data } = await axios.put(
        "/chat/group/adduser",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      setSelectedChat(data);
    } catch (error) {
      alert("add user failed!");
    }
    setGroupName("");
  };

  const leaveGroup = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== user.userlog._id &&
      user1._id !== user.userlog._id
    ) {
      return alert("only admin can remove someone!");
    }

    try {
      const { data } = await axios.put(
        "/chat/group/removeuser",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(data);

      user1._id === user.userlog._id
        ? setSelectedChat()
        : setSelectedChat(data);
      getMessages();
    } catch (error) {
      alert("add user failed!");
    }
    setGroupName("");
  };

  return (
    <div>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <Visibility onClick={handleOpen} style={{ cursor: "pointer" }} />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 style={{ textAlign: "center" }}>
            {selectedChat.chatName.toUpperCase()}
          </h2>
          <div
            style={{
              display: "flex",
              marginTop: "2rem",
              justifyContent: "center",
            }}
          >
            {selectedChat.users.map((userr) => (
              <UserBadge
                key={userr._id}
                user={userr}
                handleFunction={() => leaveGroup(userr)}
              />
            ))}
          </div>
          <form className="inputContainer">
            <input
              type="text"
              placeholder="Edit group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              type="submit"
              style={{ backgroundColor: "#4444ff" }}
              onClick={renameGroup}
            >
              RENAME GROUP
            </button>
            <input
              type="text"
              placeholder="Add more users"
              onChange={(e) => userSearch(e.target.value)}
              style={{ marginTop: "1rem" }}
            />
            {searchResult?.slice(0, 4).map((userr) => (
              <UserList
                key={userr._id}
                user={userr}
                handleFunction={() => addUser(userr)}
              />
            ))}
            <button
              type="submit"
              className="loginBtn"
              onClick={() => leaveGroup(user)}
            >
              LEAVE GROUP
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModel;
