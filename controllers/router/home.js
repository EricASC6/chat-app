const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET Requests Middleware
const authenticateID = async (req, res, next) => {
  const ID = req.query.id;
  try {
    const user = await User.findById(ID);
    if (user) {
      req.user = user;
      next();
    } else res.redirect("/login/invalid");
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Array} contactsIDs
 */
const getContactsData = async contactsIDs => {
  const contactsDocuments = await Promise.all(
    contactsIDs.map(async id => await User.findById(id))
  );

  const contactsData = contactsDocuments.map(contact => {
    const { fullname, _id } = contact;
    return { fullname: fullname, id: _id };
  });

  return contactsData;
};

const retrieveUserDataFromRequest = async (req, res, next) => {
  const { username, fullname, contacts } = req.user;
  const contactsData = await getContactsData(contacts);
  const userData = {
    username: username,
    fullname: fullname,
    contacts: contactsData
  };

  req.userData = userData;
  next();
};

const renderHome = (req, res) => {
  const userData = req.userData;
  res.render("home", userData);
};

router.get("/", authenticateID, retrieveUserDataFromRequest, renderHome);

module.exports = router;
