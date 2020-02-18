const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");
const Chat = require("../../models/Chat").model;
const Message = require("../../models/Message").model;
const authenticateKey = require("./authenticateKey");

// Setting up parser
router.use(bodyParser.json());

// GET Requests Middleware
const getChatByID = async (req, res, next) => {
  console.log(req.query);
  const chatID = req.query.id;

  try {
    console.log(chatID);
    const chat = await Chat.findById(chatID);
    if (chat) {
      req.chat = chat;
      next();
    } else res.status(404).json({ ok: false, error: "Chat not found" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

const sendBackChatData = (req, res) => {
  const chat = req.chat;
  res.status(200).json({ ok: true, chat: chat });
};

router.get("/", authenticateKey, getChatByID, sendBackChatData);

// POST Requests Middleware
const getUsersFromChatRequest = async (req, res, next) => {
  const { users: usersData } = req.body;
  try {
    const users = await Promise.all(
      usersData.map(async user => User.findOne(user))
    );
    req.users = users;
    next();
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

const createChat = async (req, res) => {
  const chat = new Chat({
    isGroup: false,
    users: [],
    messages: []
  });

  const chatID = chat._id;

  try {
    console.log(req.users);
    await req.users.forEach(async user => {
      user.chats.unshift(chatID);
      chat.users.push({
        fullname: user.fullname,
        username: user.username,
        _id: user._id
      });
      await user.save();
    });

    await chat.save();
    res.status(200).json({ ok: true, _id: chatID });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

router.post("/newChat", authenticateKey, getUsersFromChatRequest, createChat);

// PUT Requests Middleware
const getChatFromBody = async (req, res, next) => {
  const chatID = req.body._id;
  console.log(req.body);
  console.log("chat-id: ", chatID);
  try {
    const chat = await Chat.findById(chatID);
    console.log(chat);
    req.chat = chat;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server Erro" });
  }
};

const saveMessageToChat = async (req, res) => {
  const message = req.body.message;
  const chat = req.chat;

  try {
    chat.messages.unshift(new Message(message));
    await chat.save();
    res
      .status(200)
      .json({ ok: true, message: "Successfully saved message to chat" });
  } catch (err) {
    res.status.json({ ok: false, error: "Server Erro" });
  }
};

router.put("/newMessage", authenticateKey, getChatFromBody, saveMessageToChat);

module.exports = router;
