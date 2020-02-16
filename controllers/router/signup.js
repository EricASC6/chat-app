const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET Requests Middleware
const handleGETSignupRoute = (req, res, next) => {
  const error = req.params.isInvalid === "invalid" ? "User already exists" : "";
  res.render("signup", { error: error });
};

router.get("/:isInvalid?", handleGETSignupRoute);

// POST Request Middleware
const checkUsernameAvailability = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (user) res.redirect("/signup/invalid");
    else next();
  } catch (err) {
    console.error(err);
  }
};

const registerNewUser = async (req, res, next) => {
  try {
    const { username, password, firstname, lastname, bio } = req.body;
    const user = new User({
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      fullname: firstname + " " + lastname,
      bio: bio,
      contacts: [],
      chats: []
    });
    await user.save();

    req.userID = user._id;
    next();
  } catch (err) {
    console.error(err);
  }
};

const redirectToHome = (req, res) => {
  const userID = req.userID;
  res.redirect(`/home/id=${userID}`);
};

router.post("/", checkUsernameAvailability, registerNewUser, redirectToHome);

module.exports = router;
