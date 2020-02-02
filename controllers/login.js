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
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    }
  );
};

const authenicateId = (req, res, next) => {
  User.findOne({ _id: req.query.id }, (err, user) => {
    if (err) throw err;
    if (user.login.ipAddresses.includes(req.ip)) next();
    else res.redirect("/login");
  });
};

module.exports = {
  loginUser: loginUser,
  authenicateId: authenicateId
};
