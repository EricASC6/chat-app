import ChatAPI from "./api/ChatAPI.js";

class ChatViewer {
  constructor() {
    this.ChatAPI = ChatAPI;
  }

  async getChatDataFromId(id) {
    const chatData = await this.ChatAPI.getChatDataFromId(id);
    return chatData;
  }

  setChatName(chatNameVal, chatName) {
    chatName.textContent = chatNameVal;
  }

  displayMessage(messages, messagesElement) {
    messagesElement.prepend(messages);
  }
}

export default ChatViewer;
