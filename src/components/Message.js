class Message {
  static createMessage(messageContent, sentFromHomeUser = true) {
    const message = document.createElement("div");
    const messageContentElement = document.createElement("div");

    // Class depending on if the message was sent from the home user or not
    const flag = sentFromHomeUser ? "home" : "away";

    message.className = `message ${flag}`;
    messageContentElement.className = "message-value";
    messageContentElement.textContent = messageContent;
    message.appendChild(messageContentElement);
    return message;
  }
}

export default Message;
