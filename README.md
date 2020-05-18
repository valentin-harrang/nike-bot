# Nike bot

Bot that buys a Nike shoe when it drops using Tor Proxy / Node.js / Puppeteer in Docker environment.

## Requirement

- Docker

## Getting started without docker-compose.yml

- Clone or download sources
- Run `docker build -t alpine:nike_alpine . && docker run --name=nike -it -p 8118:8118 -p 9050:9050 -d -e BW=100 -e TOR_MaxCircuitDirtiness=1 -e TZ=Europe/Paris -e LOCATION=FR -v ./:/app alpine:nike_alpine`
- RUN `docker exec -it nike node bot.js`

## Getting started with docker-compose.yml

- Clone or download sources
- Run `docker-compose up -d`
- RUN `docker exec -it nike node bot.js`

## Get container ip (optional)

- Run `docker exec -it nike curl -Lx http://127.0.0.1:8118 http://jsonip.com/`