class ChatManager {
  static url = window.location.pathname + window.location.search;

  constructor(key) {
    this.KEY = key;
    this.socket = null;
    this._id = null; // data-id of the chatroom
  }

  connectToServer(socket, user) {
    this.socket = socket;
    socket.emit("online", user);
  }

  setChatRoomID(chatRoom, _id) {
    this._id = _id;
    chatRoom.setAttribute("data-id", _id);
  }

  removeChatRoomID(chatRoom) {
    this._id = null;
    chatRoom.setAttribute("data-id", null);
  }

  addMessageToChat(chatRoomMessages, message) {
    chatRoomMessages.appendChild(message);
  }

  sendMessage(message) {
    const messageData = {
      chatID: this._id,
      from: this.KEY,
      message: message
    };

    this.socket.emit("message", messageData);
  }

  async saveMessage(message) {
    const saveMessageAPI = `chat/newMessage?key=${this.KEY}`;
    const body = {
      _id: this._id,
      message: {
        from: this.KEY,
        message: message
      }
    };

    const saveResponse = await fetch(saveMessageAPI, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const response = await saveResponse.json();
    return response;
  }
}

export default ChatManager;
