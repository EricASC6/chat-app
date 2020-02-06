const User = require("../models/User");

// Middleware functions

/**
 * POST request middleware to register new user to mongodb
 */
const registerNewUser = async (req, res, next) => {
  const { username, password, firstname, lastname, bio } = req.body;
  const user = new User({
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
    bio: bio,
    login: {
      isLogined: true,
      ipAddresses: [req.ip]
    },
    contacts: [],
    messages: []
  });

  await user.save(err => {
    if (err) throw err;
  });

  req.id = user._id;
  next();
};

const isUsernameAvail = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (err) throw err;
    if (user) {
      res.redirect("/signup/invalid");
      return;
    } else next();
  });
};

module.exports = {
  isUsernameAvail: isUsernameAvail,
  registerNewUser: registerNewUser
};
