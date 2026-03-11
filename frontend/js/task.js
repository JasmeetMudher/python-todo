export default class Task {
  constructor(userId, task, priority, taskType, deadline = null) {
    this.user_id = userId;
    this.task = task;
    this.priority = priority;
    this.task_type = taskType;
    this.deadline = deadline;
  }

  toAPI() {
    return {
      user_id: this.user_id,
      task: this.task,
      priority: this.priority,
      task_type: this.task_type,
      deadline: this.deadline
    };
  }
}