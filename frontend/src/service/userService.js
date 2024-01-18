import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:3069/api/users`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getUsers() {
    return apiClient.get("/");
  },
  getUserById(id) {
    return apiClient.get("/" + id);
  },
  createUser(user) {
    return apiClient.post("/", user);
  },
};
