FROM alpine

RUN apk add --update nodejs npm && apk add -U --no-cache --allow-untrusted udev ttf-freefont chromium git

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

COPY . /app

WORKDIR /app

VOLUME ["/app"]

RUN npm install && node bot.js
CMD ["sh"]