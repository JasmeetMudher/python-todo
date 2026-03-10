export default class User {
  constructor(id, firstName, lastName, email = null) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  getId() {
    return this.id;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}