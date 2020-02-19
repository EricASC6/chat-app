class UserAPI {
  static async getUserData(_id, key) {
    const USER_API = `/user?key=${key}&user_id=${_id}`;
    const userDataRes = await fetch(USER_API);
    const userData = await userDataRes.json();
    return userData;
  }
}

export default UserAPI;
