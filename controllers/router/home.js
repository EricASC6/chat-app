const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Chat = require("../../models/Chat").model;

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
    const { username, fullname, _id } = contact;
    return { username: username, fullname: fullname, id: _id };
  });

  return contactsData;
};

const getChatName = (chat, userID) => {
  const users = chat.users;
  if (chat.isGroup) {
    return chat.chatName;
  } else {
    const chatName = users.filter(user => user._id.toString() !== userID)[0]
      .fullname;
    return chatName;
  }
};

const getMostRecentMessage = chat => {
  const messages = chat.messages;
  if (messages.length > 0) return messages[0].message;
  else return "Start a conversation";
};

const getChatsData = async (chatIDs, userID) => {
  const chats = await Promise.all(
    chatIDs.map(async _id => {
      const chat = await Chat.findById(_id);
      // console.log("chat: ", chat);

      // console.log(chat);
      const chatName = getChatName(chat, userID);
      // console.log("chat-name: ", chatName);
      const mostRecentMessage = getMostRecentMessage(chat);
      // console.log("most-recent-messages: ", mostRecentMessage);

      const chatData = {
        chatName: chatName,
        mostRecentMessage: mostRecentMessage,
        _id: _id
      };

      return chatData;
    })
  );

  // console.log(chats);
  return chats;
};

const retrieveUserDataFromRequest = async (req, res, next) => {
  const userID = req.query.id;
  // console.log("user-id: ", userID);
  const { username, fullname, contacts, chats } = req.user;
  // console.log("Chat ids: ", chats);
  const contactsData = await getContactsData(contacts);
  const chatsData = await getChatsData(chats, userID);
  // console.log("chat-data: ", chatsData);
  const userData = {
    username: username,
    fullname: fullname,
    contacts: contactsData,
    chats: chatsData
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
