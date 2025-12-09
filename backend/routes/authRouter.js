const express = require("express");
const passport = require("passport");
const authRouter = express.Router();

// LOGIN with Passport local strategy
authRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/sign-in",
  })
);

// LOGOUT
authRouter.get("/sign-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/sign-in");
  });
});

module.exports = authRouter;
