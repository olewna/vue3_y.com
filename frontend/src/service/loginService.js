import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://${window.location.hostname}:3069/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const accountLogged = null;

export default {
  login(user) {
    return apiClient.post("/login", user);
  },
  logout(user) {
    return apiClient.get("/logout");
  },
};
