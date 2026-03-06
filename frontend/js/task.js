export default class Task{
    constructor(userId, task, priority, taskType, deadline = null){
        this.user_id = userId;
        this.task = task;
        this.priority = priority;
        this.task_type = taskType;
        this.deadline = deadline
    }
}