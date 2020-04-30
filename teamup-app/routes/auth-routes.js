//

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const User = require("../models/User-model.js");

//
router.get("/signup", (request, response) => {
  response.render("auth/signup.hbs");
});

router.post("/signup", (request, response, next) => {
  // get username, password, email, then create user
  const { username, password, email } = request.body;

  // read: if 'username' or 'email' already exists, then error
  User.findOne({ $or: [{ username }, { email }] }).then((exists) => {
    if (exists !== null) {
      request.flash("error", "Cannot signup with this credentials.");
      response.render("auth/signup.hbs", {
        message: request.flash("error"),
      });
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

// LOGIN WITH GOOGLE (without sign up)
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private",
    failureRedirect: "/", // here you would redirect to the login page using traditional login approach
  })
);

// LOGIN WITH FACEBOOK (without sign up)
// router.get("/auth/facebook", passport.authenticate("facebook"));
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/private",
//     failureRedirect: "/", // here you would redirect to the login page using traditional login approach
//   })
// );

router.get("/logout", ensureLogin.ensureLoggedIn(), (request, response) => {
  request.logout();
  response.redirect("/");
});

module.exports = router;
