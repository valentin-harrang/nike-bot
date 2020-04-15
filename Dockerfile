FROM alpine

RUN apk add --update nodejs npm \
    && apk add -U --no-cache --allow-untrusted udev ttf-freefont chromium git \
    && addgroup -S node && adduser -S node -G node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD ["sh"]