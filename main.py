from fastapi import FastAPI

app = FastAPI(title="Task Management API", version="1.0.0")

@app.get("/")  # decorator to tell fastapi that the function right after handels [ GET / ]
def root():
    return  {"message": "Task Management API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)

