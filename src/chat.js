import ContactViewier from "./ContactViewer.js";
import ChatViewier from "./ChatViewer.js";
import ContactCreator from "./ContactCreator.js";
import ChatCreator from "./ChatCreator.js";
import ChatManager from "./ChatManager.js";
import Chat from "./components/Chat.js";
import Contact from "./components/Contact.js";
import Message from "./components/Message.js";
import UserAPI from "./api/UserAPI.js";

// Constants - DOM + User Id
const CREATE_CHAT_BTN_ID = "add-new-chat";
const USERNAME_FIELD_ID = "username";
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

// Establishing Socket Connection
const socket = io(HOME_ORIGIN);

socket.on("connect", async () => {
  const homeUserData = await UserAPI.getUserData(KEY, KEY);
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
    const userData = await contactCreator.getUserDataFromUsername(username);
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
    const username = usernameField.value;
    console.log(username);
    const contact = await createContact(username);
    console.log(contact);
    const chatData = await createChatRoom(contact._id);
    console.log(chatData);

    const chatID = chatData._id;
    const chatName = contact.fullname;
    const chat = Chat.createChat(chatName, chatID);

    chatCreator.setChatRoomID(chatID, chatRoom);
    chatCreator.addChatToChatsBody(chatsBody, chat);
    slideOverChatRoom(chatRoom);
    formatChatRoom(contact);
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
    const chatData = await chatViewer.getChatData(_id);
    const messages = chatData.chat.messages;
    return messages;
  } catch (err) {
    return null;
  }
};

const viewChat = async (chat, chatRoom, chatName) => {
  const chatID = chat.getAttribute("data-id");
  chatManager.setChatRoomID(chatRoom, chatID);

  const chatNameVal = chat.querySelector(CHAT_NAME_CLASS_QUERY).innerHTML;
  chatViewer.setChatName(chatNameVal, chatName);
  slideOverChatRoom(chatRoom);

  const _messages = await getChatMessages(chatID);
  console.log("messages ", _messages);

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
  chat.addEventListener("click", async evnt => {
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
  chatManager.sendMessage(messageContentVal);
  chatManager.saveMessage(messageContentVal);
  console.log(messageContentVal);
});

socket.on("message", messageData => {
  const { message: messageVal, from, chatID } = messageData;
  if (chatID === chatManager._id) {
    // Sent or recieved
    const flag = from === chatManager.KEY;
    const message = Message.createMessage(messageVal, flag);
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
