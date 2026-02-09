all up:
	docker compose up -d --build

down:
	docker compose down

cc:
	@containers=$$(docker ps -aq); \
	if [ -n "$$containers" ]; then \
		docker rm -f $$containers; \
	fi

ci:
	@images=$$(docker images -q); \
	if [ -n "$$images" ]; then \
		docker rmi $$images; \
	fi

re: down up

cre: down cc ci up