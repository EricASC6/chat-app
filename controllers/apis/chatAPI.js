const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");
const Chat = require("../../models/Chat").model;
const authenticateKey = require("./authenticateKey");

// Setting up parser
router.use(bodyParser.json());

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

module.exports = router;
