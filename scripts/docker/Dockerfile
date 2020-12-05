# stage-1 dependencies
FROM node:12.20-alpine as dep

WORKDIR /tmpdir

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

# stage-2 final image
FROM node:12.20-alpine

WORKDIR /app

COPY --from=dep /tmpdir/node_modules node_modules/
COPY config config/
COPY src src/
COPY package.json package.json

CMD ["npm", "start"]