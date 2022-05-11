import express from "express";
const app = express();

import "dotenv/config";
const port = process.env.port;

import "./config/db.js";
app.use(express.json());
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";

app.use(userRoute);
app.use(chatRoute);
app.use(messageRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

const createServer = app.listen(port, (req, res) => {
  console.log(`server is running at ${port}`);
});

import { Server } from "socket.io";

const io = new Server(createServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected socket.io");

  socket.on("setup", (userData) => {
    // console.log(userData);
    socket.join(userData.data.userlog._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new msg", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not found");
    chat.users.forEach((user) => {
      // console.log(user);
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("msg received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData.data.userlog._id);
  });
});
