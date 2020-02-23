import MessageAPI from "./api/MessageAPI.js";
import Message from "./components/Message.js";

class ChatManager {
  constructor() {
    this.socket = null;
    this._id = null; // data-id of the chatroom
    this.Message = Message;
    this.MessageAPI = MessageAPI;
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

  createMessage(message, sentFromHomeUser = true) {
    const messageElement = this.Message.createMessage(
      message,
      sentFromHomeUser
    );
    return messageElement;
  }

  createMessageData(message, chatId, homeUserId) {
    const messageData = this.MessageAPI.createMessageDataWith(
      message,
      chatId,
      homeUserId
    );
    return messageData;
  }

  addMessageToChat(chatRoomMessages, message) {
    chatRoomMessages.appendChild(message);
  }

  sendMessageData(messageData) {
    console.log(messageData);
    this.socket.emit("message", messageData);
  }

  async saveMessage(messageData, chatId) {
    const saveToDbRes = await this.MessageAPI.saveMessageToDB(
      messageData,
      chatId
    );
    return saveToDbRes;
  }
}

export default ChatManager;
