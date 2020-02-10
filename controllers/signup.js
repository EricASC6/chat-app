const User = require("../models/User");

// Middleware functions

/**
 * POST request middleware to register new user to mongodb
 */
const registerNewUser = async (req, res, next) => {
  try {
    const { username, password, firstname, lastname, bio } = req.body;
    const user = new User({
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      bio: bio,
      isLogined: true,
      contacts: [],
      messages: []
    });

    await user.save();

    req.id = user._id;
    next();
  } catch (err) {
    console.error(err);
  }
};

const isUsernameAvail = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      res.redirect("/signup/invalid");
      return;
    } else next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  isUsernameAvail: isUsernameAvail,
  registerNewUser: registerNewUser
};
