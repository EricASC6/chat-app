import ContactCreator from "./ContactCreator.js";
import ContactViewier from "./ContactViewer.js";

// 1. Create a new contact
const CREATE_CONTACT_BTN_ID = "add-new-chat";
const USERNAME_FIELD_ID = "username";
const CONTACTS_LIST_ID = "contacts-list";
const CHAT_ROOM_ID = "chat-room";

const userId = new URLSearchParams(window.location.search).get("id");
const createContactBtn = document.getElementById(CREATE_CONTACT_BTN_ID);
const usernameField = document.getElementById(USERNAME_FIELD_ID);
const contactsList = document.getElementById(CONTACTS_LIST_ID);
const chatRoom = document.getElementById(CHAT_ROOM_ID);

const contactCreator = new ContactCreator(
  userId,
  createContactBtn,
  usernameField,
  contactsList,
  chatRoom
);

const createContact = async () => {
  if (!contactCreator.isReady()) return;

  try {
    const username = contactCreator.getUsername();
    const userData = await contactCreator.getUserDataFromUsername(username);
    contactCreator.addNewContactToContactsList(userData);
    contactCreator.emitNewContactEvent();
    await contactCreator.saveNewContactDataToDB(userData);
    contactCreator.slideOverChatRoom();
  } catch (err) {
    console.error(err);
  }
};

createContactBtn.addEventListener("click", async () => {
  createContact();
});

// Viewing the contacts
const CONTACTS_TAB_ID = "contacts-tab";

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
