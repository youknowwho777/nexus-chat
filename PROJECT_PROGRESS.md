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

## Current State
The React frontend now talks to a basic Express backend for signup and login.
Users and messages are still stored in temporary in-memory arrays, so they reset when the backend restarts.
Chat UI and settings data are still stored locally in the browser.

## Next Work
- Review the REST API flow once from frontend to backend.
- Start MongoDB Atlas and Mongoose.
- Replace the temporary users array with a real User model.
- Replace the temporary messages array with a real Message model.
