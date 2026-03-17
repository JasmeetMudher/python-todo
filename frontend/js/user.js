export default class User {
  constructor() {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      this.id = savedUser.id;
      this.username = savedUser.username;
    } else {
      this.id = null;
      this.username = null;
    }
  }

  setUser(id, username) {
    this.id = id;
    this.username = username;
    localStorage.setItem("user", JSON.stringify({ id, username }));
  }

  getId() {
    return this.id;
  }

  isLoggedIn() {
    return !!this.id;
  }

  async logout(api) {
    if (api) {
      try {
        await api.logout();
      } catch (err) {
        console.error("Failed to logout:", err);
      }
    }
    this.id = null;
    this.username = null;
    localStorage.removeItem("user");
  }
}
