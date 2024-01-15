import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://${window.location.hostname}:3069/api/posts`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getPosts() {
    return apiClient.get("/");
  },
  getPostById(id) {
    return apiClient.get("//" + id);
  },
  createPost(post) {
    return apiClient.post("/", post);
  },
  updatePost(id, post) {
    return apiClient.put("/" + id, post);
  },
  deletePost(id) {
    return apiClient.delete("/" + id);
  },
};
