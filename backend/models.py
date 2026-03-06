from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Todo(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str  
    task: str
    priority: str
    task_type: str
    deadline: Optional[datetime] = None