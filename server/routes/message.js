import express from "express";
import { protect } from "../middleware/protect.js";
import Message from "../model/message.js";
import Chat from "../model/chat.js";
import User from "../model/user.js";
const router = express.Router();

// send a message
router.post("/message/send", protect, async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400).send("invalid data!");
  }

  try {
    let newMsg = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });
    newMsg = await newMsg.populate("sender", "name dp");
    newMsg = await newMsg.populate("chat");
    newMsg = await User.populate(newMsg, {
      path: "chat.users",
      select: "name dp email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMsg: newMsg,
    });
    res.status(200).send(newMsg);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get message
router.get("/message/:chatId", protect, async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name dp email")
      .populate("chat");

    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
