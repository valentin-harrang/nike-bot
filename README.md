# Nike bot

Bot using Node.js / puppeteer that buys a Nike shoe when it drops.

## Requirement

- NodeJS
- Docker

## Getting started

- Clone or download sources
- Run `cd nike-bot`
- Run `npm install`
- Run `node bot.js`

Or with Docker :

- Run `docker pull dperson/torproxy`
- Run `docker run -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy -e`
- Run `curl -Lx http://127.0.0.1:8118 http://jsonip.com/` (optional)
- Run `docker build -t alpine:nike_alpine . && docker run -d -v /media/valentin/Stockage/workspace/perso/nike-bot:/app -it alpine:nike_alpine`
