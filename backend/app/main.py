from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import Optional
from contextlib import asynccontextmanager
from datetime import datetime

from database import create_db_and_tables, get_session
from models import Task, TaskCreate, TaskUpdate, TaskPublic

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    print("Creating database tables...")
    create_db_and_tables()
    yield
    # Shutdown: Cleanup (if needed)
    print("Shutting down...")

app = FastAPI(
    title="Task Management API",
    version="2.0.0",
    description="Task API with PostgreSQL",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # use the frontend url later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Task Management API v2.0",
        "database": "PostgreSQL",
        "docs": "/docs"
    }

# CREATE - POST /tasks
@app.post("/tasks", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session)
):
    """Create a new task"""
    task = Task.model_validate(task_data)
    session.add(task)
    session.commit()
    session.refresh(task)  # Get the generated ID
    return task

# READ ALL - GET /tasks
@app.get("/tasks", response_model=list[TaskPublic])
def get_tasks(
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    session: Session = Depends(get_session),
    page: int = 1,
    limit: int = 10,
):
    """Get all tasks, optionally filter by completion status"""
    statement = select(Task)  # creat select * from task query 
    
    if completed is not None:
        statement = statement.where(Task.completed == completed)  # adding completed filter
    
    if priority is not None:
        statement = statement.where(Task.priority == priority)  # adding priority filter
    
    statement = statement.offset((page - 1) * limit).limit(limit)
    tasks = session.exec(statement).all()  # exec it to return a list of rows
    return tasks

# READ ONE - GET /tasks/{task_id}
@app.get("/tasks/{task_id}", response_model=TaskPublic)
def get_task(
    task_id: int,
    session: Session = Depends(get_session)
):
    """Get a specific task by ID"""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    return task

# UPDATE - PATCH /tasks/{task_id}
@app.patch("/tasks/{task_id}", response_model=TaskPublic)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session)
):
    """Update a task (partial update)"""
    try:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        
        # Update only provided fields, extracting the unseted fields from response
        task_data = task_update.model_dump(exclude_unset=True)
        for key, value in task_data.items():
            setattr(task, key, value)
        
        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    except Exception as e:
        print(f"ERROR: {e}")
        raise

# DELETE - DELETE /tasks/{task_id}
@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session)
):
    """Delete a task"""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    session.delete(task)
    session.commit()
    return None