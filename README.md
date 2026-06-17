# Exam 1: "Last Race"

## Student: s360006 HOSSEIN AMINI

## React Client Application Routes

- Route `/`: Home page displaying the game instructions. For authenticated users, it also renders an interactive subway network map.
- Route `/login`: Login page containing the authentication form.
- Route `/game`: The main gameplay interface handling the Planning phase (90-second timer, route building) and Result phase (validation, event tracking, and final score).
- Route `/ranking`: Leaderboard page displaying the top scores of all players.
- Route `/*`: Catch-all route to display a custom 404 "Not Found" error page.

## API Server

- POST `/api/auth/login`
  - Purpose: Authenticate user and create a session.
  - Request body content:
    `{ "username": "player1", "password": "123456" }`
  - Response body content: User object `{ "id": 1, "username": "player1" }` or error message (401).
- GET `/api/auth/current`
  - Purpose: Check if the current user is authenticated.
  - Request parameters: None.
  - Response body content: User object if authenticated, otherwise 401 Unauthorized.
- DELETE `/api/auth/current`
  - Purpose: Terminate the current user session (Logout).
  - Request parameters: None.
  - Response body content: Empty body with 200 OK.
- GET `/api/network`
  - Purpose: Fetch the complete subway network data (Protected).
  - Request parameters: None.
  - Response body content: JSON object containing arrays of `{ stations, lines, segments }`.
- GET `/api/game/start`
  - Purpose: Initialize a new game by providing start/end stations (min distance of 3) and shuffled segments (Protected).
  - Request parameters: None.
  - Response body content: JSON object `{ "startStation": {...}, "endStation": {...}, "segments": [...] }`.
- POST `/api/game/play`
  - Purpose: Submit the user's built route for validation, apply random events, and record the final score (Protected).
  - Request body content: `{ "startStationId": 1, "endStationId": 12, "segments": [4, 8, 10] }`
  - Response body content: JSON object detailing the result `{ "valid": true/false, "score": 25, "message": "...", "journey": [...] }`.
- GET `/api/game/ranking`
  - Purpose: Retrieve the top scores for the leaderboard.
  - Request parameters: None.
  - Response body content: Array of objects `{ "username": "player1", "bestScore": 35 }`.

## Database Tables

- Table `users` - contains `id` (Primary Key), `username` (Unique), `salt`, and `hashed_password`.
- Table `stations` - contains `id` (Primary Key), and `name`.
- Table `lines` - contains `id` (Primary Key), `name`, and `color`.
- Table `segments` - contains `id` (Primary Key), `station_a_id` (Foreign Key), `station_b_id` (Foreign Key), and `line_id` (Foreign Key).
- Table `events` - contains `id` (Primary Key), `description`, and `effect` (Integer modifier for coins).
- Table `games` - contains `id` (Primary Key), `user_id` (Foreign Key), `score`, and `date`.

## Main React Components

- `AuthContext` (in `contexts/AuthContext.jsx`): Manages the global authentication state, session checking, login, and logout logic using the Axios API client.
- `NavigationBar` (in `components/NavigationBar.jsx`): Responsive header component that adapts its navigation links based on the user's authentication status.
- `NetworkMap` (in `components/NetworkMap.jsx`): A modular component utilizing `vis-network` to render an interactive, physics-based graph of the subway system during the Setup phase.
- `PageTitle Hook` (in `hooks/usePageTitle.js`): A custom React Hook responsible for dynamically updating the browser's document title for better UX without relying on outdated external packages.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- `player1`, `123456`
- `player2`, `123456`
- `player3`, `123456`

## Use of AI Tools

I used Google Gemini to assist with conceptualizing the backend architecture (Controller-Service-Module pattern), debugging React Router v7 configurations, generating the interactive vis-network map implementation, and refactoring standard fetch API calls into a centralized Axios service. I verified all outputs by thoroughly testing the application logic, ensuring strict adherence to the project requirements, and actively adapting the code to fit the application's specific flow and constraints.
