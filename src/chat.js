import ContactViewier from "./ContactViewer.js";
import ChatViewer from "./ChatViewer.js";
import ContactCreator from "./ContactCreator.js";
import ChatCreator from "./ChatCreator.js";
import ChatManager from "./ChatManager.js";
import Chat from "./components/Chat.js";
import Contact from "./components/Contact.js";
import Message from "./components/Message.js";
import ContactAPI from "./api/ContactAPI.js";
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
const homeUserId = new URLSearchParams(window.location.search).get("id");

// Establishing Socket Connection
const socket = io(HOME_ORIGIN);

socket.on("connect", async () => {
  const homeUser = await ContactAPI.getUserDataFromId(homeUserId);
  console.log(homeUser);
  chatManager.connectToServer(socket, homeUser);
});

// 1. Create a new contact
const createChatBtn = document.getElementById(CREATE_CHAT_BTN_ID);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);

const contactCreator = new ContactCreator();

const createContact = async username => {
  try {
    console.log("Username: ", username);
    const contactData = await contactCreator.getContactDataFromUsername(
      username
    );
    console.log(contactData);
    const contact = contactCreator.createContact(contactData);
    const contactId = contactData._id;

    contactCreator.addNewContactToContactsList(contact, contactsList);
    contactCreator.emitNewContactEvent();
    await contactCreator.saveContact(homeUserId, contactId);
    return contactData;
  } catch (err) {
    throw err;
  }
};

// 2. Creating a new chat room and saving it to db
const chatRoom = document.getElementById(CHAT_ROOM_ID);
const chatIcon = document.querySelector(CHAT_ICON_QUERY);
const chatName = document.getElementById(CHAT_NAME_ID);
const chatsBody = document.getElementById(CHATS_BODY_ID);
const addChat = document.getElementById(ADD_CHAT_ID);
const groupName = document.getElementById(GROUP_NAME_FIELD_ID);

const chatCreator = new ChatCreator();

const createChatRoom = async username => {
  const chatData = chatCreator.createChatData(homeUserId, username);
  const chat = await chatCreator.saveChatDataToDb(chatData, false);
  const { chatName, fullname, _id } = chat;
  const name = chatName || fullname;
  const chatElement = chatCreator.createChatRoom(name, _id);
  return chatElement;
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
      const chat = await createChatRoom(username);
      console.log(chatRoom);
      const chatId = chat.getAttribute("data-id");
      chatManager.setChatRoomID(chatRoom, chatId);
      chatCreator.addChatToChatsBody(chatsBody, chat);
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

      const groupChatData = chatCreator.createGroupChatData(
        groupChatNameVal,
        homeUserId,
        usernames
      );

      const groupChat = await chatCreator.saveChatDataToDb(groupChatData, true);
      console.log(groupChat);
      const chatId = groupChat._id;
      const chatNameVal = groupChat.chatName;
      const chat = Chat.createChat(chatNameVal, chatId);
      chatManager.setChatRoomID(chatRoom, chatId);
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
const contactViewier = new ContactViewier();

const slideContactsTabAway = contactsTab => {
  contactsTab.classList.remove("show");
};

const viewContact = async userId => {
  const contactData = await contactViewier.retrieveContactDataFromId(userId);
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

const chatViewer = new ChatViewer();
console.log(chatViewer);
const chatManager = new ChatManager();

const getChatMessages = async id => {
  try {
    const chatData = await chatViewer.getChatDataFromId(id);
    console.log(chatData);
    const messages = chatData.messages;
    console.log(messages);
    return messages;
  } catch (err) {
    console.error(err);
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
    console.log(messageVal);

    // Tells us if the message is sent from the home user or not
    const flag = message.from === homeUserId;
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
    homeUserId
  );
  chatManager.sendMessageData(messageData);
  MessageAPI.saveMessageToDB(messageData, chatID);
  console.log(messageContentVal);
});

socket.on("message", messageData => {
  console.log("Message");
  console.log(messageData);
  const { message: messageObject, chatId } = messageData;
  if (chatId === chatManager._id) {
    // Sent or recieved
    const flag = messageObject.from === homeUserId;
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
