# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight, modern UI
- Minimal dependencies
- Simple to configure for different backend environments

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

## Backend API configuration (important)

The frontend calls the backend using a base URL resolved in this order:
1. `REACT_APP_BACKEND_URL` (if set)
2. Fallback to `'/api'` (works with same-origin deployments and the CRA dev proxy)

You can configure either of the following:

- Dev proxy (recommended for local development):
  - The project is configured with `"proxy": "http://localhost:8000"` in `package.json`.
  - Run your backend at `http://localhost:8000` and ensure its endpoints are prefixed with `/api` (e.g., `http://localhost:8000/api/chat`).
  - Start the frontend with `npm start`. The dev server will forward `/api/*` requests to the backend, avoiding CORS issues.

- Explicit backend URL (useful when backend is on another origin):
  - Copy `.env.example` to `.env` and set:
    - `REACT_APP_BACKEND_URL=http://<backend-host>:<port>/api`
  - Restart `npm start` after changing `.env`.
  - Ensure the backend enables CORS for the frontend origin if different (e.g., `http://localhost:3000`).

Common error causes and fixes:
- “There was a problem contacting the server”:
  - Backend not running or not reachable at the configured URL.
  - Missing `/api` prefix on backend routes.
  - CORS blocked when using a different origin without proper backend CORS settings.
  - Wrong `REACT_APP_BACKEND_URL` or missing dev proxy.

## Customization

- Theme colors and styles are in `src/App.css`.
- Components are in `src/components/*`.

## Learn More

- React: https://reactjs.org/
- CRA docs: https://create-react-app.dev/
