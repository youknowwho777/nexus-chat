import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      minlength: [3, "Username must be at least 3 characters."],
      match: [/^[A-Za-z0-9_]+$/, "Username can only use letters, numbers, and underscores."]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."]
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."]
    },
    profilePic: {
      type: String,
      default: ""
    },
    theme: {
      type: String,
      default: "blue",
      enum: ["blue", "purple", "emerald", "amber"]
    },
    background: {
      type: String,
      default: "space",
      enum: ["space", "cyber", "gradient", "minimal"]
    },
    aiAssistant: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);

// Hash password before saving if it was modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe public representation of user (never reveals password)
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    profilePic: this.profilePic,
    theme: this.theme,
    background: this.background,
    aiAssistant: this.aiAssistant,
    createdAt: this.createdAt
  };
};

export function createPublicUser(userDoc) {
  if (!userDoc) {
    return null;
  }
  if (typeof userDoc.toPublicJSON === "function") {
    return userDoc.toPublicJSON();
  }
  return {
    id: (userDoc._id || userDoc.id).toString(),
    username: userDoc.username,
    email: userDoc.email,
    profilePic: userDoc.profilePic || "",
    theme: userDoc.theme || "blue",
    background: userDoc.background || "space",
    aiAssistant: userDoc.aiAssistant !== undefined ? userDoc.aiAssistant : true,
    createdAt: userDoc.createdAt
  };
}

const User = mongoose.model("User", userSchema);
export default User;
