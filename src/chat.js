import ContactViewier from "./ContactViewer.js";
import ChatViewier from "./ChatViewer.js";
import ContactCreator from "./ContactCreator.js";
import ChatCreator from "./ChatCreator.js";
import ChatManager from "./ChatManager.js";
import Chat from "./components/Chat.js";
import Contact from "./components/Contact.js";
import Message from "./components/Message.js";
import UserAPI from "./api/UserAPI.js";
import ChatAPI from "./api/ChatAPI.js";
import MessageAPI from "./api/MessageAPI.js";

// Constants - DOM + User Id
const CREATE_CHAT_BTN_ID = "add-new-chat";
const ADD_CHAT_ID = "add-chat";
const USERNAME_FIELD_ID = "username";
const GROUP_NAME_FIELD_ID = "group-name";
const CONTACTS_LIST_ID = "contacts-list";
const CHAT_ROOM_ID = "chat-room";
const CONTACTS_TAB_ID = "contacts-tab";
const HOME_VIEW_ID = "home-view";
const CHAT_ICON_QUERY = "#chat-contact-icon p";
const CHAT_NAME_ID = "chat-name";
const CHAT_CLASS = "chat";
const CHATS_BODY_ID = "chats-body";
const HOME_ORIGIN = window.location.origin;
const KEY = new URLSearchParams(window.location.search).get("id");
const homeUserID = KEY;

// Establishing Socket Connection
const socket = io(HOME_ORIGIN);

socket.on("connect", async () => {
  const homeUserData = await UserAPI.getUserDataFromID(homeUserID, KEY);
  const user = homeUserData.userData;
  chatManager.connectToServer(socket, user);
});

// 1. Create a new contact
const createChatBtn = document.getElementById(CREATE_CHAT_BTN_ID);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);

const contactCreator = new ContactCreator(KEY);

const createContact = async username => {
  try {
    console.log("Username: ", username);
    const userData = await UserAPI.getUserDataFromUsername(username, KEY);
    const contact = Contact.createContact(userData);
    contactCreator.addNewContactToContactsList(contactsList, contact);
    contactCreator.emitNewContactEvent();
    await contactCreator.saveNewContactDataToDB(userData);
    return userData;
  } catch (err) {
    console.error(err);
  }
};

// 2. Creating a new chat room and saving it to db
const chatRoom = document.getElementById(CHAT_ROOM_ID);
const chatIcon = document.querySelector(CHAT_ICON_QUERY);
const chatName = document.getElementById(CHAT_NAME_ID);
const chatsBody = document.getElementById(CHATS_BODY_ID);
const addChat = document.getElementById(ADD_CHAT_ID);
const groupName = document.getElementById(GROUP_NAME_FIELD_ID);

const chatCreator = new ChatCreator(KEY);

const createChatRoom = async id => {
  const newChat = chatCreator.createChatRoom(id);
  const chatData = await chatCreator.saveChatRoomToDB(newChat);
  return chatData;
};

const formatChatRoom = ({ firstname, lastname, fullname }) => {
  chatIcon.textContent = firstname[0] + lastname[0];
  chatName.textContent = fullname;
};

const slideOverChatRoom = chatRoom => {
  chatRoom.classList.add("show");
};

const slideAwayChatRoom = chatRoom => {
  chatRoom.classList.remove("show");
};

const clearChatRoomMessages = chatRoomMessages => {
  chatRoomMessages.innerHTML = "";
};

createChatBtn.addEventListener("click", async () => {
  if (!contactCreator.isReady(createChatBtn)) return;

  try {
    const chatType = addChat.getAttribute("data-type");
    if (chatType === "conversation") {
      const username = usernameField.value;
      const contact = await createContact(username);
      console.log(contact);
      const chatData = await createChatRoom(contact._id);
      console.log(chatData);

      const chatID = chatData._id;
      const chatName = contact.fullname;
      const chat = Chat.createChat(chatName, chatID);

      chatCreator.setChatRoomID(chatID, chatRoom);
      chatCreator.addChatToChatsBody(chatsBody, chat);
      formatChatRoom(contact);
    } else if (chatType === "group-chat") {
      const groupChatNameVal = groupName.value;
      const usernames = chatCreator.getUsernamesFromUsernameField(
        usernameField
      );

      const userContacts = [...contactsList.children].map(contact =>
        contact.getAttribute("username")
      );

      usernames.forEach(username => {
        if (!userContacts.includes(username)) createContact(username);
      });

      const groupChat = chatCreator.createGroupChat(
        groupChatNameVal,
        usernames
      );

      const groupChatData = await chatCreator.saveChatRoomToDB(groupChat, true);
      const chatID = groupChatData._id;
      const chatNameVal = groupChatData.chatName;
      const chat = Chat.createChat(chatNameVal, chatID);
      chatCreator.setChatRoomID(chatID, chatRoom);
      chatCreator.addChatToChatsBody(chatsBody, chat);

      chatName.innerHTML = chatNameVal;

      console.log("Success");
    }

    slideOverChatRoom(chatRoom);
  } catch (err) {
    console.error(err);
  }
});

