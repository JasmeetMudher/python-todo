from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    todos: List["Todo"] = Relationship(back_populates="user")

class Todo(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    task: str
    priority: str
    task_type: str
    completed: Optional[bool] = None    
    deadline: Optional[datetime] = None
    
    user_id: Optional[str] = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="todos")