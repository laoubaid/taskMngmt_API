from sqlmodel import SQLModel, Field
from sqlalchemy import String
from typing import Optional, Union
from datetime import datetime

class TaskBase(SQLModel):
    """shared fields for create/update operations"""
    title: str = Field(min_length=1, max_length=200)
    completed: bool = False
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = Field(default="low", sa_type=String)

class Task(TaskBase, table=True):
    """db table model"""
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class TaskCreate(TaskBase):
    """req model for creating tasks"""
    pass

class TaskUpdate(SQLModel):
    """req model for updating tasks (all fields optional)"""
    title: Union[str, None] = Field(
        default=None, 
        min_length=1, 
        max_length=200
    )
    description: Union[str, None] = None
    due_date: Union[datetime, None] = None
    priority: Union[str, None] = None
    completed: Optional[bool] = None

class TaskPublic(TaskBase):
    """resp model (what API returns)"""
    id: int
    created_at: datetime
    updated_at: datetime
