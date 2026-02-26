# Task Management System with AI Estimation

This project is a full-stack task management application consisting of a React frontend, a Python (FastAPI) backend, and a PostgreSQL database. The system is fully containerized using Docker.

## Technical Overview
The application is structured into three main services:

* **Backend:** A FastAPI application using SQLModel for ORM and Alembic for database migrations. It handles task CRUD operations and integrates with external AI models.
* **Frontend:** A React application built with Vite, served via Nginx using a multi-stage Docker build to minimize image size.
* **Database:** A PostgreSQL instance for persistent storage of tasks and metadata.

## AI Estimation Feature
The system includes an AI service that provides time estimations for tasks. When a user provides a task title and description, the backend sends this data along with relevant context to an AI model via the OpenRouter API.

The AI analyzes the task and returns a JSON object containing:
* An estimated duration in minutes.
* A confidence score for that estimation.
* A brief explanation of why that time was assigned.

## Setup Requirements
The project requires **Docker** and **Docker Compose** to run.

### Environment Variables
A `.env` file must be created in the `backend/` directory. It must contain the following variable:

`OPENROUTER_API_KEY=your_key_here`

> **Note:** Do not wrap the API key in quotes, as Docker parses environment files literally.

## Deployment
To start the entire stack, run the following command from the root directory:

```bash
docker compose up -d --build
