import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://localhost:3069/api/users`,
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
  followUser(users) {
    return apiClient.post("/follow", users);
  },
  unfollowUser(users) {
    return apiClient.post("/unfollow", users);
  },
  getFollowedUsers(id) {
    return apiClient.get("/follow/" + id);
  },
  getNotFollowedUsers(id) {
    return apiClient.get("/notfollow/" + id);
  },
};
