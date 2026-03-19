import API from "./api.js";
import UI from "./ui.js";
import User from "./user.js";
import "./components/LoginForm.js";
import "./components/TodoApp.js";
import "./components/TaskInput.js";
import "./components/TaskList.js";
import "./components/TaskItem.js";

const API_URL = "http://127.0.0.1:8000";

const user = new User();
const api = new API(API_URL);

new UI(api, user);