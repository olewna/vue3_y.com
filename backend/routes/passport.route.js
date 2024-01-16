const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/failure",
  }),
  (req, res) => {
    console.log("Zalogowano");
    res.json(req.user);
  }
);

router.get("/failure", (req, res) => {
  res.status(401).json({ msg: "Invalid username or password" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log("wylogowano");
    res.send({ msg: "Log out" });
  });
});

module.exports = router;
