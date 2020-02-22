class MessageAPI {
  static createMessageDataWith(message, chatId, homeUserId) {
    const messageData = {
      chatId: chatId,
      message: {
        from: homeUserId,
        message: message
      }
    };

    return messageData;
  }

  static async saveMessageToDB(messageData, chatId) {
    const messageAPI = `chat/newMessage/${chatId}`;
    const requestBody = JSON.stringify(messageData);

    try {
      const saveMessageRes = await fetch(messageAPI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });

      if (saveMessageRes.status !== 200) throw new Error("Not a 200 response");
      const saveMessageData = await saveMessageRes.json();

      return saveMessageData;
    } catch (err) {
      throw err;
    }
  }
}

export default MessageAPI;
