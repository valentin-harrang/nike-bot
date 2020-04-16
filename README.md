# Nike bot

Bot using Node.js / puppeteer that buys a Nike shoe when it drops.

## Requirement

- Docker

## Getting started

- Clone or download sources
- Run `cd nike-bot`
- Run `npm install`
- Run `node bot.js`

Or with Docker :

- Run `docker run --name redis -d amd64/redis redis-server --appendonly yes`
- Run `docker build -t alpine:nike_alpine . && docker run -it -p 8118:8118 -p 9050:9050 -d -v /media/valentin/Stockage/workspace/perso/nike-bot:/app alpine:nike_alpine -e`
- Run `curl -Lx http://127.0.0.1:8118 http://jsonip.com/` (optional)