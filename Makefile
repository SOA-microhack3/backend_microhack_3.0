# Image and Container Names
IMAGE_NAME = portflow-backend
CONTAINER_NAME = backend-container

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run with Host Networking (Crucial for Ollama/Postgres access)
run:
	@echo "🚀 Starting Backend on Port 3001..."
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p 3001:3000 \
		--network="host" \
		--env-file .env \
		--restart always \
		$(IMAGE_NAME)
	@echo "✅ Backend is running at http://localhost:3001"

# Stop and remove the container
stop:
	docker rm -f $(CONTAINER_NAME) || true
	@echo "🛑 Backend stopped."

# View live logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Restart (Stop -> Build -> Run)
restart: stop build run