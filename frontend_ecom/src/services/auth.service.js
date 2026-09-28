import api from "./api.js";

export async function refreshAccessToken() {
  const response = await api.post("/auth/refresh-token");
  return response;
}

export async function getCurrentUser(accessToken) {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response;
}
