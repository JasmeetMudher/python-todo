from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    task: str
    priority: str
    task_type: str
    deadline: Optional[str] = "No deadline"

tasks_db = []

@app.get("/tasks")
def get_tasks():
    return tasks_db

@app.post("/tasks")
def add_todo(todo: Todo):
    tasks_db.append(todo.dict())
    return {"message": "Added"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if 0 <= task_id < len(tasks_db):
        tasks_db.pop(task_id)
        return {"message": "Deleted"}
    return {"error": "Not found"}

@app.delete("/tasks")
def clear_all():
    tasks_db.clear()
    return {"message": "Cleared"}