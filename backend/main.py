from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from models import Todo
from database import init_db, get_session
from datetime import datetime
from fastapi import Body
from models import User
from passlib.hash import pbkdf2_sha256
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi import Request

app = FastAPI()
init_db()

app.add_middleware(
    SessionMiddleware, secret_key="super-secret-key", same_site="lax", https_only=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/tasks", response_model=List[Todo])
def get_tasks(request: Request, session: Session = Depends(get_session)):
    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    tasks = session.exec(select(Todo).where(Todo.user_id == user_id)).all()

    return tasks


@app.post("/tasks")
def add_todo(request: Request, todo: Todo, session: Session = Depends(get_session)):
    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    todo.user_id = user_id

    if todo.deadline:
        todo.deadline = datetime.fromisoformat(str(todo.deadline))

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


@app.delete("/tasks/user")
def clear_all(request: Request, session: Session = Depends(get_session)):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")
    tasks = session.exec(select(Todo).where(Todo.user_id == user_id)).all()
    for task in tasks:
        session.delete(task)
    session.commit()
    return {"message": "Cleared"}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, request: Request, session: Session = Depends(get_session)):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")
    task = session.get(Todo, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    session.delete(task)
    session.commit()
    return {"message": "Deleted"}


@app.patch("/tasks/{task_id}")
def update_task(
    task_id: str,
    request: Request,
    updated_task: dict = Body(...),
    session: Session = Depends(get_session),
):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    task = session.get(Todo, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    for key, value in updated_task.items():
        if hasattr(task, key) and key not in ["id", "user_id"]:
            if key == "deadline" and value:
                value = datetime.fromisoformat(str(value))
            setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@app.post("/register")
def register_user(
    username: str = Body(...),
    password: str = Body(...),
    session: Session = Depends(get_session),
):
    existing = session.exec(select(User).where(User.username == username)).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pbkdf2_sha256.hash(password)

    user = User(username=username, password=hashed_password)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@app.post("/login")
def login_user(
    request: Request,
    username: str = Body(...),
    password: str = Body(...),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.username == username)).first()

    if not user or not pbkdf2_sha256.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    request.session["user_id"] = user.id

    return {"message": "Logged in", "id": user.id, "username": user.username}


@app.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}

@app.get("/me")
def get_current_user(request: Request, session: Session = Depends(get_session)):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return {"id": user.id, "username": user.username}
