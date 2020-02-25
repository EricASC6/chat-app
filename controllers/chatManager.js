class ChatManager {
  constructor() {
    this.online = [];
  }

  addUserOnline(user, socketID) {
    const onlineUser = {
      ...user,
      socketID: socketID
    };
    this.online.push(onlineUser);
    console.log("Online User Connected: ", this.online);
  }

  removeUserFromOnline(socketID) {
    this.online = this.online.filter(
      onlineUser => onlineUser.socketID !== socketID
    );

    console.log("Online User Disconnected: ", this.online);
  }

  getOnlineUsersFromSameChat(messageData) {
    const { chatId } = messageData;
    const clients = this.online.filter(onlineUser =>
      onlineUser.chats.includes(chatId)
    );
    return clients;
  }

  getSocketIDsFromUsers(users) {
    const socketIDs = users.map(user => user.socketID);
    return socketIDs;
  }
}

module.exports = new ChatManager();
