const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
  (_req, res) => {
    console.log("Zalogowano");
    res.send({ msg: "zalogowano" });
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log("wylogowano");
    res.redirect("/login");
  });
});

module.exports = router;
