class Message {
  static createMessageDataWith(message, homeUserID) {
    const messageData = {
      _id: homeUserID,
      message: {
        from: homeUserID,
        message: message
      }
    };

    return messageData;
  }

  static async saveMessageToDB(messageData, key) {
    const messageAPI = `chat/newMessage?key=${key}`;
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
