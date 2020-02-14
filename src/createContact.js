const API_KEY = "eric";

const createNewContact = async () => {
  if (addChatBtn.getAttribute("data-type") !== "go") return null;

  const username = document.getElementById("username");
  if (username.value.length === 0) console.log("Need an username");

  const GET_URL = `/user?key=${API_KEY}&username=${username.value}`;

  const request = await fetch(GET_URL);
  const data = await request.json();
  console.log(data);

  if (data.ok) {
    // Add the new contact to the contact list
    const { user } = data;
    const contactList = document.getElementById("contacts-list");
    const newUser = document.createElement("li");
    newUser.className = "contact";
    newUser.setAttribute("username", user.username);
    newUser.textContent = `${user.firstname} ${user.lastname}`;
    contactList.prepend(newUser);

    // Emit new-contact event to add eventlisteners to contacts
    window.dispatchEvent(new Event("new-contact"));

    const chatRoom = document.getElementById("chat-room");
    chatRoom.classList.add("show");
    console.log(chatRoom);

    // Send a POST Request to Db to store contact
    const id = new URLSearchParams(window.location.search).get("id");
    const POST_URL = `/user?key=${API_KEY}`;

    fetch(POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        newContact: {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          bio: user.bio,
          id: user._id
        }
      })
    }).then(() => console.log("asdkjhkasj"));
  }
  return null;
};

// Add New Chat + User Request -> Creates a new contact
addChatBtn.addEventListener("click", async () => {
  const id = await createNewContact();
  console.log(id);
});
