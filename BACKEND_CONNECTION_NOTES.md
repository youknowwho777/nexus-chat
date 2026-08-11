# Backend Connection Notes

This file is a quick map of what changed when Nexus Chat moved from frontend-only mock auth to a basic Express backend.

## Before Backend Connection

- Login and create-account used `fakeServerRequest()` from `src/utils/validation.js`.
- User data was not checked by a real server.
- There was no `backend` folder.
- Signup/login were only frontend practice, not real REST API calls.

## After Backend Connection

### `backend/server.js`

- Created the Express app.
- Added middleware:
  - `express.json()` to read JSON request bodies.
  - `cors()` so React can call the backend.
- Connected all backend routes using:

```js
app.use("/api", apiRoutes);
```

- Backend runs on:

```txt
http://localhost:5001
```

### `backend/routes/apiRoutes.js`

- Added all pre-MongoDB REST routes:

```txt
GET  /api/health
POST /api/auth/signup
POST /api/auth/login
GET  /api/users
GET  /api/users/:id
POST /api/messages
GET  /api/messages/:firstUserId/:secondUserId
```

- Added backend validation for signup and login.
- Added safe responses so passwords are not sent back to React.

### `backend/data/store.js`

- Added temporary arrays:

```js
users
messages
```

- These act like a temporary database before MongoDB.
- Data resets when the backend restarts.

### `src/services/authApi.js`

- Added frontend `fetch()` code in one simple file.
- Login calls:

```txt
POST http://localhost:5001/api/auth/login
```

- Signup calls:

```txt
POST http://localhost:5001/api/auth/signup
```

### `src/pages/LoginPage.jsx`

- Removed fake login request.
- Added real backend login using `loginUser()`.
- Added server error message display.

### `src/pages/CreateAccountPage.jsx`

- Removed fake create-account request.
- Added real backend signup using `signupUser()`.
- Added server error message display.

### `src/App.jsx`

- Updated login success handling so the username returned by backend can become the current user name.

### `PROJECT_PROGRESS.md`

- Added Day 12 and Day 13 progress notes.
- Updated current state and next work.

## Main Flow Now

```txt
React Login/Create Account Form
        ↓
src/services/authApi.js
        ↓
fetch()
        ↓
Express route in backend/routes/apiRoutes.js
        ↓
Temporary arrays in backend/data/store.js
        ↓
JSON response back to React
```

