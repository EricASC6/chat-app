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

  setChatName(chatNameVal, chatName) {
    chatName.textContent = chatNameVal;
  }

  displayMessage(messages, messagesElement) {
    messagesElement.prepend(messages);
  }
}

export default ChatViewer;
