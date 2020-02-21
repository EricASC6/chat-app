const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");

// Setting up parser
router.use(bodyParser.json());

// GET Requests Middleware
const getUserFromID = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) res.status(404).json({ ok: false, error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

const getUserFromUsername = async (req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username });
    if (!user) res.status(404).json({ ok: false, error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

const prepareUserData = (req, res, next) => {
  const user = req.user;
  const { username, firstname, lastname, fullname, bio, chats, _id } = user;
  const userData = {
    username: username,
    firstname: firstname,
    lastname: lastname,
    fullname: fullname,
    bio: bio,
    chats: chats,
    _id: _id
  };
  req.userData = userData;
  next();
};

const sendBackUserData = (req, res) => {
  const userData = req.userData;
  res.status(200).json(userData);
};

router.get("/id/:id", getUserFromID, prepareUserData, sendBackUserData);
router.get(
  "/username/:username",
  getUserFromUsername,
  prepareUserData,
  sendBackUserData
);

//POST Requests Middleware
const saveNewContactToDB = async (req, res) => {
  const srcUserId = req.body.homeUserId;
  const newContactID = req.body.contactId;

  console.log(srcUserID);
  console.log(newContactID);

  try {
    // Save the new contact of src user to its contacts and vice versa
    const srcUser = await User.findById(srcUserId);
    const newContact = await User.findById(newContactId);

    srcUser.contacts.unshift(newContactID);
    newContact.contacts.unshift(srcUserID);
    await srcUser.save();
    await newContact.save();

    res.status(200).json({ message: "Succesfully added contact" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

router.post("/newContact", getUserFromID, saveNewContactToDB);

module.exports = router;
