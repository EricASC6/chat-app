// Hamburger Effect
const hamburger = document.getElementById("hamburger");
const contactsTab = document.getElementById("contacts-tab");

hamburger.addEventListener("click", () => {
  contactsTab.classList.toggle("show");
});

// Add Contact Popup Effect
const addChatBtn = document.getElementById("add-new-chat");
const addChatTab = document.getElementById("add-chat");
const cancelChatBtn = document.getElementById("cancel-btn");

// Add / Arrows Sign
const addSign = `<i class="fas fa-plus"></i>`;
const goArrowSign = `<i class="fas fa-arrow-right"></i>`;

addChatBtn.addEventListener("click", function() {
  if (!addChatTab.classList.contains("show")) {
    addChatTab.classList.add("show");
    this.innerHTML = goArrowSign;

    addChatTab.addEventListener("transitionend", () =>
      this.setAttribute("data-type", "create-contact")
    );
  }
});

cancelChatBtn.addEventListener("click", function() {
  addChatTab.classList.remove("show");
  addChatBtn.innerHTML = addSign;

  addChatTab.addEventListener("transitionend", () =>
    addChatBtn.setAttribute("data-type", "add-contact")
  );
});

// Sizing the chat room body
const chatRoomHead = document.getElementById("chat-room-head");
const chatRoomBody = document.getElementById("chat-room-body");
const chatRoomSend = document.getElementById("chat-room-send");

const chatRoomSendStyles = window.getComputedStyle(chatRoomSend);
const chatRoomSendHeight = chatRoomSendStyles.height;
const chatRoomSendMarginBottom = chatRoomSendStyles.marginBottom;

const chatRoomHeadHeight = window.getComputedStyle(chatRoomHead).height;
chatRoomBody.style.height = `calc(100vh - ${chatRoomHeadHeight} - ${chatRoomSendHeight} - ${chatRoomSendMarginBottom})`;

// Chat Type Options Popup
const chatCaret = document.querySelector("#chat-type .caret");
const chatTypeOptions = document.getElementById("chat-type-options");

const toggleChatOptions = () => {
  chatCaret.classList.toggle("rotate");
  chatTypeOptions.classList.toggle("show");
};

chatCaret.addEventListener("click", () => {
  chatCaret.classList.toggle("rotate");
  chatTypeOptions.classList.toggle("show");
});

// Changing the state of the chat -> group-chat vs conversation
const currentType = document.getElementById("current-type");
const option = document.querySelector("#chat-type-options .type");
const groupField = document.getElementById("group");

const changeStateOfChatType = (currentType, optionType) => {
  const temp = currentType.innerHTML;
  currentType.innerHTML = optionType.innerHTML;
  optionType.innerHTML = temp;
  return currentType.innerHTML;
};

option.addEventListener("click", function() {
  toggleChatOptions();
  const type = changeStateOfChatType(currentType, this);
  if (type === "New Groupchat") {
    addChatTab.setAttribute("data-type", "group-chat");
    groupField.classList.add("show");
  } else {
    addChatTab.setAttribute("data-type", "conversation");
    groupField.classList.remove("show");
  }
});
