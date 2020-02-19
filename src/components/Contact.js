class Contact {
  static createContact({ fullname, _id }) {
    const contact = document.createElement("li");
    contact.className = "contact";
    contact.textContent = fullname;
    contact.setAttribute("data-id", _id);
    return contact;
  }
}

export default Contact;
