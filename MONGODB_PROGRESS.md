# Nexus Chat MongoDB Progress

## Purpose

This file tracks the MongoDB work for Nexus Chat.

The project currently uses temporary in-memory arrays in the backend. Those arrays reset whenever the backend restarts, so MongoDB is the next step toward making the app production-ready.

This plan covers MongoDB, user persistence, message persistence, profile/settings persistence, password hashing, and JWT authentication.

This plan stops before Socket.IO.

## Current State (Phases 1, 2, and 3 Completed)

Done already:

- React frontend is working with routes for login, create account, chat, and settings.
- Express backend is created in the `backend` folder.
- MongoDB Atlas cluster is connected (`NexusChat` database via Mongoose).
- `User` model is created targeting the `users` collection with validation.
- User signup and login use MongoDB with bcrypt password hashing.
- JWT authentication and `authMiddleware` protect private routes.
- `Message` model is created targeting the `messages` collection with compound indexes.
- Message routes save and fetch persistent conversations from MongoDB.
- Temporary `backend/data/store.js` is completely removed.
- Chat UI connects to real backend users and persistent messages.

Current active storage:

```txt
users: MongoDB Atlas ('NexusChat.users')
messages: MongoDB Atlas ('NexusChat.messages')
```

## Phase 1: MongoDB Foundation

Goal: create the real database connection and prepare the backend for MongoDB models.

Tasks:

- Create a MongoDB Atlas account.
- Create a free MongoDB cluster.
- Create a database user.
- Add the local/current IP address to Atlas network access.
- Copy the MongoDB connection string.
- Create a backend `.env` file.
- Store the connection string in `.env`.
- Add `PORT`, `CLIENT_URL`, and `MONGODB_URI` to `.env`.
- Install Mongoose in the backend.
- Create a MongoDB connection file.
- Connect Express server to MongoDB before starting routes.
- Test that the backend connects successfully.
- Make sure `.env` is ignored by git.

Recommended backend dependency:

```bash
npm install mongoose
```

