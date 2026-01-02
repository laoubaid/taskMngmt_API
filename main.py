from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


app = FastAPI(title="Task Management API", version="1.0.0")

# Request model for creating tasks
class TaskCreate(BaseModel):
    title: str
    completed: bool = False
    
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False
    created_at: datetime
    
    class Config:        # this is for swagger ui docs 
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Learn FastAPI",
                "completed": False,
                "created_at": "2025-12-31T10:00:00"
            }
        }
        
# In-memory database
tasks_db: dict[int, Task] = {}
task_id_counter = 1
        
    
from fastapi import HTTPException, status
@app.get("/")  # decorator to tell fastapi that the function right after handels [ GET / ]
def root():
    return {
        "message": "Task Management API",
        "endpoints": {
            "docs": "/docs",
            "tasks": "/tasks"
        }
    }
    
@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate):
    global task_id_counter
    new_task = Task(
        id=task_id_counter,
        title=task_data.title,
        completed=task_data.completed,
        created_at=datetime.now()
    )
    
    tasks_db[task_id_counter] = new_task
    task_id_counter += 1
    
    return new_task

@app.get("/tasks", response_model=list[Task])
def list_tasks():
    return list(tasks_db.values())

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    if task_id not in tasks_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
        
    return tasks_db[task_id]

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate):
    if task_id not in tasks_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    task = tasks_db[task_id]
    
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.completed is not None:
        task.completed = task_update.completed
        
    return task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    if task_id in tasks_db:
        del tasks_db[task_id]
        
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)

