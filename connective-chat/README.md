# Connective Chat
Powered by Express.js

# Development
- Copy .env.example as .env and setup environment variables
- `docker-compose -f docker-compose.dev.yml up -d --build`
- Connect client on `:3000`

# Production
- Copy .env.example as .env and setup environment variables
- Confirm domain name in `deploy.sh` on Line 8
- Confirm email for letsencrypt in `deploy.sh` on Line 11
- Confirm domain in `./nginx/default.conf` in server block
- Execute `bash ./deploy.sh`
- Connect client on `https://connective-testing.dev`