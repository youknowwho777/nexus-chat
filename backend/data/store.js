// This file is our temporary "database" before MongoDB.
// Data stored here resets whenever the backend server restarts.

export const users = [];
export const messages = [];

export function createPublicUser(user){
  // Public user means safe user data that can be sent to the frontend.
  // Password is intentionally not included.
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

export function findUserByEmail(email){
  return users.find(function(user){
    return user.email.toLowerCase() === email.toLowerCase();
  });
}

export function findUserById(id){
  return users.find(function(user){
    return user.id === id;
  });
}
