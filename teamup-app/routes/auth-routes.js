const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const User = require("../models/User-model.js");

// get URL /signup -> do stuff

router.get("/signup", (request, response) => {
  response.render("auth/signup.hbs");
});

router.post("/signup", (request, response, next) => {
  // get username, password, email, then create user
  const { username, password, email } = request.body;

  User.findOne({ username }).then((exists) => {
    if (exists !== null) {
      console.log("Username exists already");
      response.render("auth/signup.hbs"); //, {message: "Username already exists"});
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username: username,
        password: hashPass,
        email: email,
      })
        .then((user) => {
          console.log(user);
          response.redirect("/login");
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  });
});

router.get("/login", (request, response) => {
  response.render("auth/login.hbs", { message: request.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get("/logout", (request, response) => {
  request.logout();
  response.redirect("/");
});

module.exports = router;
