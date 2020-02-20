class ContactAPI {
  static async getUserDataFromID(_id, key) {
    try {
      const userAPI = `/user?key=${key}&user_id=${_id}`;
      const userDataRes = await fetch(userAPI);
      if (userDataRes.status !== 200) throw new Error("Not a 200 response");
      const userData = await userDataRes.json();
      return userData;
    } catch (err) {
      throw err;
    }
  }

  static async getUserDataFromUsername(username, key) {
    try {
      const userAPI = `/user?key=${key}&username=${username}`;
      const userDataRes = await fetch(userAPI);
      if (userDataRes.status !== 200) throw new Error("Not a 200 response");
      const userData = await userDataRes.json();
      if (userData.ok) return userData.userData;
      else throw new Error("Something went wrong");
    } catch (err) {
      throw err;
    }
  }

  static async saveContactToContacts(userData, key) {
    const contactAPI = `/user?key=${key}`;
    const requestBody = JSON.stringify(userData);

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
