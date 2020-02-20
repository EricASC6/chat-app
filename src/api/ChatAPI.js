class ChatAPI {
  static async getChatDataFromID(_id, key) {
    const chatAPI = `/chat?key=${key}&id=${_id}`;

    try {
      const chatDataRes = await fetch(chatAPI);
      if (chatDataRes.status !== 200) throw new Error("Not a 200 Response");

      const chatData = await chatDataRes.json();
      return chatData.chat;
    } catch (err) {
      throw err;
    }
  }

  static createChatDataWith(username, homeUserID) {
    const chatRoom = {
      isGroup: false,
      users: [{ _id: homeUserID }, { username: username }]
    };

    return chatRoom;
  }

  static createGroupChatDataWith(chatName, usernames, homeUserID) {
    const usernameObjects = usernames.map(username => {
      return { username: username };
    });

    const groupChat = {
      isGroup: true,
      chatName: chatName,
      users: [{ _id: homeUserID }, ...usernameObjects]
    };

    return groupChat;
  }

  static async saveChatToDB(chatData, key, isGroup = false) {
    const chatAPI = `/chat/${isGroup ? "newGroupChat" : "newChat"}?key=${key}`;
    const requestBody = JSON.stringify(chatData);

    try {
      const saveChatRes = await fetch(chatAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });

      if (saveChatRes.status !== 200) throw new Error("Not a 200 response");
      const saveChatData = await saveChatRes.json();
      return saveChatData;
    } catch (err) {
      throw err;
    }
  }
}

export default ChatAPI;
