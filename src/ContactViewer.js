class ContactViewer {
  /**
   * @param {string} key - ID of the home user
   * @param {HTMLElement} contactsTab - Contacts Tab containing the contacts list
   * @param {HTMLElement} contactsList - Contact list
   */
  constructor(key, contactsTab, contactsList) {
    this.KEY = key;
    this.contactsTab = contactsTab;
    this.contactsList = contactsList;
  }

  /**
   * Retrieves contact data from db
   * @param {string} username
   * @returns {Promise<Object>} - contact data retreived from database
   */
  async retrieveContactInfo(id) {
    const USER_API = `/user?key=${this.KEY}&user_id=${id}`;

    const contactDataRes = await fetch(USER_API);
    const contactData = await contactDataRes.json();
    return contactData;
  }

  /**
   * Displays the contact's bio on the home page
   * @param {Object} contactData - data returned from the retrieveContactInfo method
   */
  displayContactInfo(contactData) {
    const { firstname, lastname, bio } = contactData.contact;

    const user = document.querySelector("#main-contact-head #user");
    const contactBio = document.querySelector("#main-contact-description p");
    user.textContent = firstname + " " + lastname;
    contactBio.textContent = bio;
  }

  /**
   * Slides the contacts tab away
   */
  slideContactsTabAway() {
    this.contactsTab.classList.remove("show");
  }
}

export default ContactViewer;
