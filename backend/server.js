const express = require("express");
require("dotenv").config();
const fs = require("fs");
const user = require("./routes/user.route");
const post = require("./routes/post.route");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", user);
app.use("/api/posts", post);

const server = require("https").createServer(
  {
    key: fs.readFileSync("./ssl/example.key"),
    cert: fs.readFileSync("./ssl/example.crt"),
  },
  app
);

server.listen(process.env.PORT, () => {
  console.log(`Serwer Express działa na porcie ${process.env.PORT | 3044}`);
});
