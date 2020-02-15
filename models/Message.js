const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  from: String,
  message: String
});

const Message = mongoose.model("message", messageSchema);

module.exports = {
  schema: messageSchema,
  model: Message
};
