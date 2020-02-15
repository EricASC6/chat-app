const mongoose = require("mongoose");
const Contact = require("./Contact").schema;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  isLogined: Boolean,
  firstname: String,
  lastname: String,
  bio: String,
  contacts: [Contact],
  chats: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
