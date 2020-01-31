const User = require("../models/User");

const loginUser = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne(
    {
      username: username,
      password: password
    },
    (err, user) => {
      if (err) throw err;

      if (user) {
        req.loggedin = true;
        req.userId = user.userId;
      } else {
        req.loggedin = false;
        req.userId = null;
      }
      next();
    }
  );
};

module.exports = {
  loginUser: loginUser
};
