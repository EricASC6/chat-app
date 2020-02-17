class ContactCreator {
  static READY_STATE = "create-contact";

  constructor(key) {
    this.KEY = key;
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

  /**
   * Gets the username of the new contact that the user wants to add
   * @param { HTMLElement } usernameField - Username input field
   * @returns {string}
   */
  getUsername(usernameInput) {
    const usernameVal = usernameInput.value;
    console.log("Username: ", usernameVal);
    if (usernameVal.length === 0) throw new Error("Missing Username");
    else return usernameVal;
  }

  /**
   * Using API to get user data from mongodb
   * @param {string} username
   * @returns {Promise} - JSON from fetching user data from api
   */
  async getUserDataFromUsername(username) {
    const userDataAPI = `/user?key=${this.KEY}&username=${username}`;
    const userDataRes = await fetch(userDataAPI);
    const data = await userDataRes.json();

    if (data.ok) return data.userData;
    else throw new Error("Something went wrong");
  }

  /**
   * Adds new contact to the contacts lists
   * @param {Object} userData - user data returned by getUserDataFromUsername method
   * @returns {Object|null} - returns userData if successful else null
   */
  addNewContactToContactsList(userData, contactsList) {
    const { fullname, _id } = userData;
    const newUser = document.createElement("li");
    newUser.className = "contact";
    newUser.setAttribute("data-id", _id);
    newUser.textContent = fullname;
    contactsList.prepend(newUser);
    return user;
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
    const { _id } = userData;
    const saveContactToDBAPI = `/user/newContact?key=${this.KEY}`;

    try {
      const saveToDBResponse = await fetch(saveContactToDBAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: _id
        })
      });

      const responseBody = await saveToDBResponse.json();
      if (responseBody.ok) {
        console.log(responseBody.message);
        return true;
      } else return false;
    } catch (err) {
      throw err;
    }
  }
}

export default ContactCreator;
