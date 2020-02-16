const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET Requests Middleware
const handleGETLoginRoute = (req, res, next) => {
  const error =
    req.params.isInvalid === "invalid" ? "Incorrect username or password" : "";
  res.render("login", { error: error });
};

router.get("/:isInvalid?", handleGETLoginRoute);

// POST Requests Middleware
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username, password: password });
    if (user) res.redirect(`/home/id=${user._id}`);
    else res.redirect("/login/invalid");
    next();
  } catch (err) {
    console.error(err);
  }
};

router.post("/", loginUser);

module.exports = router;
