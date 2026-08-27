import express from "express";
import {
  createPublicUser,
  findUserByEmail,
  findUserById,
  messages,
  users
} from "../data/store.js";

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]+$/;

function sendSuccess(response, message, data = null, statusCode = 200){
  response.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendError(response, message, statusCode = 400){
  response.status(statusCode).json({
    success: false,
    message,
    data: null
  });
}

function validateSignupInput(username, email, password){
  if(!username || !email || !password){
    return "Username, email, and password are required.";
  }

  if(username.trim().length < 3){
    return "Username must be at least 3 characters.";
  }

  if(!usernamePattern.test(username.trim())){
    return "Username can only use letters, numbers, and underscores.";
  }

  if(!emailPattern.test(email.trim())){
    return "Enter a valid email address.";
  }

  if(password.length < 8){
    return "Password must be at least 8 characters.";
  }

  if(!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)){
    return "Password must include letters and numbers.";
  }

  return "";
}

function validateLoginInput(email, password){
  if(!email || !password){
    return "Email and password are required.";
  }

  if(!emailPattern.test(email.trim())){
    return "Enter a valid email address.";
  }

  return "";
}

router.get("/health", function(request, response){
  sendSuccess(response, "Nexus Chat backend is running");
});

router.post("/auth/signup", function(request, response){
  const { username, email, password } = request.body;
  const validationError = validateSignupInput(username, email, password);

  if(validationError){
    return sendError(response, validationError);
  }

  const existingUser = findUserByEmail(email.trim());

  if(existingUser){
    return sendError(response, "An account with this email already exists.", 409);
  }

  const newUser = {
    id: Date.now().toString(),
    username: username.trim(),
    email: email.trim(),
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  sendSuccess(
    response,
    "Account created successfully.",
    { user: createPublicUser(newUser) },
    201
  );
});

router.post("/auth/login", function(request, response){
  const { email, password } = request.body;
  const validationError = validateLoginInput(email, password);

  if(validationError){
    return sendError(response, validationError);
  }

  const user = findUserByEmail(email.trim());

  if(!user || user.password !== password){
    return sendError(response, "Invalid email or password.", 401);
  }

  sendSuccess(response, "Login successful.", {
    user: createPublicUser(user)
  });
});

router.get("/users", function(request, response){
  // Used later for the contacts/sidebar list.
  // Passwords are not included.
  const publicUsers = users.map(function(user){
    return createPublicUser(user);
  });

  sendSuccess(response, "Users fetched successfully.", {
    users: publicUsers
  });
});

router.get("/users/:id", function(request, response){
  const user = findUserById(request.params.id);

  if(!user){
    return sendError(response, "User not found.", 404);
  }

  sendSuccess(response, "User fetched successfully.", {
    user: createPublicUser(user)
  });
});

router.post("/messages", function(request, response){
  const { senderId, receiverId, content } = request.body;

  if(!senderId || !receiverId || !content || !content.trim()){
    return sendError(response, "Sender, receiver, and message content are required.");
  }

  const sender = findUserById(senderId);
  const receiver = findUserById(receiverId);

  if(!sender || !receiver){
    return sendError(response, "Sender or receiver was not found.", 404);
  }

  const newMessage = {
    id: Date.now().toString(),
    senderId,
    receiverId,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);

  sendSuccess(response, "Message sent successfully.", {
    message: newMessage
  }, 201);
});

router.get("/messages/:firstUserId/:secondUserId", function(request, response){
  const { firstUserId, secondUserId } = request.params;

  const firstUser = findUserById(firstUserId);
  const secondUser = findUserById(secondUserId);

  if(!firstUser || !secondUser){
    return sendError(response, "One or both users were not found.", 404);
  }

  const chatMessages = messages.filter(function(message){
    const firstDirection = message.senderId === firstUserId && message.receiverId === secondUserId;
    const secondDirection = message.senderId === secondUserId && message.receiverId === firstUserId;

    return firstDirection || secondDirection;
  });

  sendSuccess(response, "Messages fetched successfully.", {
    messages: chatMessages
  });
});

export default router;
