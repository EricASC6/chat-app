import ContactAPI from "./api/ContactAPI.js";

class ContactViewer {
  constructor() {
    this.ContactAPI = ContactAPI;
  }

  /**
   * Retrieves contact data from db
   * @param {string} username
   * @returns {Promise<Object>} - contact data retreived from database
   */
  async retrieveContactDataFromId(id) {
    const contactData = await this.ContactAPI.getUserDataFromId(id);
    return contactData;
  }

  /**
   * Displays the contact's bio on the home page
   * @param {Object} contactData - data returned from the retrieveContactInfo method
   */
  displayContactInfo(contactData) {
    const { fullname, bio } = contactData;
    const user = document.querySelector("#main-contact-head #user");
    const contactBio = document.querySelector("#main-contact-description p");
    user.textContent = fullname;
    contactBio.textContent = bio;
  }
}

export default ContactViewer;
