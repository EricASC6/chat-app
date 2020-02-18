const mongoose = require("mongoose");
const MessageSchema = require("./Message").schema;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema({
  isGroup: Boolean,
  users: [ObjectId],
  messages: [MessageSchema]
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = {
  schema: chatSchema,
  model: Chat
};
