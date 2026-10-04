# Nexus Chat MongoDB Progress

## Purpose

This file tracks the MongoDB work for Nexus Chat.

The project currently uses temporary in-memory arrays in the backend. Those arrays reset whenever the backend restarts, so MongoDB is the next step toward making the app production-ready.

This plan covers MongoDB, user persistence, message persistence, profile/settings persistence, password hashing, and JWT authentication.

This plan stops before Socket.IO.

## Current State (Active MongoDB & User Persistence)

Done already:

- React frontend is working with routes for login, create account, chat, and settings.
- Express backend is created in the `backend` folder.
- MongoDB Atlas cluster is connected (`NexusChat` database via Mongoose).
- `User` model is created targeting the `users` collection with validation.
- User signup and login use MongoDB with bcrypt password hashing.
- Temporary `users` array is completely removed.
- Backend routes for signup, login, and user queries read/write to MongoDB.
- Messages currently use temporary backend arrays (`backend/data/store.js`).
- Chat UI still uses local frontend mock chat data.
- Settings are still saved in browser `localStorage`.

Current active storage:

```txt
users: MongoDB Atlas ('NexusChat.users')
messages: Temporary backend array ('messages = []')
```

## Phase 1: MongoDB Foundation

Goal: create the real database connection and prepare the backend for MongoDB models.

Tasks:

- [x] Create a MongoDB Atlas account.
- [x] Create a free MongoDB cluster.
- [x] Create a database user.
- [x] Add the local/current IP address to Atlas network access.
- [x] Copy the MongoDB connection string.
- [x] Create a backend `.env` file.
- [x] Store the connection string in `.env`.
- [x] Add `PORT`, `CLIENT_URL`, and `MONGODB_URI` to `.env`.
- [x] Install Mongoose in the backend.
- [x] Create a MongoDB connection file.
- [x] Connect Express server to MongoDB before starting routes.
- [x] Test that the backend connects successfully.
- [x] Make sure `.env` is ignored by git.

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
- [x] Add `JWT_SECRET` to `.env`.
- [ ] Install JWT package (`jsonwebtoken`).
- [ ] Generate a JWT after successful login.
- [ ] Decide where to store the token.
- [ ] Create auth middleware.
- [ ] Add logout behavior.
- [ ] Update frontend auth flow to remember the logged-in user correctly.

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

Status: In Progress (User model, MongoDB Atlas connection, password hashing with bcrypt, safe public JSON output, duplicate email prevention, and signup/login/user endpoints completed)

## Phase 3: Messages And React Chat Connection

Goal: replace temporary messages and frontend-only chat data with MongoDB-backed REST APIs.

Tasks:

- Create a Message model using Mongoose.
- Save every sent message in MongoDB.
- Fetch chat history between two users from MongoDB.
- Sort messages by creation time.
- Validate sender, receiver, and content.
- Use authenticated sender from JWT instead of trusting frontend `senderId`.
- Remove direct usage of the temporary `messages` array.
- Create frontend API service for users.
- Create frontend API service for messages.
- Fetch users from backend for the sidebar.
- Fetch messages when a chat is selected.
- Send messages through backend API.
- Replace `sendMessageAsync()` usage.
- Reduce or remove `src/data/chats.js` mock dependency.
- Keep useful loading and error states.

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

Status: Not started

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

Complete the remaining items in Phase 2:

```txt
Install jsonwebtoken + implement JWT generation on login + protect routes with auth middleware
```

After completing JWT authentication, move directly to **Phase 3** (create Mongoose `Message` model and connect React chat messages to MongoDB).
