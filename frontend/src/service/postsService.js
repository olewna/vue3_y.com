import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://localhost:3069/api/posts`,
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
    return apiClient.get("/" + id);
  },
  getPostsByUserId(id) {
    return apiClient.get("/user/" + id);
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
