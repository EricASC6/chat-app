class ChatViewer {
  constructor(key) {
    this.KEY = key;
  }

  async getChatData(_id) {
    try {
      const chatAPI = `/chat?key=${this.KEY}&id=${_id}`;
      const chatResponse = await fetch(chatAPI);
      const chatData = await chatResponse.json();
      return chatData;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  displayMessages(messages, messagesElement) {
    messages.forEach(message => {
      console.log(message.from, this.KEY);
      const messageElem = document.createElement("div");
      const messageValue = document.createElement("div");
      messageElem.className =
        "message " + (message.from === this.KEY ? "home" : "away");
      messageValue.className = "message-value";
      messageValue.textContent = message.message;
      messageElem.appendChild(messageValue);
      messagesElement.prepend(messageElem);
    });
  }
}

export default ChatViewer;
