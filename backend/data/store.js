// Temporary database before MongoDB.
// This data resets when the backend restarts.

export const users = [];
export const messages = [];

export function createPublicUser(user){
  // Send only safe user details to the frontend.
  // Never include the password.
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
