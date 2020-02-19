class Message {
  static createMessage(messageContent, sentFromHomeUser = true) {
    const message = document.createElement("div");
    const messageContentElement = document.createElement("div");

    message.className = "message home";
    messageContentElement.className = "message-value";
    messageContentElement.textContent = messageContent;
    message.appendChild(messageContentElement);
    return message;
  }
}
