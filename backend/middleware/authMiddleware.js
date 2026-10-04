import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protectRoute(request, response, next){
  try {
    let token;
    const authHeader = request.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer ")){
      token = authHeader.split(" ")[1];
    }

    if(!token){
      return response.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
        data: null
      });
    }

    const secret = process.env.JWT_SECRET;
    if(!secret){
      throw new Error("JWT_SECRET is not configured in environment variables.");
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");

    if(!user){
      return response.status(401).json({
        success: false,
        message: "Invalid session token. User account not found.",
        data: null
      });
    }

    request.user = user;
    next();
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    return response.status(401).json({
      success: false,
      message: isExpired ? "Session expired. Please log in again." : "Invalid authentication token.",
      data: null
    });
  }
}
