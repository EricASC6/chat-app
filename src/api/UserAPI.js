class UserAPI {
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
}

export default UserAPI;
