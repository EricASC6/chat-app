const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  fullname: String,
  bio: String,
  contacts: [ObjectId],
  chats: [ObjectId]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
