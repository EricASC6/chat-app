class ChatCreator {
  /**
   * @param {string} userId - id of the home user
   * @param {HTMLElement} chatRoom - chat room of the app
   */
  constructor(key) {
    this.KEY = key;
  }

  /**
   * Creates the body of a POST request to create chat room with user id
   * @param {string} id - ObjectId of an user
   */
  createChatRoom(id) {
    const chatRoomRequest = {
      users: [{ _id: this.KEY }, { _id: id }]
    };

    return chatRoomRequest;
  }

  /**
   * Saves the chat room to the db
   * @param {Object} chatRoom - Chat room data returned from createChatRoom method
   * @returns {Promise<Object> | null} - returns the chat data is sucessfully saved, else null
   */
  async saveChatRoomToDB(chatRoom) {
    const newChatAPI = `/chat/newChat?key=${this.KEY}`;
    const newChatResponse = await fetch(newChatAPI, {
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

  /**
   * Sets the id of the chat room
   * @param {string} id - id of chat room
   * @param {HTMLElement} chatRoom - chat room html element
   */
  setChatRoomID(id, chatRoom) {
    chatRoom.setAttribute("data-id", id);
  }

  addChatRoomToChatsBody(_id, chatName, chatsBody) {
    const chat = document.createElement("div");
    const chatsContainer = document.createElement("div");
    const chatNameHeader = document.createElement("h3");
    const recentMessages = document.createElement("p");
    const caret = document.createElement("div");

    chat.className = "chat";
    chat.setAttribute("data-id", _id);

    chatsContainer.className = "chat-container";

    chatNameHeader.className = "chat-name";
    chatNameHeader.textContent = chatName;

    recentMessages.className = "most-recent-message";
    recentMessages.textContent = "Start a conservation";

    caret.className = "caret";
    caret.innerHTML = "<i class='fas fa-chevron-up' aria-hidden='true'></i>";

    chatsContainer.appendChild(chatNameHeader);
    chatsContainer.appendChild(recentMessages);
    chat.appendChild(chatsContainer);
    chat.appendChild(caret);
    chatsBody.prepend(chat);
  }
}

export default ChatCreator;
