const User = require("../models/User");

// Middleware functions

/**
 * POST request middleware to register new user to mongodb
 */
const registerNewUser = (req, res, next) => {
  const { username, password, firstname, lastname, bio } = req.body;
  const user = new User({
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
    bio: bio,
    userId: 1,
    contacts: [],
    messages: []
  });

  user.save(err => {
    if (err) throw err;
  });

  next();
};

module.exports = {
  registerNewUser: registerNewUser
};
