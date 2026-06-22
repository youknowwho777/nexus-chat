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

## Day 5
Git and GitHub setup.

Done:
- Created the GitHub repository for Nexus Chat.
- Initialized the project with git.
- Made the first push to the remote repository.
- Started tracking project progress and code changes properly.

## Day 6
Advanced JavaScript learning.

Done:
- Spent time learning a few advanced JavaScript topics.
- Connected the concepts back to how they can help in the Nexus Chat project.

## Day 7
Advanced JavaScript learning continued.

Done:
- Continued studying advanced JavaScript topics.
- Practiced understanding concepts before adding more project features.

## Day 8
Understanding advanced JavaScript changes in the project.

Done:
- Connected recently learned JavaScript topics to the Nexus Chat files.
- Started understanding how objects can organize chat data and form validation rules.
- Started understanding how modules split page logic into separate reusable files.
- Reviewed how promises, async functions, and await can prepare the project for future server communication.
- Verified the updated files through a local server before debugging.

## Next Work
- Continue understanding the advanced JavaScript changes tomorrow.
- Review the new module files step by step before adding more features.
- Continue the new workflow by creating `frontend` and `backend` folders.
- Keep the older HTML/Python prototype files as reference until the new React/Node structure replaces them.
