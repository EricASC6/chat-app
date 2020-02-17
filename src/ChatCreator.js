class ChatCreator {
  static NEW_CHAT_API = `/user/newChat`;

  /**
   * @param {string} userId - id of the home user
   * @param {HTMLElement} chatRoom - chat room of the app
   */
  constructor(key) {
    this.KEY = key;
  }

  /**
   * Creates the body of a POST request to create chat room from username
   * @param {string} username - username of the other chat user
   */
  createChatRoom(username) {
    const chatRequestBody = {
      id: this.userId,
      newContactUsername: username,
      isGroup: false
    };

    return chatRequestBody;
  }

  /**
   * Saves the chat room to the db
   * @param {Object} chatRoom - Chat room data returned from createChatRoom method
   * @returns {Promise<Object> | null} - returns the chat data is sucessfully saved, else null
   */
  async saveChatRoomToDB(chatRoom) {
    const newChatResponse = await fetch(ChatCreator.NEW_CHAT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chatRoom)
    });

    const chatData = await newChatResponse.json();
    if (chatData.ok) return chatData;
    else return null;
  }

  slideOverChatRoom() {
    this.chatRoom.classList.add("show");
  }

  /**
   * Formats the chat room based on the chat data
   * @param {Object} chatData
   */
  formatChatRoom(chatData) {
    const { chat, contact } = chatData;
    const { firstname, lastname } = contact;

    const chatIcon = this.chatRoom.querySelector("#chat-contact-icon p");
    const contactName = this.chatRoom.querySelector("#contact-name");

    this.chatRoom.setAttribute("data-id", chat._id);
    chatIcon.innerHTML = firstname[0] + lastname[0];
    contactName.innerHTML = firstname + " " + lastname;
  }
}

export default ChatCreator;
