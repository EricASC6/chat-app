// Hamburger Effect
const hamburger = document.getElementById("hamburger");
const contactsTab = document.getElementById("contacts-tab");

hamburger.addEventListener("click", () => {
  contactsTab.classList.toggle("show");
});

// Add Contact Popup Effect
const addContactBtn = document.getElementById("add-new-contact");
const addContactTab = document.getElementById("add-contact");

addContactBtn.addEventListener("click", () => {
  addContactTab.classList.toggle("show");
});
