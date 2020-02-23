import ContactAPI from "./api/ContactAPI.js";
import Contact from "./components/Contact.js";

class ContactCreator {
  static READY_STATE = "create-chat";

  constructor() {
    this.ContactAPI = ContactAPI;
    this.Contact = Contact;
  }

  /**
   * Checks if the adding chat button is in the create-contact state
   * @param { HTMLElement } createChatBtn - button used to create a new chat
   * @returns {boolean}
   */
  isReady(createChatBtn) {
    return (
      createChatBtn.getAttribute("data-type") === ContactCreator.READY_STATE
    );
  }

  async getContactDataFromUsername(username) {
    const contactData = await this.ContactAPI.getUserDataFromUsername(username);
    return contactData;
  }

  createContact(contactData) {
    const contact = this.Contact.createContact(contactData);
    return contact;
  }

  addNewContactToContactsList(contact, contactsList) {
    contactsList.prepend(contact);
  }

  async saveContact(homeUserId, contactId) {
    const saveContactToDb = await this.ContactAPI.saveContactToDb(
      homeUserId,
      contactId
    );

    return saveContactToDb;
  }

  /**
   * Emits new contact event
   * @returns {void}
   */
  emitNewContactEvent() {
    window.dispatchEvent(new Event("new-contact"));
  }
}

export default ContactCreator;
