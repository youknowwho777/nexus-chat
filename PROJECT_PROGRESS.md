# Nexus Chat Progress

## Project Idea
Nexus Chat is my first major project. It connects concepts from DBMS, Web Development, OS, CN, and OOPS.

## Current Direction
The project started as standalone HTML/CSS/JavaScript pages and is now moving toward a full-stack chat application.

Main reference: `PROJECT_PLAN.md`

Target stack:
- Frontend: Vite, React, Tailwind CSS, React Router.
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT auth, bcrypt, Socket.IO.

## Learning Rule
Build while learning. Understand what was built, why it works, and which concept it connects to.

## Day 1
HTML/CSS frontend basics.

Done:
- Built login page layout.
- Built create account page layout.
- Built chat page layout.
- Built settings page layout.
- Improved basic navigation and text.

## Day 2
HTML/CSS verification.

Done:
- Tested pages on different screen sizes.
- Improved responsive layout behavior.
- Checked basic styling and spacing.

## Day 3
JavaScript form validation.

Done:
- Added validation for login form.
- Added validation for create account form.
- Added basic input rules.
- Added user feedback for invalid inputs.

## Day 4
Chat page JavaScript basics.

Done:
- Added chat search filtering.
- Added chat selection.
- Added message display.
- Added temporary frontend-only message sending.

## Day 5
Git and GitHub setup.

Done:
- Created the GitHub repository.
- Initialized git in the project.
- Made the first push.
- Started tracking progress and code changes.

## Day 6
Advanced JavaScript learning.

Done:
- Studied advanced JavaScript topics.
- Connected the concepts to Nexus Chat features.

## Day 7
Advanced JavaScript learning continued.

Done:
- Continued studying advanced JavaScript.
- Focused on understanding concepts before adding more features.

## Day 8
Advanced JavaScript project review.

Done:
- Reviewed how objects organize chat data.
- Reviewed how validation rules can be stored cleanly.
- Reviewed how modules split code into reusable files.
- Reviewed promises, async functions, and await.
- Checked the updated files with a local server.

## Day 9
Started React + Tailwind migration.

Done:
- Added Vite + React + Tailwind CSS setup.
- Converted login page into React components.
- Converted create account page into React components.
- Replaced DOM form validation with React state and hooks.
- Added reusable auth components.
- Moved auth images into `src/assets/images/auth`.
- Created a cleaner `src` folder structure.
- Moved old HTML/CSS/JS prototype into `public/phase-1`.
- Verified the React app with a production build.

## Day 10
Continued React frontend migration.

Done:
- Converted chat page into a React component.
- Converted settings page into a React component.
- Added React state and hooks for chat behavior.
- Added chat search, chat selection, and message sending.
- Updated login navigation to open the React chat page.
- Verified the app with a production build.

## Day 11
Completed main React frontend pass.

Done:
- Added React Router routes.
- Added protected routes for chat and settings.
- Added localStorage-backed mock session.
- Added localStorage-backed chat and settings state.
- Finished controlled state for login and signup.
- Finished controlled state for chat, profile settings, theme, background, and AI preference.
- Removed broken encoded symbols from React pages.
- Added `.vite/` to `.gitignore`.
- Verified the app with a production build.

## Day 12
Started backend connection with Express and REST API.

Done:
- Created a separate `backend` folder for the Express server.
- Added `backend/package.json` with backend-only scripts and dependencies.
- Installed `express` and `cors` for the backend.
- Created `backend/server.js`.
- Added `GET /api/health` to test if the backend is running.
- Added temporary in-memory users array.
- Added `POST /api/auth/signup` for creating an account.
- Added `POST /api/auth/login` for logging in.
- Connected React login form to the Express login route.
- Connected React create-account form to the Express signup route.
- Added `src/services/authApi.js` to keep backend request code in one simple place.
- Added frontend error messages for failed backend login/signup requests.
- Verified backend health, signup, and login routes.
- Verified the React app with a production build.

## Day 13
Finished the pre-MongoDB Node, Express, and REST API structure.

Done:
- Arranged backend into a simple structure without too many small files:
  - `server.js` for app setup and middleware.
  - `routes/apiRoutes.js` for REST API routes.
  - `data/store.js` for temporary in-memory users and messages.
- Kept temporary users and messages in memory until MongoDB is added.
- Added backend validation for signup and login.
- Added safe public user response so passwords are not sent to frontend.
- Added `GET /api/users` for a future contacts/sidebar list.
- Added `GET /api/users/:id` to fetch one user.
- Added `POST /api/messages` to send a temporary message.
- Added `GET /api/messages/:firstUserId/:secondUserId` to fetch chat messages between two users.
- Added a simple 404 API response for wrong routes.
- Verified signup, login, users list, send message, and fetch messages using REST requests.

## Day 14 - 17
Connected MongoDB Atlas and added real User schema persistence.

Done:
- Installed `mongoose` and `bcryptjs` in the backend.
- Created `backend/config/db.js` to connect Express to the MongoDB Atlas cluster (`NexusChat` database).
- Updated `backend/server.js` to connect to MongoDB before starting the server.
- Created `backend/models/User.js` using Mongoose for the `users` collection.
- Added validation for username, unique lowercase email, and password.
- Added automatic bcrypt password hashing before saving user documents.
- Added safe public user helper methods so passwords are never returned in responses.
- Updated `POST /api/auth/signup` to save real users in MongoDB with duplicate email prevention.
- Updated `POST /api/auth/login` to verify saved users using bcrypt password comparison.
- Updated `GET /api/users` and `GET /api/users/:id` to fetch real users from MongoDB.
- Created `backend/.env.example` and verified `.env` is kept private by git.
- Verified MongoDB connection, signup, login, and user queries with live requests.
- Verified production build and pushed all updates to GitHub.

## Day 18
Added JWT authentication, protected routes, Message model, and real React chat connection.

Done:
- Installed `jsonwebtoken` in the backend.
- Created `backend/middleware/authMiddleware.js` to protect private endpoints with `protectRoute`.
- Updated `/api/auth/signup` and `/api/auth/login` to return signed JWT tokens.
- Added `GET /api/users/me` and `PATCH /api/users/me` to fetch and update user settings in MongoDB.
- Created `backend/models/Message.js` using Mongoose for the `messages` collection with compound indexes.
- Migrated `POST /api/messages` and `GET /api/messages/:otherUserId` to MongoDB and removed `backend/data/store.js`.
- Created frontend `apiClient.js` with automatic JWT header injection.
- Created frontend services `userApi.js` and `messageApi.js`.
- Updated `App.jsx`, `LoginPage.jsx`, and `CreateAccountPage.jsx` to store and manage JWT tokens in `localStorage`.
- Connected `ChatPage.jsx` to fetch real registered users from MongoDB into the sidebar.
- Connected `ChatPage.jsx` to send and receive real persistent conversation messages in MongoDB Atlas.
- Verified frontend production build with zero errors.

## Current State
The backend and frontend are now fully connected to MongoDB Atlas (`NexusChat` database).
Both User accounts and Chat messages are 100% persistent in MongoDB.
API endpoints are secured with JWT authentication and middleware.
Contacts in the sidebar and chat conversations load dynamically from the real database.

## Next Work
- Prepare the project for real-time live messaging using Socket.IO.
- Add live typing indicators and online/offline presence indicators.


