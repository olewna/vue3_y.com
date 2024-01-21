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
  console.log("GET posts /all/:id");
  res.json(result);
});

post.get("/allquotes/:id", async (req, res) => {
  const result = await postModel.findAllQuotes(req.params.id);
  console.log("GET quotes /allquotes/:id");
  res.json(result);
});

post.get("/comments/:id", async (req, res) => {
  const result = await postModel.findCommentsByCommentedPostId(req.params.id);
  console.log("GET comments /comments/:id");
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

post.get("/user/quotes/:id", async (req, res) => {
  const result = await postModel.findQuotesByUserId(req.params.id);
  console.log("GET user quotes /user/quotes/:id");
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

post.post("/quote", async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  const result = await postModel.createQuote(
    req.body.quote,
    req.body.userId,
    req.body.postId
  );
  console.log("POST post quote /quote");
  res.json(result);
});

post.post("/comment", async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  const result = await postModel.createComment(
    req.body.comment,
    req.body.userId,
    req.body.postId
  );
  console.log("POST post comment /comment");
  res.json(result);
});

module.exports = post;
