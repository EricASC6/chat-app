import ContactCreator from "./ContactCreator.js";
import ContactViewier from "./ContactViewer.js";
import ChatCreator from "./ChatCreator.js";

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
const KEY = new URLSearchParams(window.location.search).get("id");

// 1. Create a new contact
const createChatBtn = document.getElementById(CREATE_CHAT_BTN_ID);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);

const contactCreator = new ContactCreator(KEY);

const createContact = async username => {
  try {
    console.log("Username: ", username);
    const userData = await contactCreator.getUserDataFromUsername(username);
    contactCreator.addNewContactToContactsList(userData, contactsList);
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

const chatCreator = new ChatCreator(KEY, chatRoom);

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
    chatCreator.setChatRoomID(chatID, chatRoom);
    chatCreator.addChatRoomToChatsBody(chatID, chatName, chatsBody);
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

// Viewing chats + messages
const chats = Array.from(document.getElementsByClassName(CHAT_CLASS));
chats.forEach(chat =>
  chat.addEventListener("click", () => {
    slideOverChatRoom(chatRoom);
  })
);
