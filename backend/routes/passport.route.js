const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/api/failure",
//   }),
//   (req, res) => {
//     console.log("Zalogowano");
//     res.json(req.user);
//   }
// );

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, (err) => {
      res.send(user);
    });
  })(req, res, next);
});

// router.get("/failure", (req, res) => {
//   res.status(401).json({ msg: "Invalid username or password" });
// });

router.get("/logout", function (req, res) {
  req.logout();

  console.log("logged out");

  return res.send();
});

module.exports = router;
