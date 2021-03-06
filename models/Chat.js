const mongoose = require("mongoose");
const MessageSchema = require("./Message").schema;
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  isGroup: Boolean,
  chatName: String,
  users: [Object],
  messages: [MessageSchema]
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = {
  schema: chatSchema,
  model: Chat
};
