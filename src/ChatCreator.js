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
}

export default ChatCreator;
