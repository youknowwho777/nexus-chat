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

## Current State
The React frontend prototype is mostly ready for backend integration. Data is still stored locally or mocked.

## Next Work
- Start backend with only Node.js + Express.js.
- Create basic Express server and test route: `GET /api/health`.
- Add simple login and create-account routes with temporary in-memory arrays.
- Connect React login/signup forms to Express using `fetch`.
