const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  isLogined: Boolean,
  firstname: String,
  lastname: String,
  bio: String,
  login: {
    isLogined: Boolean,
    ipAddresses: [String]
  },
  contacts: Array,
  messages: Array
});

const User = mongoose.model("User", userSchema);

module.exports = User;
