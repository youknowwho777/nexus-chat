# Nexus Chat Project Plan

## Final Workflow

### 1. Git Setup
- Initialize git repo on Day 1.
- Create `.gitignore` for `node_modules` and `.env`.
- Push empty project structure to GitHub.

### 2. Project Structure Setup
- Create two folders: `frontend` and `backend`.
- Frontend: Vite + React project.
- Backend: Node.js + Express project.
- Install base dependencies for both sides.

### 3. Tailwind CSS + DaisyUI Setup
- Configure Tailwind in the React project.
- Install and configure DaisyUI as a Tailwind plugin.
- Test with a sample component before moving forward.

### 4. Configure MongoDB Connection
- Create MongoDB Atlas account and cluster.
- Store connection string in `.env`.
- Write database connection config in the backend and test the connection.

### 5. Build User Model + Auth System
- Create User schema with Mongoose: `name`, `email`, `passwordHash`, `profilePic`, `createdAt`.
- Build register route: validate input, hash password with bcrypt, save to database.
- Build login route: compare password and issue JWT token.
- Build logout route: clear token.
- Write auth middleware to protect routes using JWT.

### 6. Build Message Model + Message Routes
- Create Message schema: `senderId`, `receiverId`, `content`, `timestamp`, `isRead`.
- Build route to send a message and save it to database.
- Build route to fetch chat history between two users.
- Test all routes using Postman.

### 7. Build User Routes
- Route to get all users for sidebar/contact list.
- Route to get a single user profile.
- Route to update profile.
- Protect all routes with auth middleware.

### 8. Error Handling - Backend
- Write centralized error handler middleware in Express.
- Handle common errors: invalid token, user not found, validation errors.
- Always return a consistent JSON response format: `{ success, message, data }`.

### 9. Integrate Socket.IO
- Install and configure Socket.IO on the Express server.
- Track online users using a Map: `socketId -> userId`.
- Implement `sendMessage` event: save to database, then emit to receiver.
- Implement `receiveMessage` event on the client side.
- Broadcast online/offline status on connect and disconnect.

### 10. Build React Frontend - Pages and Components
- Build login and register pages with forms.
- Build home page layout: sidebar/contact list plus chat window.
- Build Message component for sent and received messages.
- Build online status indicator.
- Style everything using Tailwind CSS and DaisyUI components.

### 11. Zustand - Global State Setup
- Create auth store: logged-in user, login action, logout action.
- Create message store: messages, selected conversation, send message action.
- Create socket store: socket instance and online users list.

### 12. Connect Frontend to Backend
- Wire login and register forms to auth APIs using fetch or axios.
- Fetch contact list and render it in the sidebar.
- Fetch chat history when a user is selected.
- Connect Socket.IO client to backend socket server.
- Emit and listen to message events in real time.

### 13. Error Handling - Frontend
- Show error messages on failed login or register.
- Handle network errors gracefully.
- Show loading states during API calls.

### 14. Testing
- Test all REST APIs manually using Postman.
- Test real-time messaging by opening two browser tabs.
- Test edge cases: empty messages, wrong password, duplicate registration.

### 15. Security Hardening
- Ensure passwords are never returned in API responses.
- Add rate limiting to login route.
- Validate and sanitize all user inputs on backend.
- Use HTTPS in production.
- Store JWT securely using an HttpOnly cookie or careful secure localStorage handling.

### 16. Deployment
- Push final code to GitHub.
- Deploy backend on Render or Railway.
- Connect backend to MongoDB Atlas.
- Deploy frontend on Netlify or serve it from backend.
- Test the live application end to end.
