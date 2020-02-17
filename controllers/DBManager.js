const User = require("../models/User");

const DBManager = {
  /**
   * Gets the user with the specified properties
   * @param {Object} params - properties of the user
   * @returns {Object} - Mongodb document
   */
  async getUser(props) {
    const user = await User.findOne(props);
    return user;
  },

  /**
   * Returns an object with the specificed properties from an mongodb document
   * @param {Object} doc - Mongodb document
   * @param  {Array} props - Properties you want to extract from document
   * @returns {Object} Object with the properties you want
   */
  async getPropertiesFromDocument(doc, ...props) {
    const data = {};
    for (const prop of props) {
      if (prop in doc) userData[prop] = doc[prop];
    }

    return data;
  },
  /**
   * Saves the user to the database
   * @param {Object} user - Mongodb document
   */
  async saveUser(user) {
    await user.save();
  }
};

module.exports = DBManager;