// Viewing the contacts | home
const homeViewLink = document.getElementById(HOME_VIEW_ID);
const contactsTab = document.getElementById(CONTACTS_TAB_ID);
const contactViewier = new ContactViewier(KEY);

const slideContactsTabAway = contactsTab => {
  contactsTab.classList.remove("show");
};

const viewContact = async userID => {
  const contactData = await contactViewier.retrieveContactInfo(userID);
  contactViewier.displayContactInfo(contactData);
  slideContactsTabAway(contactsTab);
};

const enableViewingOnContactsList = () => {
  const contacts = Array.from(contactsList.children).filter(child => !child.id);
  contacts.forEach(contact =>
    contact.addEventListener("click", async () => {
      const userID = contact.getAttribute("data-id");
      try {
        await viewContact(userID);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

// homeViewLink.addEventListener("click", viewHome);
window.addEventListener("new-contact", enableViewingOnContactsList);
enableViewingOnContactsList();

// Viewing chats + messages + sending messages
const CHAT_NAME_CLASS_QUERY = ".chat-name";
const MESSAGES_ID = "messages";
const messages = document.getElementById(MESSAGES_ID);

const chatViewer = new ChatViewier(KEY);
const chatManager = new ChatManager(KEY);

const getChatMessages = async _id => {
  try {
    const chatData = await ChatAPI.getChatDataFromID(_id, KEY);
    const messages = chatData.messages;
    console.log(messages);
    return messages;
  } catch (err) {
    throw new Error("Error retrieving messages");
  }
};

const viewChat = async (chat, chatRoom, chatName) => {
  const chatID = chat.getAttribute("data-id");
  chatManager.setChatRoomID(chatRoom, chatID);

  const chatNameVal = chat.querySelector(CHAT_NAME_CLASS_QUERY).innerHTML;
  chatViewer.setChatName(chatNameVal, chatName);
  slideOverChatRoom(chatRoom);

  const _messages = await getChatMessages(chatID);
  _messages.forEach(message => {
    const messageVal = message.message;

    // Tells us if the message is sent from the home user or not
    const flag = message.from === chatViewer.KEY;
    const messageElement = Message.createMessage(messageVal, flag);
    chatViewer.displayMessage(messageElement, messages);
  });
};

const chats = Array.from(document.getElementsByClassName(CHAT_CLASS));
chats.forEach(chat =>
  chat.addEventListener("click", async () => {
    await viewChat(chat, chatRoom, chatName);
  })
);

// Sending messages
const MESSAGE_CONTENT_ID = "message-content";
const SEND_BTN_ID = "send-btn";

const messageContent = document.getElementById(MESSAGE_CONTENT_ID);
const sendBtn = document.getElementById(SEND_BTN_ID);

sendBtn.addEventListener("click", () => {
  const messageContentVal = messageContent.value;
  messageContent.value = "";
  const chatID = chatManager._id;
  const messageData = MessageAPI.createMessageDataWith(
    messageContentVal,
    chatID,
    KEY
  );
  chatManager.sendMessageData(messageData);
  MessageAPI.saveMessageToDB(messageData, KEY);
  console.log(messageContentVal);
});

socket.on("message", messageData => {
  console.log(messageData);
  const { message: messageObject, chatID } = messageData;
  if (chatID === chatManager._id) {
    // Sent or recieved
    const flag = messageObject.from === chatManager.KEY;
    const message = Message.createMessage(messageObject.message, flag);
    chatManager.addMessageToChat(messages, message);
  }
});

// Back Button on Chat Room
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", () => {
  chatManager.removeChatRoomID(chatRoom);
  slideAwayChatRoom(chatRoom);
  clearChatRoomMessages(messages);
});
