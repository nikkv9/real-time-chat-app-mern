import express from "express";
const router = express.Router();
import { protect } from "../middleware/protect.js";
import User from "../model/user.js";
import Chat from "../model/chat.js";

// create chat
router.post("/chat/create", protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).send("userid param is not sent with request");
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      // user who login
      { users: { $elemMatch: { $eq: req.user._id } } },
      // user to send msg
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMsg");

  isChat = await User.populate(isChat, {
    path: "latestMsg.sender",
    select: "name email dp",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      console.log(error);
    }
  }
});

// get chats
router.get("/chats", protect, async (req, res) => {
  var result = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMsg")
    .sort({ updatedAt: -1 });
  result = await User.populate(result, {
    path: "latestMsg.sender",
    select: "name email dp",
  });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send("error found!");
  }
});

// create group chat
router.post("/chat/group", protect, async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).send("fill all the fields!");
  }
  var user = JSON.parse(users);
  if (user.length < 2) {
    return res.status(400).send("atleast two people should be in a group !");
  }
  // user.push = all user who login and req.user=current user who login
  user.push(req.user);

  const groupChat = await Chat.create({
    chatName: name,
    users: user,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (fullGroupChat) {
    res.status(200).send(fullGroupChat);
  } else {
    res.status(400).send("something error here!");
  }
});

// update or edit group name
router.put("/chat/group/update", protect, async (req, res) => {
  const { chatId, chatName } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updateChat) {
    res.status(200).send(updateChat);
  } else {
    res.status(400).send("something error in updation of group ");
  }
});

// add new user in group
router.put("/chat/group/adduser", protect, async (req, res) => {
  const { chatId, userId } = req.body;

  const addNewUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (addNewUser) {
    res.status(200).send(addNewUser);
  } else {
    res.status(400).send("something error in add user of group ");
  }
});

// remove user from group
router.put("/chat/group/removeuser", protect, async (req, res) => {
  const { chatId, userId } = req.body;

  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (removeUser) {
    res.status(200).send(removeUser);
  } else {
    res.status(400).send("something error in add user of group ");
  }
});

export default router;
