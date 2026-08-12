import express from "express";
import cors from "cors";
import "dotenv/config";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware runs before our routes.
// express.json() lets Express read JSON data sent from the React frontend.
app.use(express.json());

// CORS allows the frontend dev server to talk to this backend.
// Vite may be opened as localhost:5173 or 127.0.0.1:5173 on Windows.
app.use(cors({
  origin: [CLIENT_URL, "http://127.0.0.1:5173"]
}));

// All REST API routes start with /api.
// Example: /api/auth/login, /api/users, /api/messages
app.use("/api", apiRoutes);

// If no route matched above, the API path is wrong.
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
