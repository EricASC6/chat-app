class ContactViewer {
  /**
   * @param {string} key - ID of the home user
   */
  constructor(key) {
    this.KEY = key;
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
    console.log("Contact Data: ", contactData);
    return contactData;
  }

  /**
   * Displays the contact's bio on the home page
   * @param {Object} contactData - data returned from the retrieveContactInfo method
   */
  displayContactInfo(contactData) {
    const { fullname, bio } = contactData.userData;
    const user = document.querySelector("#main-contact-head #user");
    const contactBio = document.querySelector("#main-contact-description p");
    user.textContent = fullname;
    contactBio.textContent = bio;
  }
}

export default ContactViewer;
