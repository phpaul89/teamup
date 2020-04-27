const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const Team = require("../models/Team-model.js");

// get URL /signup -> do stuff

router.get("/team-signup", (request, response) => {
  response.render("team/team-signup.hbs");
});

router.post("/team-signup", (request, response, next) => {
  // get username, password, email, then create user
  const { teamName } = request.body;

  Team.findOne({ teamName }).then((exists) => {
    if (exists !== null) {
      console.log("Team exists already");
      response.render("team/team-signup.hbs"); //, {message: "Username already exists"});
    } else {
      Team.create({
        teamName: teamName,
      })
        .then((team) => {
          console.log(team);
          response.redirect("/");
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  });
});

module.exports = router;
