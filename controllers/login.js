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
    if (user) {
      req.user = user;
      user.isLogined = true;
      await user.save();
      next();
    } else res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
};

const retrieveUserData = (req, res, next) => {
  const { firstname, lastname, username, contacts, messages } = req.user;
  const userData = {
    username: username,
    name: firstname + " " + lastname,
    contacts: contacts,
    messages: messages
  };

  req.userData = userData;
  next();
};

module.exports = {
  loginUser: loginUser,
  authenicateId: authenicateId,
  retrieveUserData: retrieveUserData
};
