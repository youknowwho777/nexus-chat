const API_BASE_URL = "http://localhost:5001/api";

async function sendAuthRequest(path, formData){
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const result = await response.json();

  // fetch does not throw an error for 400/401/409 responses.
  // So we manually throw the backend message when the request failed.
  if(!response.ok){
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

export function signupUser(formData){
  return sendAuthRequest("/auth/signup", formData);
}

export function loginUser(formData){
  return sendAuthRequest("/auth/login", formData);
}
