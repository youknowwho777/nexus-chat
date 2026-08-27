import express from "express";
import cors from "cors";
import "dotenv/config";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware runs before routes.
// This lets Express read JSON from React.
app.use(express.json());

// Allow the Vite frontend to call this backend.
// Windows may open Vite with localhost or 127.0.0.1.
app.use(cors({
  origin: [CLIENT_URL, "http://127.0.0.1:5173"]
}));

// All REST routes start with /api.
// Examples: /api/auth/login, /api/users, /api/messages
app.use("/api", apiRoutes);

// Send a clear response for unknown API routes.
app.use(function(request, response){
  response.status(404).json({
    success: false,
    message: "API route not found.",
    data: null
  });
});

app.listen(PORT, function(){
  console.log(`Nexus Chat backend is running on http://localhost:${PORT}`);
});
