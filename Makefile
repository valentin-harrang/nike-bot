.PHONY: all run-containers run-bot

all: run-containers run-bot

run-containers:
	docker-compose up -d

run-bot:
	./run-bot.sh
