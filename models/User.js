const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  fullname: String,
  bio: String,
  contacts: [mongoose.Types.ObjectId],
  chats: [mongoose.Types.ObjectId]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
