const API_KEY = "eric";

class ContactCreator {
  static API_URL = `/user?key=${API_KEY}`;
  static USERNAME_QUERY = `&username=`;
  static READY_STATE = "create-contact";

  constructor(userId, createChatBtn, usernameField, contactsList) {
    this.userId = userId;
    this.createChatBtn = createChatBtn;
    this.usernameField = usernameField;
    this.contactsList = contactsList;
  }

  /**
   * Checks if the adding chat button is in the create-contact state
   * @returns {boolean}
   */
  isReady() {
    return (
      this.createChatBtn.getAttribute("data-type") ===
      ContactCreator.READY_STATE
    );
  }

  /**
   * Gets the username of the new contact that the user wants to add
   * @returns {string}
   */
  getUsername() {
    const usernameVal = this.usernameField.value;
    console.log(usernameVal);
    if (usernameVal.length === 0) throw new Error("Missing Username");
    else return usernameVal;
  }

  /**
   * Using API to get user data from mongodb
   * @param {string} username
   * @returns {Promise} - JSON from fetching user data from api
   */
  async getUserDataFromUsername(username) {
    const userDataAPI =
      ContactCreator.API_URL + ContactCreator.USERNAME_QUERY + username;
    const userDataRes = await fetch(userDataAPI);
    const data = await userDataRes.json();
    console.log(data);
    return data;
  }

  /**
   * Adds new contact to the contacts lists
   * @param {Object} userData - user data returned by getUserDataFromUsername method
   * @returns {Object|null} - returns userData if successful else null
   */
  addNewContactToContactsList(userData) {
    if (userData.ok) {
      const { user } = userData;
      const contactsList = this.contactsList;
      const newUser = document.createElement("li");
      newUser.className = "contact";
      newUser.setAttribute("username", user.username);
      newUser.textContent = `${user.firstname} ${user.lastname}`;
      contactsList.prepend(newUser);
      console.log(user);
      return user;
    }

    return null;
  }

  /**
   * Emits new contact event
   * @returns {void}
   */
  emitNewContactEvent() {
    window.dispatchEvent(new Event("new-contact"));
  }

  /**
   * Saves the new contact to the database
   * @param {Object} userData
   * @returns {Promise<boolean>} true if request was sucessful else false
   */
  async saveNewContactDataToDB(userData) {
    console.log(userData);
    const { username, firstname, lastname, bio, _id } = userData.user;

    try {
      const saveToDBResponse = await fetch(ContactCreator.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.userId,
          newContact: {
            username: username,
            firstname: firstname,
            lastname: lastname,
            bio: bio,
            id: _id
          }
        })
      });

      const responseBody = await saveToDBResponse.json();
      if (responseBody.ok) return true;
      else return false;
    } catch (err) {
      throw err;
    }
  }
}

export default ContactCreator;
