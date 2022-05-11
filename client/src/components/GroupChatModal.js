import { Box, Modal } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { AppState } from "../context/ContextProvider";
import UserBadge from "./UserBadge";
import UserList from "./UserList";

const GroupChatModal = ({ children }) => {
  let { user, chats, setChats } = AppState();
  user = user.data;
  const [groupName, setGroupName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
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

  const searchHandle = async (query) => {
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

      setSearchResult(data.users);
    } catch (error) {
      alert("something error!");
    }
  };
  const groupCreate = async (e) => {
    e.preventDefault();
    if (!groupName || !selectedUser) {
      return alert("please fill all the fields!");
    }

    try {
      const { data } = await axios.post(
        "/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setChats([data, ...chats]);
      handleClose();
      alert("new group created");
    } catch (error) {
      alert("group create failed!");
    }
    setGroupName("");
    setSearchResult(null);
  };
  const deleteHandle = (delUser) => {
    setSelectedUser(
      selectedUser.filter((select) => select._id !== delUser._id)
    );
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      alert("user already added");
    }
    setSelectedUser([...selectedUser, userToAdd]);
    setSearch("");
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 style={{ textAlign: "center" }}>Create group </h2>
          <form className="inputContainer">
            <input
              type="text"
              placeholder="Group name"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add users"
              required
              value={search}
              onChange={(e) => searchHandle(e.target.value)}
            />
            <div style={{ display: "flex" }}>
              {selectedUser.map((userr) => (
                <UserBadge
                  key={userr._id}
                  user={userr}
                  handleFunction={() => deleteHandle(userr)}
                />
              ))}
            </div>

            {searchResult?.slice(0, 4).map((userr) => (
              <UserList
                key={userr._id}
                user={userr}
                handleFunction={() => handleGroup(userr)}
              />
            ))}
            <button type="submit" className="loginBtn" onClick={groupCreate}>
              CREATE GROUP
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
