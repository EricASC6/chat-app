const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");
const authenticateKey = require("./authenticateKey");

// Setting up parser
router.use(bodyParser.json());

// GET Requests Middleware
const VALID_QUERY_PARAMS = {
  user_id: "_id",
  username: "username"
};

const getSearchParam = query => {
  const searchParam = Object.keys(query).find(key => key !== "key");
  if (searchParam in VALID_QUERY_PARAMS)
    return { [VALID_QUERY_PARAMS[searchParam]]: query[searchParam] };
  else return null;
};

const getUserData = async (req, res, next) => {
  const searchParam = getSearchParam(req.query);
  if (!searchParam)
    res.status(400).json({ ok: false, error: "Invalid Request" });

  try {
    const user = await User.findOne(searchParam);
    if (!user) res.status(404).json({ ok: false, error: "User not found" });
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
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

const sendBackUserData = (req, res) => {
  const userData = req.userData;
  res.status(200).json({ ok: true, userData: userData });
};

router.get("/", authenticateKey, getUserData, sendBackUserData);

//POST Requests Middleware
const saveNewContactToDB = async (req, res) => {
  const srcUserID = req.query.key;
  const newContactID = req.body._id;

  console.log(srcUserID);
  console.log(newContactID);

  try {
    // Save the new contact of src user to its contacts and vice versa
    const srcUser = await User.findById(srcUserID);
    const newContact = await User.findById(newContactID);

    srcUser.contacts.unshift(newContactID);
    newContact.contacts.unshift(srcUserID);
    await srcUser.save();
    await newContact.save();

    res.status(200).json({ ok: true, message: "Succesfully added contact" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

router.post("/newContact", authenticateKey, saveNewContactToDB);

module.exports = router;
