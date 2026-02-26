COMPOSE = docker compose
NAME = task-management

all up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

# Clean only project containers
cc:
	$(COMPOSE) rm -f -s -v

# Clean only "dangling" images
ci:
	docker image prune -f

# Total Wipeout
fclean: down
	docker network prune -f
	docker volume rm $$(docker volume ls -q | grep postgres_data) || true

re: down up

# Clean and Rebuild
cre: down cc all