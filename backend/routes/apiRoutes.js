import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User, { createPublicUser } from "../models/User.js";
import Message from "../models/Message.js";
import { protectRoute } from "../middleware/authMiddleware.js";

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

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d"
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

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
router.get("/health", function (request, response) {
  sendSuccess(response, "Nexus Chat backend is running", {
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ----------------------------------------------------
// Authentication Routes (Public)
// ----------------------------------------------------
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
    const token = generateToken(newUser._id);

    return sendSuccess(
      response,
      "Account created successfully.",
      {
        token,
        user: createPublicUser(newUser)
      },
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

    const token = generateToken(user._id);

    return sendSuccess(response, "Login successful.", {
      token,
      user: createPublicUser(user)
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to log in.", 500);
  }
});

// ----------------------------------------------------
// Current User Profile & Settings (Protected)
// ----------------------------------------------------
router.get("/users/me", protectRoute, function (request, response) {
  return sendSuccess(response, "User profile fetched successfully.", {
    user: createPublicUser(request.user)
  });
});

router.patch("/users/me", protectRoute, async function (request, response) {
  try {
    const allowedUpdates = ["username", "profilePic", "theme", "background", "aiAssistant"];
    const updates = request.body;

    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        if (key === "username") {
          const trimmed = updates[key].trim();
          if (trimmed.length < 3 || !usernamePattern.test(trimmed)) {
            return sendError(response, "Invalid username format.");
          }
          request.user.username = trimmed;
        } else {
          request.user[key] = updates[key];
        }
      }
    }

    await request.user.save();

    return sendSuccess(response, "Profile updated successfully.", {
      user: createPublicUser(request.user)
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to update profile.", 500);
  }
});

// ----------------------------------------------------
// Contacts / Users Directory (Protected)
// ----------------------------------------------------
router.get("/users", protectRoute, async function (request, response) {
  try {
    // Return all users except the current authenticated user
    const users = await User.find({ _id: { $ne: request.user._id } }).sort({ createdAt: -1 });
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

router.get("/users/:id", protectRoute, async function (request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(response, "Invalid user ID format.", 400);
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

// ----------------------------------------------------
// Messages (Protected)
// ----------------------------------------------------
router.post("/messages", protectRoute, async function (request, response) {
  try {
    const { receiverId, content } = request.body;

    if (!receiverId || !content || !content.trim()) {
      return sendError(response, "Receiver ID and message content are required.");
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return sendError(response, "Invalid receiver ID format.", 400);
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return sendError(response, "Recipient user not found.", 404);
    }

    const newMessage = new Message({
      senderId: request.user._id,
      receiverId,
      content: content.trim()
    });

    await newMessage.save();

    return sendSuccess(
      response,
      "Message sent successfully.",
      {
        message: newMessage
      },
      201
    );
  } catch (error) {
    return sendError(response, error.message || "Failed to send message.", 500);
  }
});

// Fetch conversation with a specific user
router.get("/messages/:otherUserId", protectRoute, async function (request, response) {
  try {
    const { otherUserId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return sendError(response, "Invalid contact user ID.", 400);
    }

    const chatMessages = await Message.find({
      $or: [
        { senderId: request.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: request.user._id }
      ]
    }).sort({ createdAt: 1 });

    return sendSuccess(response, "Messages fetched successfully.", {
      messages: chatMessages
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to fetch messages.", 500);
  }
});

// Legacy route for compatibility: /messages/:firstUserId/:secondUserId
router.get("/messages/:firstUserId/:secondUserId", protectRoute, async function (request, response) {
  try {
    const { firstUserId, secondUserId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(firstUserId) || !mongoose.Types.ObjectId.isValid(secondUserId)) {
      return sendError(response, "Invalid user IDs.", 400);
    }

    const chatMessages = await Message.find({
      $or: [
        { senderId: firstUserId, receiverId: secondUserId },
        { senderId: secondUserId, receiverId: firstUserId }
      ]
    }).sort({ createdAt: 1 });

    return sendSuccess(response, "Messages fetched successfully.", {
      messages: chatMessages
    });
  } catch (error) {
    return sendError(response, error.message || "Failed to fetch messages.", 500);
  }
});

export default router;
