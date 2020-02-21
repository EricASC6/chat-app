import ContactAPI from "./api/ContactAPI.js";

class ContactManager {
  static READY_STATE = "create-chat";

  constructor() {
    this.ContactAPI = ContactAPI;
  }

  /**
   * Checks if the adding chat button is in the create-contact state
   * @param { HTMLElement } createChatBtn - button used to create a new chat
   * @returns {boolean}
   */
  isReady(createChatBtn) {
    return (
      createChatBtn.getAttribute("data-type") === ContactManager.READY_STATE
    );
  }

  addNewContactToContactsList(contactsList, contact) {
    contactsList.prepend(contact);
  }

  /**
   * Emits new contact event
   * @returns {void}
   */
  emitNewContactEvent() {
    window.dispatchEvent(new Event("new-contact"));
  }
}

export default ContactManager;
