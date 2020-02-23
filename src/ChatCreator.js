import ChatAPI from "./api/ChatAPI.js";
import Chat from "./components/Chat.js";

class ChatCreator {
  constructor() {
    this.ChatAPI = ChatAPI;
    this.Chat = Chat;
  }

  createChatData(homeUserId, username) {
    const chatData = this.ChatAPI.createChatDataWith(homeUserId, username);
    return chatData;
  }

  createGroupChatData(chatName, homeUserId, usernames) {
    const groupChatData = this.ChatAPI.createGroupChatDataWith(
      chatName,
      homeUserId,
      usernames
    );

    return groupChatData;
  }

  createChatRoom(chatName, id) {
    const chat = this.Chat.createChat(chatName, id);
    return chat;
  }

  getUsernamesFromUsernameField(usernameField) {
    const _usernames = usernameField.value.split(" ");
    const usernames = [...new Set(_usernames)];
    console.log(usernames);
    return usernames;
  }

  /**
   * Saves the chat room to the db
   * @param {Object} chatRoom - Chat room data returned from createChatRoom method
   * @returns {Promise<Object> | null} - returns the chat data is sucessfully saved, else null
   */
  async saveChatDataToDb(chatData, isGroup = false) {
    const saveToDbRes = await this.ChatAPI.saveChatToDb(chatData, isGroup);
    return saveToDbRes;
  }

  /**
   * Sets the id of the chat room
   * @param {string} id - id of chat room
   * @param {HTMLElement} chatRoom - chat room html element
   */
  setChatRoomID(id, chatRoom) {
    chatRoom.setAttribute("data-id", id);
  }

  addChatToChatsBody(chatsBody, chat) {
    chatsBody.prepend(chat);
  }
}

export default ChatCreator;
