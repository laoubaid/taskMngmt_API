
FROM python:3.14-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (needed for some DB drivers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .
RUN chmod +x api_init.sh
# Expose the port your app runs on
EXPOSE 8000

# Run migrations and start the server
# Replace 'app.main:app' with your actual entry point
ENTRYPOINT [ "./api_init.sh" ]