Recommended `.env` values:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
```

Recommended new file:

```txt
backend/config/db.js
```

Expected result:

- Backend prints a clear message when MongoDB connects.
- Backend should not continue silently if the database connection fails.
- Project is ready to create MongoDB models.

Status: Completed

## Phase 2: Users, Signup, Login, Bcrypt, And JWT

Goal: replace temporary user storage with MongoDB and make authentication production-ready enough before protecting app data.

Tasks:

- [x] Create a `models` folder inside `backend`.
- [x] Create a User model using Mongoose.
- [x] Add fields for account data, profile data, and settings data.
- [x] Add unique email rule.
- [x] Add timestamps.
- [x] Save email lowercase.
- [x] Install bcrypt package (`bcryptjs`).
- [x] During signup, hash the password before saving.
- [x] Save only the password hash.
- [x] Update signup route to save users in MongoDB.
- [x] Update login route to find users from MongoDB.
- [x] During login, compare entered password with saved hash.
- [x] Remove direct usage of the temporary `users` array for auth.
- [x] Keep public user responses safe.
- [x] Make sure password/passwordHash is never returned in API responses.
- [x] Install JWT package (`jsonwebtoken`).
- [x] Add `JWT_SECRET` to `.env`.
- [x] Generate a JWT after successful login.
- [x] Decide where to store the token (`localStorage` under `nexus:token`).
- [x] Create auth middleware (`backend/middleware/authMiddleware.js`).
- [x] Add logout behavior.
- [x] Update frontend auth flow to remember the logged-in user correctly.

Recommended backend dependencies:

```bash
npm install bcryptjs jsonwebtoken
```

Recommended `.env` value:

```env
JWT_SECRET=your_long_random_secret
```

Recommended new files:

```txt
backend/models/User.js
backend/middleware/authMiddleware.js
```

Recommended User fields:

```js
username
email
passwordHash
profilePic
theme
background
aiAssistant
createdAt
updatedAt
```

Important rules:

- Email should be unique.
- Email should be saved lowercase.
- MongoDB should never store plain text user passwords.
- Password fields should never be returned to the frontend.
- Public user responses should only include safe fields.

Routes that should become protected after JWT works:

```txt
GET /api/users
GET /api/users/:id
POST /api/messages
GET /api/messages/:firstUserId/:secondUserId
GET /api/users/me
PATCH /api/users/me
```

Expected result:

- Created accounts remain saved after backend restart.
- Duplicate emails are blocked by MongoDB/backend logic.
- Signup stores hashed passwords.
- Login checks real saved users with bcrypt password comparison.
- Backend knows which user is logged in.
- Private routes reject requests without a valid token.
- Frontend can keep the user logged in after refresh.

Status: Completed

## Phase 3: Messages And React Chat Connection

Goal: replace temporary messages and frontend-only chat data with MongoDB-backed REST APIs.

Tasks:

- [x] Create a Message model using Mongoose.
- [x] Save every sent message in MongoDB.
- [x] Fetch chat history between two users from MongoDB.
- [x] Sort messages by creation time.
- [x] Validate sender, receiver, and content.
- [x] Use authenticated sender from JWT instead of trusting frontend `senderId`.
- [x] Remove direct usage of the temporary `messages` array.
- [x] Create frontend API service for users (`userApi.js`).
- [x] Create frontend API service for messages (`messageApi.js`).
- [x] Fetch users from backend for the sidebar.
- [x] Fetch messages when a chat is selected.
- [x] Send messages through backend API.
- [x] Replace `sendMessageAsync()` usage.
- [x] Reduce or remove `src/data/chats.js` mock dependency.
- [x] Keep useful loading and error states.

Recommended new backend file:

```txt
backend/models/Message.js
```

Recommended new frontend files:

```txt
src/services/userApi.js
src/services/messageApi.js
```

Frontend code to update:

```txt
src/pages/ChatPage.jsx
src/App.jsx
src/data/chats.js
```

Recommended Message fields:

```js
senderId
receiverId
content
isRead
createdAt
updatedAt
```

Recommended indexes:

```js
{ senderId: 1, receiverId: 1, createdAt: 1 }
{ receiverId: 1, isRead: 1 }
```

Expected result:

- Messages remain saved after backend restart.
- Chat history loads from MongoDB.
- Sending a message creates a real database document.
- Sidebar users come from MongoDB.
- Chat messages come from MongoDB.
- Sent messages are saved through the backend.

Status: Completed

## Phase 4: Profile/Settings Persistence And REST Cleanup

Goal: save user preferences in MongoDB and clean the REST backend before starting Socket.IO.

Tasks:

- Add settings fields to User model if they were not added in Phase 2.
- Add route to get current logged-in user profile.
- Add route to update current logged-in user profile/settings.
- Protect these routes with JWT auth middleware.
- Update Settings page to save through backend API.
- Keep `localStorage` only as a temporary fallback if needed.
- Split backend routes into separate route files if `apiRoutes.js` becomes too large.
- Add centralized error handling middleware.
- Add consistent response format.
- Add request validation helpers.
- Add login/signup rate limiting.
- Improve CORS configuration for production frontend URL.
- Test all REST APIs with Postman or Thunder Client.
- Run frontend production build.

Recommended routes:

```txt
GET /api/users/me
PATCH /api/users/me
```

Settings/profile fields:

```js
username
email
profilePic
theme
background
aiAssistant
```

Possible backend structure after cleanup:

```txt
backend/server.js
backend/config/db.js
backend/models/User.js
backend/models/Message.js
backend/routes/authRoutes.js
backend/routes/userRoutes.js
backend/routes/messageRoutes.js
backend/middleware/authMiddleware.js
backend/middleware/errorMiddleware.js
```

Expected result:

- User theme/background/preferences remain saved across browsers/devices.
- Settings are connected to the logged-in MongoDB user.
- MongoDB-backed REST API is stable.
- Auth is working.
- Users, messages, and settings are persistent.
- The project is ready for Socket.IO as the next major phase.

Status: Not started

## Stop Point

Stop here before starting Socket.IO.

Socket.IO should begin only after:

- MongoDB connection works.
- User model works.
- Signup/login use MongoDB.
- Passwords are hashed.
- JWT auth middleware works.
- Message model works.
- Chat history loads from MongoDB.
- Settings/profile can be saved in MongoDB.
- REST routes are tested and stable.

## Next Immediate Step

Phase 1, Phase 2, and Phase 3 are now fully implemented and verified!

The next major step is:

```txt
Phase 5: Socket.IO Integration for Live Real-Time WebSockets
```

This will bring instantaneous bi-directional communication, real-time message delivery without polling, typing indicators, and live user online/offline status!
