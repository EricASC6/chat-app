const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");
const Chat = require("../../models/Chat").model;
const Message = require("../../models/Message").model;

// Setting up parser
router.use(bodyParser.json());

// GET Requests Middleware
const getChatById = async (req, res, next) => {
  const chatId = req.params.id;
  console.log("chat-id", chatId);

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) res.status(404).json({ error: "Chat not found" });

    req.chat = chat;
    next();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const sendBackChatData = (req, res) => {
  const chat = req.chat;
  console.log("chat: ", chat);
  res.status(200).json(chat);
};

router.get("/:id", getChatById, sendBackChatData);

// POST Requests Middleware
const getUsersFromChatRequest = async (req, res, next) => {
  const { users: usersParams } = req.body;
  try {
    const users = await Promise.all(
      usersParams.map(async userParam => {
        const user = User.findOne(userParam);
        if (user) return user;
        else
          res
            .status(404)
            .json({ error: `User with a parameter of ${userParam} not found` });
      })
    );

    req.users = users;
    next();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createChat = async (req, res, next) => {
  const isGroup = req.body.isGroup;
  const chatName = req.body.chatName || "";
  const chat = new Chat({
    isGroup: isGroup,
    chatName: chatName,
    users: [],
    messages: []
  });

  req.chat = chat;
  next();
};

const addUsersToChat = async (req, res) => {
  const chat = req.chat;
  const chatId = chat._id;
  const users = req.users;
  try {
    await users.forEach(async user => {
      user.chats.unshift(chatId);

      const { fullname, username, _id } = user;
      chat.users.push({
        fullname: fullname,
        username: username,
        _id: _id
      });
      await user.save();
    });

    await chat.save();
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

router.post("/newChat", getUsersFromChatRequest, createChat, addUsersToChat);
router.post(
  "/newGroupChat",
  getUsersFromChatRequest,
  createChat,
  addUsersToChat
);

// PUT Requests Middleware
const getChatFromBody = async (req, res, next) => {
  const chatId = req.body.chatId;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) res.status(404).json({ error: "Chat not found" });

    req.chat = chat;
    next();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const saveMessageToChat = async (req, res) => {
  const chat = req.chat;
  const message = req.body.message;

  try {
    const newMessage = new Message(message);
    chat.messages.unshift(newMessage);
    await chat.save();
    res.status(200).json({ message: "Successfully saved message to chat" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

router.put("/newMessage/:id", getChatFromBody, saveMessageToChat);

module.exports = router;
