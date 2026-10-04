import { apiClient } from "./apiClient.js";

export async function fetchConversation(otherUserId) {
  const result = await apiClient(`/messages/${otherUserId}`, {
    method: "GET"
  });
  return result?.data?.messages || [];
}

export async function sendMessage({ receiverId, content }) {
  const result = await apiClient("/messages", {
    method: "POST",
    body: {
      receiverId,
      content
    }
  });
  return result?.data?.message || null;
}
