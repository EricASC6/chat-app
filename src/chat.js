import ContactCreator from "./ContactCreator.js";
import ContactViewier from "./ContactViewer.js";
import ChatCreator from "./ChatCreator.js";

// Constants - DOM + User Id
const CREATE_CHAT_BTN_ID = "add-new-chat";
const USERNAME_FIELD_ID = "username";
const CONTACTS_LIST_ID = "contacts-list";
const CHAT_ROOM_ID = "chat-room";
const CONTACTS_TAB_ID = "contacts-tab";
const userId = new URLSearchParams(window.location.search).get("id");

// 1. Create a new contact
const createChatBtn = document.getElementById(CREATE_CHAT_BTN_ID);
console.log(createChatBtn);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);

const contactCreator = new ContactCreator(
  userId,
  createChatBtn,
  usernameField,
  contactsList
);

const createContact = async () => {
  if (!contactCreator.isReady()) return;

  try {
    const username = contactCreator.getUsername();
    const userData = await contactCreator.getUserDataFromUsername(username);
    contactCreator.addNewContactToContactsList(userData);
    contactCreator.emitNewContactEvent();
    await contactCreator.saveNewContactDataToDB(userData);
    return username;
  } catch (err) {
    console.error(err);
  }
};

// 2. Creating a new chat room and saving it to db
const chatRoom = document.getElementById(CHAT_ROOM_ID);
const chatCreator = new ChatCreator(userId, chatRoom);

const createChatRoom = async username => {
  const newChat = chatCreator.createChatRoom(username);
  const chatData = await chatCreator.saveChatRoomToDB(newChat);
  chatCreator.slideOverChatRoom();
  chatCreator.formatChatRoom(chatData);
};

createChatBtn.addEventListener("click", async () => {
  const contact = await createContact();
  if (contact) await createChatRoom(contact);
});

// Viewing the contacts
const contactsTab = document.getElementById(CONTACTS_TAB_ID);
const contactViewier = new ContactViewier(userId, contactsTab, contactsList);

const viewContact = async username => {
  const contactData = await contactViewier.retrieveContactInfo(username);
  contactViewier.displayContactInfo(contactData);
  contactViewier.slideContactsTabAway();
};

const enableViewingOnContactsList = () => {
  const contacts = Array.from(contactsList.children);
  contacts.forEach(contact =>
    contact.addEventListener("click", async () => {
      const username = contact.getAttribute("username");
      try {
        await viewContact(username);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

enableViewingOnContactsList();
window.addEventListener("new-contaact", enableViewingOnContactsList);
