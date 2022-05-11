import React, { useEffect, useState } from "react";
import { AppState } from "../context/ContextProvider";
import ProfileModal from "./ProfileModal";
import "./Rightbar.css";
import { getSenderFull } from "../config/ChatLogic";
import { getSender } from "../config/ChatLogic";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const Rightbar = () => {
  const { user, selectedChat, notification, setNotification } = AppState();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && input) {
      try {
        const { data } = await axios.post(
          "/message/send",
          {
            content: input,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.data.accessToken}`,
            },
          }
        );
        socket.emit("new msg", data);
        // console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("message is not sent!");
      }
      setInput("");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const getMessages = async () => {
    if (!selectedChat) return;

    try {
      const { data } = await axios.get(`/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("failed to load messages!");
    }
  };

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("msg received", (newMessageReceived) => {
      // notification code
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <div className="rightbar">
      {selectedChat ? (
        <>
          <div className="selected">
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel getMessages={getMessages} />
              </>
            )}
          </div>
          <div className="chatBox">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <div className="messageContainer">
                {messages.map((m) => (
                  <div
                    className={`${
                      m.sender._id === user.data.userlog._id
                        ? "userMsg"
                        : "otherMsg"
                    }`}
                    key={m._id}
                  >
                    <p>{m.content}</p>
                  </div>
                ))}
              </div>
            )}
            {/* {console.log(messages)} */}
            <div className="inputContainer">
              <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="notSelected">
          <h1>Click on a user to start chatting</h1>
        </div>
      )}
    </div>
  );
};

export default Rightbar;
