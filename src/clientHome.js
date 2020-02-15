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
