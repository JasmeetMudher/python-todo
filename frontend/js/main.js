import API from "./api.js";
import UI from "./ui.js";
import User from "./user.js";

const API_URL = "http://127.0.0.1:8000/tasks";

const user = new User("1");
const api = new API(API_URL);

new UI(api, user);