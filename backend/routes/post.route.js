const Router = require("express").Router;
const postModel = require("../models/post.model");
const post = Router();

const bodyNotEmpty = (obj) => {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "string" &&
      obj[key].trim() === ""
    ) {
      return false;
    }
  }
  return true;
};

post.get("/all/:id", async (req, res) => {
  const result = await postModel.findAll(req.params.id);
  console.log("GET posts /");
  res.json(result);
});

post.get("/allcomments/:id", async (req, res) => {
  const result = await postModel.findAllComments(req.params.id);
  console.log("GET comments /");
  res.json(result);
});

post.get("/:id", async (req, res) => {
  const result = await postModel.findById(req.params.id);
  console.log("GET post /:id");
  res.json(result);
});

post.get("/user/:id", async (req, res) => {
  const result = await postModel.findPostsByUserId(req.params.id);
  console.log("GET user posts /user/:id");
  res.json(result);
});

post.post("/", async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  const result = await postModel.createPost(req.body);
  console.log("POST post /");
  res.json(result);
});

post.post("/comment", async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  const result = await postModel.createAnswer(
    req.body.comment,
    req.body.userId,
    req.body.postId
  );
  console.log("POST post comment /comment");
  res.json(result);
});

module.exports = post;
