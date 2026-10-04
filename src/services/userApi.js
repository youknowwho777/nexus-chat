import { apiClient } from "./apiClient.js";

export async function fetchUsers() {
  const result = await apiClient("/users", {
    method: "GET"
  });
  return result?.data?.users || [];
}

export async function fetchUserProfile() {
  const result = await apiClient("/users/me", {
    method: "GET"
  });
  return result?.data?.user || null;
}

export async function updateUserProfile(updates) {
  const result = await apiClient("/users/me", {
    method: "PATCH",
    body: updates
  });
  return result?.data?.user || null;
}
