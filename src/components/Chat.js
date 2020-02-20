class Chat {
  static createChat(chatName, _id) {
    const chat = document.createElement("div");
    const chatsContainer = document.createElement("div");
    const chatNameHeader = document.createElement("h3");
    const recentMessages = document.createElement("p");
    const caret = document.createElement("div");

    chat.className = "chat";
    chatsContainer.className = "chat-container";
    chatNameHeader.className = "chat-name";
    recentMessages.className = "most-recent-message";
    caret.className = "caret";

    chat.setAttribute("data-id", _id);

    chatNameHeader.textContent = chatName;
    recentMessages.textContent = "Start a conservation";
    caret.innerHTML = "<i class='fas fa-chevron-up' aria-hidden='true'></i>";

    chatsContainer.appendChild(chatNameHeader);
    chatsContainer.appendChild(recentMessages);
    chat.appendChild(chatsContainer);
    chat.appendChild(caret);
    return chat;
  }
}

export default Chat;
