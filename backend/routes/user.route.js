const Router = require("express").Router;
const userModel = require("../models/user.model");
const user = Router();

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};

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

user.get("/", authMiddleware, async (req, res) => {
  const result = await userModel.findAll();
  console.log("GET user /");
  res.json(result);
});

user.get("/:id", authMiddleware, async (req, res) => {
  const result = await userModel.findById(req.params.id);
  console.log("GET user /:id");
  res.json(result);
});

user.post("/", async (req, res) => {
  console.log("POST user /");
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  } else {
    const resu = await userModel.findByLoginOrEmail(
      req.body.login,
      req.body.email
    );
    if (resu.records.length > 0) {
      res.status(401).send("Login lub email zajęty.");
    } else {
      const result = await userModel.create(req.body);
      res.json(result);
    }
  }
});

user.post("/follow", authMiddleware, async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  console.log("POST user /follow");
  const user = await userModel.createFollowRelation(
    req.body.follow,
    req.body.isFollowed
  );
  res.json(user);
});

user.post("/unfollow", authMiddleware, async (req, res) => {
  if (!bodyNotEmpty(req.body)) {
    res.status(401).send("Body is missing parameters");
  }
  console.log("POST user /unfollow");
  const user = await userModel.deleteFollowRelation(
    req.body.follow,
    req.body.isFollowed
  );
  res.json(user);
});

user.get("/follow/:id", authMiddleware, async (req, res) => {
  const result = await userModel.findFollowedUsers(req.params.id);
  console.log("GET followed /follow/:id");
  res.json(result);
});

user.get("/notfollow/:id", authMiddleware, async (req, res) => {
  const result = await userModel.findNotFollowedUsers(req.params.id);
  console.log("GET notfollowed /notfollow/:id");
  res.json(result);
});

module.exports = user;
