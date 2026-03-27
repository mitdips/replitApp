# replitApp

## Overview
A simple Node.js/Express web application running on Replit.

## Tech Stack
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Frontend:** Static HTML/CSS/JS served from `public/`

## Project Structure
- `server.js` - Main Express server, listens on port 5000
- `public/index.html` - Frontend homepage
- `package.json` - Node.js project config and dependencies

## Running the App
The app runs via the "Start application" workflow:
```
node server.js
```
Server listens on `0.0.0.0:5000`.

## API Endpoints
- `GET /` - Serves the frontend
- `GET /api/health` - Health check endpoint

## Notes
- Frontend is served as static files from the `public/` directory
- Server binds to `0.0.0.0` so it's accessible through Replit's proxy
