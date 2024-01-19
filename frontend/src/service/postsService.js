import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:3069/api/posts`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getPosts(id) {
    return apiClient.get("/all/" + id);
  },
  getQuotes(id) {
    return apiClient.get("/allquotes/" + id);
  },
  getPostById(id) {
    return apiClient.get("/" + id);
  },
  getPostsByUserId(id) {
    return apiClient.get("/user/" + id);
  },
  getQuotesByUserId(id) {
    return apiClient.get("/user/quotes/" + id);
  },
  createPost(post) {
    return apiClient.post("/", post);
  },
  createQuote(quote, userId, postId) {
    return apiClient.post("/quote", { quote, userId, postId });
  },
  deletePost(id) {
    return apiClient.delete("/" + id);
  },
};
