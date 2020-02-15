const API_KEY = "eric";

/**
 * Checks if the adding chat button is in the create-contact state
 * @returns {boolean}
 */
const isCreateContact = () => {
  return addChatBtn.getAttribute("data-type") === "create-contact";
};

/**
 * Gets the username of the new contact that the user wants to add
 * @returns {string}
 */
const getUsername = () => {
  const usernameVal = document.getElementById("username").value.trim();
  console.log(usernameVal);
  if (usernameVal.length === 0) throw new Error("Missing Username");
  else return usernameVal;
};

/**
 * Using API to get user data from mongodb
 * @param {string} username
 * @returns {Promise} - JSON from fetching user data from api
 */
const getUserDataFromUsername = async username => {
  const GET_URL = `/user?key=${API_KEY}&username=${username}`;
  const request = await fetch(GET_URL);
  const data = await request.json();
  console.log(data);
  return data;
};

/**
 * Adds new contact to the contacts lists
 * @param {Object} userData
 * @returns {Object|null} - returns userData if successful else null
 */
const addNewContactToContactsList = userData => {
  if (userData.ok) {
    const { user } = userData;
    const contactList = document.getElementById("contacts-list");
    const newUser = document.createElement("li");
    newUser.className = "contact";
    newUser.setAttribute("username", user.username);
    newUser.textContent = `${user.firstname} ${user.lastname}`;
    contactList.prepend(newUser);
    console.log(user);
    return user;
  }

  return null;
};

/**
 * Emits new contact event
 * @returns {void}
 */
const emitNewContactEvent = () => {
  window.dispatchEvent(new Event("new-contact"));
};

/**
 * Saves the new contact to the database
 * @param {Object} userData
 * @returns {Promise<boolean>} true if request was sucessful else false
 */
const saveNewContactDataToDB = async userData => {
  const id = new URLSearchParams(window.location.search).get("id");
  const POST_URL = `/user?key=${API_KEY}`;
  console.log(userData);
  const { username, firstname, lastname, bio, _id } = userData.user;

  try {
    const saveToDBResponse = await fetch(POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
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
};

/**
 * Slides over the chatroom
 */
const slideOverChatRoom = () => {
  const chatRoom = document.getElementById("chat-room");
  chatRoom.classList.add("show");
};

/**
 * Creates a new contact - eventlistener to addChatBtn click event
 *
 */
const createNewContact = async () => {
  if (!isCreateContact()) return null;

  try {
    const username = getUsername();
    const userData = await getUserDataFromUsername(username);
    addNewContactToContactsList(userData);
    await saveNewContactDataToDB(userData);
    emitNewContactEvent();
    slideOverChatRoom();
    return userData._id;
  } catch (err) {
    console.error(err);
  }
};

// Add New Chat + User Request -> Creates a new contact
addChatBtn.addEventListener("click", async () => {
  await createNewContact();
});
