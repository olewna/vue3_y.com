const Router = require("express").Router;
const userModel = require("../models/user.model");
const user = Router();

function ensureAuthenticated(req, res, next) {
  console.log("REQ: " + req.isAuthenticated());
  console.log(req.session);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: "Persmission denied!" });
}

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

user.get("/", ensureAuthenticated, async (req, res) => {
  const result = await userModel.findAll();
  console.log("GET user /");
  res.json(result);
});

user.get("/:id", ensureAuthenticated, async (req, res) => {
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

module.exports = user;
