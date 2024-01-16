import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://localhost:3069/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  login(user) {
    return apiClient.post("/login", user);
  },
  logout(user) {
    return apiClient.get("/logout");
  },
};
