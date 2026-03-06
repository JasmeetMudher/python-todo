from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from models import Todo
from database import init_db, get_session
from datetime import datetime


app = FastAPI()
init_db()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks/{user_id}", response_model=List[Todo])
def get_tasks(user_id: str, session: Session = Depends(get_session)):
    tasks = session.exec(select(Todo).where(Todo.user_id == user_id)).all()
    return tasks

@app.post("/tasks")
def add_todo(todo: Todo, session: Session = Depends(get_session)):
    if todo.deadline:
        todo.deadline = datetime.fromisoformat(str(todo.deadline))

    session.add(todo)
    session.commit()
    session.refresh(todo)
    return {"message": "Added", "task": todo}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, session: Session = Depends(get_session)):
    task = session.get(Todo, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"message": "Deleted"}

@app.delete("/tasks/user/{user_id}")
def clear_all(user_id: str, session: Session = Depends(get_session)):
    tasks = session.exec(select(Todo).where(Todo.user_id == user_id)).all()
    for task in tasks:
        session.delete(task)
    session.commit()
    return {"message": "Cleared"}