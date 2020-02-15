const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Contact = require("../models/Contact").model;
const Chat = require("../models/Chat").model;
const Message = require("../models/Message").model;
const bodyParser = require("body-parser");

// Setting up parser
router.use(bodyParser.json());

// GET Requests
router.get("/", async (req, res) => {
  const queries = req.query;
  if (queries.id && queries.username) {
    res.redirect(`user/${queries.id}/${queries.username}`);
    return;
  }

  const username = queries.username;

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.json({ ok: true, user: user });
    } else {
      res.json({ ok: false, user: null });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: "Something went wrong" });
  }
});

router.get("/:id/:username", async (req, res) => {
  const { id, username } = req.params;
  try {
    const srcUser = await User.findById(id);
    console.log(srcUser);
    const contact = await srcUser.contacts.filter(
      contact => contact.username === username
    )[0];
    if (contact) {
      res.json({ ok: true, contact: contact });
    } else {
      res.json({ ok: false, contact: null });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: "Something went wrong" });
  }
});

// POST Request
router.post("/", async (req, res) => {
  const { id, newContact } = req.body;

  try {
    const srcUser = await User.findById(id);
    if (srcUser) {
      const newContactDoc = new Contact(newContact);
      srcUser.contacts.unshift(newContactDoc);
      await srcUser.save();
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(500).json({
      ok: false
    });
  }
});

router.post("/newChat", async (req, res) => {
  const { id, newContactUsername, isGroup } = req.body;
  console.log(id, newContactUsername, isGroup);
  try {
    const srcUser = await User.findById(id);
    console.log(srcUser);
    const newContact = await User.findOne({ username: newContactUsername });
    console.log(newContact);

    const newChat = new Chat({
      isGroup: isGroup,
      users: [srcUser.username, newContact.username],
      messages: []
    });

    await newChat.save();

    const chatId = newChat._id;
    srcUser.chats.unshift(chatId);
    newContact.chats.unshift(chatId);
    await srcUser.save();
    await srcUser.save();
    res.json({ ok: true, chat: newChat, contact: newContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
