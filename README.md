# Simple Task Management

**note: require node.js 12.20**

## [API Document](/docs/api.yml)
---

## HMAC Auth
---
* StringToSign = HTTP-Verb + "\n" + RequestURI + "\n" + Timestamp
* signature = Base64(HMAC-SHA-256(StringToSign, accessSecret))
* in header: Authorization: hmac <accessKeyId>=<signature>

## Development
---

### NPM Commands
* npm run db:up - start db
* npm run dev - start app
* npm run image:update - build and tag and push image
* npm run compose:up - start local environment (need .env.compose)

### Postman Support
* Postman collection and environment files are in /docs

### Helm Chart
* Helm file is in /scripts/chart
