const API_KEY = "eric";

class ContactViewer {
  static CONTACT_INFO_API = `/user?key=${API_KEY}`;
  static USERNAME_QUERY = `&username=`;
  static ID_QUERY = `&id=`;

  /**
   * @param {string} userId - ID of the home user
   * @param {HTMLElement} contactsList - Contact list
   */
  constructor(userId, contactsTab, contactsList) {
    this.userId = userId;
    this.contactsTab = contactsTab;
    this.contactsList = contactsList;
  }

  /**
   * Retrieves contact data from db
   * @param {string} username
   * @returns {Promise<Object>} - contact data retreived from database
   */
  async retrieveContactInfo(username) {
    const contactUserAPI =
      ContactViewer.CONTACT_INFO_API +
      ContactViewer.USERNAME_QUERY +
      username +
      ContactViewer.ID_QUERY +
      this.userId;

    const contactDataRes = await fetch(contactUserAPI);
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

  slideContactsTabAway() {
    this.contactsTab.classList.remove("show");
  }
}

export default ContactViewer;
