# Nexus Chat Progress

## Project Idea
Nexus Chat is my first major project. I chose it because it connects the concepts I learned in 4 semesters: DBMS, Web Dev, OS, CN, and OOPS.

## Current Direction
The project plan has changed from standalone HTML/Python prototypes to a full-stack chat application.

Canonical workflow: see `PROJECT_PLAN.md`.

Current prototype naming convention: use lowercase kebab-case for folders, files, classes, and ids.

Target stack:
- Frontend: Vite, React, Tailwind CSS, DaisyUI, Zustand, Socket.IO client.
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT auth, bcrypt, Socket.IO.

## Learning Style
Build while learning. Do not rush or copy blindly. For every feature, understand what we built, why it works, and which concept it connects to.

## Overall Parts To Build
- Frontend structure: login page, create account page, chat page, settings page, and clean navigation between pages.
- Responsive design: make all pages work properly on phone, tablet, laptop, and desktop screen sizes.
- CSS organization: clean repeated CSS and later move common styling into separate CSS files.
- JavaScript frontend behavior: validate forms, handle button clicks, switch chats, show/hide mobile chat screens, and prepare data to send to the backend.
- Backend basics: connect the frontend to Python server code and understand how client-server communication works.
- Database: store users, login details, chats, and messages using DBMS concepts.
- Real chat system: send and receive messages using networking concepts, possibly sockets.
- OOPS structure: organize users, messages, chats, and server logic using classes and clean code.
- Final polish: improve UI, settings features, theme/profile options, logout, and project documentation.

## Day 1
HTML/CSS frontend basics.

Done:
- Built login, create account, chat, and settings page layouts.
- Improved responsiveness and fixed small navigation/text issues.

## Day 2
HTML/CSS verification.

Done:
- Tested pages on different screen sizes.
- Verified layout, responsiveness, and basic page styling.

## Day 3
JavaScript form validation for login and create account pages.

Done:
- Added frontend validation for login/create account forms.
- Checked basic input rules and user feedback behavior.

## Day 4
Chat page JavaScript basics.

Done:
- Added chat search filtering.
- Added chat selection and message display.
- Added temporary frontend-only message sending.

## Next Work
- Start the new workflow from Day 1: initialize git, add `.gitignore`, and create `frontend` and `backend` folders.
- Keep the older HTML/Python prototype files as reference until the new React/Node structure replaces them.
