class ContactAPI {
  static async getUserDataFromID(id) {
    try {
      const userAPI = `/user/id/${id}`;
      const userDataRes = await fetch(userAPI);
      if (userDataRes.status !== 200) throw new Error("Not a 200 response");
      const userData = await userDataRes.json();
      return userData;
    } catch (err) {
      throw err;
    }
  }

  static async getUserDataFromUsername(username) {
    try {
      const userAPI = `/user/username/${username}`;
      const userDataRes = await fetch(userAPI);
      if (userDataRes.status !== 200) throw new Error("Not a 200 response");
      const userData = await userDataRes.json();
      return userData;
    } catch (err) {
      throw err;
    }
  }

  // id - id of the home user
  static async saveContactToContacts(homeUserId, contactId) {
    const contactAPI = `/user/newContact`;
    const requestBody = JSON.stringify({
      homeUserId: homeUserId,
      contactId: contactId
    });

    try {
      const saveContactRes = await fetch(contactAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });

      if (saveContactRes.status !== 200) throw new Error("Not 200 response");

      const saveContactData = await saveContactRes.json();
      return saveContactData;
    } catch (err) {
      throw err;
    }
  }
}

export default ContactAPI;
