class UserAPI {
  static async getUserDataFromID(_id, key) {
    const USER_API = `/user?key=${key}&user_id=${_id}`;
    const userDataRes = await fetch(USER_API);
    const userData = await userDataRes.json();
    return userData;
  }

  static async getUserDataFromUsername(username, key) {
    const USER_API = `/user?key=${key}&username=${username}`;
    const userDataRes = await fetch(USER_API);
    const userData = await userDataRes.json();
    if (userData.ok) return userData.userData;
    else throw new Error("Something went wrong");
  }
}

export default UserAPI;
