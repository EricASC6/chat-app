const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  bio: String,
  id: String
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = {
  schema: contactSchema,
  model: Contact
};
