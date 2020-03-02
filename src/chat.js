import ContactViewer from "./ContactViewer.js";
import ChatViewer from "./ChatViewer.js";
import ContactCreator from "./ContactCreator.js";
import ChatCreator from "./ChatCreator.js";
import ChatManager from "./ChatManager.js";
import Message from "./components/Message.js";

// Constants - DOM + User Id
const CREATE_CHAT_BTN_ID = "add-new-chat";
const ADD_CHAT_ID = "add-chat";
const USERNAME_FIELD_ID = "username";
const GROUP_NAME_FIELD_ID = "group-name";
const CONTACTS_LIST_ID = "contacts-list";
const CHAT_ROOM_ID = "chat-room";
const CONTACTS_TAB_ID = "contacts-tab";
const CONTACT_ABOUT_ID = "main-contact-about";
const CHAT_ICON_QUERY = "#chat-contact-icon p";
const CHAT_NAME_ID = "chat-name";
const CHAT_CLASS = "chat";
const CHATS_BODY_ID = "chats-body";
const HOME_ORIGIN = window.location.origin;
const homeUserId = new URLSearchParams(window.location.search).get("id");
let homeUser = null;

// Establishing Socket Connection
const socket = io(HOME_ORIGIN);

socket.on("connect", async () => {
  homeUser = await contactViewer.retrieveContactDataFromId(homeUserId);
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

const slideOverChatRoom = chatRoom => {
  chatRoom.classList.add("show");
};

const slideAwayChatRoom = chatRoom => {
  chatRoom.classList.remove("show");
};

const clearChatRoomMessages = chatRoomMessages => {
  chatRoomMessages.innerHTML = "";
};

const createChat = async () => {
  const username = usernameField.value;
  const contact = await createContact(username);
  const chat = await createChatRoom(username);
  const chatId = chat.getAttribute("data-id");
  const chatNameVal = contact.fullname;
  chatName.innerHTML = chatNameVal;
  chat.querySelector(".chat-name").innerHTML = chatNameVal;
  chatManager.setChatRoomID(chatRoom, chatId);
  chatCreator.addChatToChatsBody(chatsBody, chat);
};

const createGroupChat = async () => {
  const groupChatNameVal = groupName.value;
  const usernames = chatCreator.getUsernamesFromUsernameField(usernameField);

  const userContacts = [...contactsList.children].map(contact =>
    contact.getAttribute("username")
  );

  usernames.forEach(async username => {
    if (!userContacts.includes(username)) await createContact(username);
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
  const chat = chatCreator.createChatRoom(chatNameVal, chatId);
  chatManager.setChatRoomID(chatRoom, chatId);
  chatCreator.addChatToChatsBody(chatsBody, chat);

  chatName.innerHTML = chatNameVal;

  console.log("Success");
};

createChatBtn.addEventListener("click", async () => {
  if (!contactCreator.isReady(createChatBtn)) return;

  try {
    const chatType = addChat.getAttribute("data-type");
    if (chatType === "conversation") {
      await createChat();
    } else if (chatType === "group-chat") {
      await createGroupChat();
    }

    addChat.classList.remove("show");
    slideOverChatRoom(chatRoom);
  } catch (err) {
    console.error(err);
  }
});

// Viewing the contacts
const contactAbout = document.getElementById(CONTACT_ABOUT_ID);
const contactsTab = document.getElementById(CONTACTS_TAB_ID);
const contactViewer = new ContactViewer();

const slideContactsTabAway = contactsTab => {
  contactsTab.classList.remove("show");
};

const viewContact = async userId => {
  const contactData = await contactViewer.retrieveContactDataFromId(userId);
  contactAbout.style.display = "block";
  contactViewer.displayContactInfo(contactData);
  slideContactsTabAway(contactsTab);
};

const viewChatsWithContact = userId => {
  chats.forEach(chat => {
    const usersInChat = chat.getAttribute("data-users").split(",");
    if (usersInChat.includes(userId)) chat.style.display = "flex";
    else chat.style.display = "none";
  });
};

const enableViewingOnContactsList = () => {
  const contacts = Array.from(contactsList.children).filter(child => !child.id);
  contacts.forEach(contact =>
    contact.addEventListener("click", async () => {
      const userId = contact.getAttribute("data-id");
      try {
        await viewContact(userId);
        viewChatsWithContact(userId);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

window.addEventListener("new-contact", enableViewingOnContactsList);
enableViewingOnContactsList();

// Viewing chats + messages + sending messages
const CHAT_NAME_CLASS_QUERY = ".chat-name";
const MESSAGES_ID = "messages";
const messages = document.getElementById(MESSAGES_ID);

const chatViewer = new ChatViewer();
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
  const chatId = chat.getAttribute("data-id");
  chatManager.setChatRoomID(chatRoom, chatId);

  const chatNameVal = chat.querySelector(CHAT_NAME_CLASS_QUERY).innerHTML;
  chatViewer.setChatName(chatNameVal, chatName);
  slideOverChatRoom(chatRoom);

  const _messages = await getChatMessages(chatId);
  _messages.forEach(message => {
    const messageVal = message.message;
    console.log(messageVal);

    // Tells us if the message is sent from the home user or not
    const flag = message.from === homeUserId;
    const messageElement = chatManager.createMessage(messageVal, flag);
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
  const chatId = chatManager._id;
  const messageData = chatManager.createMessageData(
    messageContentVal,
    chatId,
    homeUserId,
    homeUser.fullname
  );
  chatManager.sendMessageData(messageData);
  chatManager.saveMessage(messageData, chatId);
  console.log(messageContentVal);
});

socket.on("message", messageData => {
  console.log("Message");
  console.log(messageData);
  const { message: messageObject, chatId } = messageData;
  console.log(messageObject);
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

// Viewing Home
const HOME_VIEW_ID = "home-view";
const homeView = document.getElementById(HOME_VIEW_ID);

homeView.addEventListener("click", () => {
  contactAbout.style.display = "none";
  chats.forEach(chat => (chat.style.display = "flex"));
  slideContactsTabAway(contactsTab);
});
