import express from "express";
import mongoose from "mongoose";
import User, { createPublicUser } from "../models/User.js";
import { messages } from "../data/store.js";

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]+$/;

function sendSuccess(response, message, data = null, statusCode = 200) {
  response.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendError(response, message, statusCode = 400) {
  response.status(statusCode).json({
    success: false,
    message,
    data: null
  });
}

function validateSignupInput(username, email, password) {
  if (!username || !email || !password) {
    return "Username, email, and password are required.";
  }

  if (username.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (!usernamePattern.test(username.trim())) {
    return "Username can only use letters, numbers, and underscores.";
  }

  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include letters and numbers.";
  }

  return "";
}

function validateLoginInput(email, password) {
  if (!email || !password) {
    return "Email and password are required.";
  }

  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return "";
}

router.get("/health", function (request, response) {
  sendSuccess(response, "Nexus Chat backend is running", {
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

router.post("/auth/signup", async function (request, response) {
  try {
    const { username, email, password } = request.body;
    const validationError = validateSignupInput(username, email, password);

    if (validationError) {
      return sendError(response, validationError);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return sendError(response, "An account with this email already exists.", 409);
    }

    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password
    });

    await newUser.save();

    return sendSuccess(
      response,
      "Account created successfully.",
      { user: createPublicUser(newUser) },
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return sendError(response, "An account with this email already exists.", 409);
    }
    return sendError(response, error.message || "Failed to create account.", 500);
  }
});

router.post("/auth/login", async function (request, response) {
  try {
    const { email, password } = request.body;
    const validationError = validateLoginInput(email, password);

    if (validationError) {
      return sendError(response, validationError);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return sendError(response, "Invalid email or password.", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(response, "Invalid email or password.", 401);
    }

    return sendSuccess(response, "Login successful.", {
      user: createPublicUser(user)
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to log in.", 500);
  }
});

router.get("/users", async function (request, response) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const publicUsers = users.map(function (user) {
      return createPublicUser(user);
    });

    return sendSuccess(response, "Users fetched successfully.", {
      users: publicUsers
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to fetch users.", 500);
  }
});

router.get("/users/:id", async function (request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(response, "Invalid user ID.", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      return sendError(response, "User not found.", 404);
    }

    return sendSuccess(response, "User fetched successfully.", {
      user: createPublicUser(user)
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to fetch user.", 500);
  }
});

async function findUserByIdOrDb(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await User.findById(id);
  }
  return null;
}

router.post("/messages", async function (request, response) {
  try {
    const { senderId, receiverId, content } = request.body;

    if (!senderId || !receiverId || !content || !content.trim()) {
      return sendError(response, "Sender, receiver, and message content are required.");
    }

    const sender = await findUserByIdOrDb(senderId);
    const receiver = await findUserByIdOrDb(receiverId);

    if (!sender || !receiver) {
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

    return sendSuccess(response, "Message sent successfully.", {
      message: newMessage
    }, 201);
  } catch (error) {
    return sendError(response, error.message || "Failed to send message.", 500);
  }
});

router.get("/messages/:firstUserId/:secondUserId", async function (request, response) {
  try {
    const { firstUserId, secondUserId } = request.params;

    const firstUser = await findUserByIdOrDb(firstUserId);
    const secondUser = await findUserByIdOrDb(secondUserId);

    if (!firstUser || !secondUser) {
      return sendError(response, "One or both users were not found.", 404);
    }

    const chatMessages = messages.filter(function (message) {
      const firstDirection = message.senderId === firstUserId && message.receiverId === secondUserId;
      const secondDirection = message.senderId === secondUserId && message.receiverId === firstUserId;

      return firstDirection || secondDirection;
    });

    return sendSuccess(response, "Messages fetched successfully.", {
      messages: chatMessages
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to fetch messages.", 500);
  }
});

export default router;
