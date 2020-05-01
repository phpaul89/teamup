// jshint esversion:8

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const Team = require("../models/Team-model.js");
const User = require("../models/User-model.js");

// get URL /signup -> do stuff

router.get(
  "/team-signup",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const userObjectId = await User.findOne({
      _id: request.user._id,
    }).populate("myFriends");

    response.render("team/team-signup.hbs", {
      user: userObjectId.myFriends,
      loggedInUser: request.user,
    });
  }
);

router.post("/team-signup", async (request, response, next) => {
  // get username, password, email, then create user
  const { teamName, teamMembers } = request.body;

  console.log(teamName, teamMembers);

  Team.findOne({ teamName }).then((exists) => {
    if (exists !== null) {
      console.log("Team exists already");
      response.render("team/team-signup.hbs"); //, {message: "already exists"});
    } else {
      Team.create({
        teamName: teamName,
      })
        .then((team) => {
          console.log(team);
          User.updateOne(
            { _id: request.user._id },
            { $push: { myTeams: team } }
          )
            .then((added) => {
              console.log(teamMembers);
              teamMembers.forEach(async (friend) => {
                console.log(friend);
                let friendObjectId = await User.findOne({ username: friend });
                console.log(friendObjectId);
                await Team.updateOne(
                  { _id: team },
                  { $push: { teamMembers: friendObjectId } }
                );
              });
              response.redirect("/private");
            })
            .catch((error) => {
              console.log(error);
              next();
            });
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  });
});

// all teams
router.get(
  "/private/allteams",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allTeams = await Team.find();
    //const allUsers = await User.find();
    response.render("team/all-teams.hbs", {
      allTeams: allTeams,
      loggedInUser: request.user,
    });
  }
);

router.post(
  "/private/allteams",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const team = request.body;
    const teamObjectId = await Team.findOne({ teamName: team });
    console.log("team", team);
    console.log("team Object Id", teamObjectId);

    // const loggedInUser = request.user;
    // console.log("logged In User", loggedInUser);
    // console.log("logged In User Id", loggedInUser._id);

    // User.updateOne(
    //   { _id: loggedInUser._id },
    //   { $push: { myTeams: teamObjectId } }
    // ).then((user) => {
    //   console.log(user);
    // });
  }
);

module.exports = router;
