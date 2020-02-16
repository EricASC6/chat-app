const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET Requests Middleware
const authenticateID = async (req, res, next) => {
  const ID = req.query.id;
  try {
    const user = await User.findOne({ _id: ID });
    if (user) {
      req.user = user;
      next();
    } else res.redirect("/login/invalid");
  } catch (err) {
    console.error(err);
  }
};

const retrieveUserDataFromRequest = (req, res, next) => {
  const { username, fullname, contacts } = req.user;
  const userData = {
    username: username,
    fullname: fullname,
    contacts: contacts
  };

  req.userData = userData;
  next();
};

const renderHome = (req, res) => {
  const userData = req.userData;
  res.render("home", userData);
};

router.get("/", authenticateID, retrieveUserDataFromRequest, renderHome);

module.exports = router;
