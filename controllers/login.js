const User = require("../models/User");

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username,
      password: password
    });

    if (user) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch (err) {
    console.error(err);
  }
};

const authenicateId = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.query.id });
    if (user.login.ipAddresses.includes(req.ip)) next();
    else res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  loginUser: loginUser,
  authenicateId: authenicateId
};
