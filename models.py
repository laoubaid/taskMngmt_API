from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class TaskBase(SQLModel):
    """shared fields for create/update operations"""
    title: str = Field(min_length=1, max_length=200)
    completed: bool = False

class Task(TaskBase, table=True):
    """db table model"""
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class TaskCreate(TaskBase):
    """req model for creating tasks"""
    pass

# class TaskUpdate(SQLModel):
#     """req model for updating tasks (all fields optional)"""
#     title: Optional[str] = Field(default=None, min_length=1, max_length=200) # i want to add None while keeping the field check
#     completed: Optional[bool] = None

# class TaskUpdate(SQLModel):
#     """req model for updating tasks (all fields optional)"""
#     title: Optional[str] = None
#     completed: Optional[bool] = None

class TaskUpdate(SQLModel):
    """req model for updating tasks (all fields optional)"""
    title: Union[str, None] = Field(
        default=None, 
        min_length=1, 
        max_length=200
    )
    completed: Optional[bool] = None

class TaskPublic(TaskBase):
    """resp model (what API returns)"""
    id: int
    created_at: datetime
    updated_at: datetime
