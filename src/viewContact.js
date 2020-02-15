// Functionality to allow user to see contact info and chats
document.addEventListener("DOMContentLoaded", () => {
  const contacts = document.querySelectorAll("#contacts-list .contact");

  contacts.forEach(contact =>
    contact.addEventListener("click", async () => {
      console.log(1);
      const id = new URLSearchParams(window.location.search).get("id");
      const CONTACT_LOC = `/user?key=${API_KEY}&username=${contact.getAttribute(
        "username"
      )}&id=${id}`;
      const contactResponse = await fetch(CONTACT_LOC);
      const contactData = await contactResponse.json();

      console.log(contactData);

      const { firstname, lastname, bio } = contactData.contact;

      // Modify the DOM to match contact data
      // Displaying Contact's name
      const user = document.querySelector("#main-contact-head #user");
      user.textContent = firstname + " " + lastname;
      // Displaying Contact's bio
      const contactBio = document.querySelector("#main-contact-description p");
      contactBio.textContent = bio;

      // Hidding the contacts-tab
      contactsTab.classList.remove("show");
    })
  );
});
