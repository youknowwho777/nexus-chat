const API_BASE_URL = "http://localhost:5001/api";

export async function apiClient(endpoint, options = {}) {
  const token = window.localStorage.getItem("nexus:token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || "An error occurred with the server.";
    throw new Error(errorMessage);
  }

  return data;
}
