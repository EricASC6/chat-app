class ChatManager {
  static url = window.location.pathname + window.location.search;

  constructor(key) {
    this.KEY = key;
    this.socket = null;
    this._id = null;
  }

  connectToServer() {
    this.socket = io("/home");
    return this.socket;
  }

  setChatRoomID(chatRoom, _id) {
    this._id = _id;
    chatRoom.setAttribute("data-id", _id);
  }

  removeChatRoomID(chatRoom) {
    this._id = null;
    chatRoom.setAttribute("data-id", null);
  }

  createMessage(_messageValue, sentFromHomeUser = true) {
    const message = document.createElement("div");
    const messageValue = document.createElement("div");

    message.className = "message home";
    messageValue.className = "message-value";
    messageValue.textContent = _messageValue;
    message.appendChild(messageValue);

    return message;
  }

  async saveMessageToChat(message) {
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
