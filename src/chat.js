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
const KEY = new URLSearchParams(window.location.search).get("id");

// 1. Create a new contact
const createChatBtn = document.getElementById(CREATE_CHAT_BTN_ID);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);

const contactCreator = new ContactCreator(KEY);

const createContact = async () => {
  if (!contactCreator.isReady(createChatBtn)) return;

  try {
    const username = contactCreator.getUsername(usernameField);
    const userData = await contactCreator.getUserDataFromUsername(username);
    contactCreator.addNewContactToContactsList(userData, contactsList);
    contactCreator.emitNewContactEvent();
    await contactCreator.saveNewContactDataToDB(userData);
    return username;
  } catch (err) {
    console.error(err);
  }
};

// 2. Creating a new chat room and saving it to db
const chatRoom = document.getElementById(CHAT_ROOM_ID);
const chatCreator = new ChatCreator(KEY, chatRoom);

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
