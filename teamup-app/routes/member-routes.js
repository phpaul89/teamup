const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const User = require("../models/User-model.js");
const Team = require("../models/Team-model.js");
const Hall = require("../models/Hall-model.js");

router.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allUsers = await User.find({});
    const allTeams = await Team.find({});
    const someHalls = await Hall.find();
    response.render("member/welcome.hbs", {
      user: request.user,
      allUsers: allUsers,
      allTeams: allTeams,
      someHalls: someHalls,
    });
  }
);

router.get(
  "/join-team/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    // insert 'User' into 'Team' property 'teamMembers'

    // request.user -> logged in user
    // push this user into teamMembers

    Team.update(
      { _id: request.params.id },
      { $push: { teamMembers: request.user.id } }
    )
      .then((x) => {
        console.log(x);
      })
      .catch((error) => {
        console.log(error);
        next();
      });
  }
);

router.get(
  "/hall-detail/:id",
  ensureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    console.log(request.params.id);
    const theHall = await Hall.findById(request.params.id);
    console.log(theHall);
    response.render("member/detail.hbs", { hall: theHall });
  }
);

// router.post(
//   "/book-hall/:id",
//   ensureLogin.ensureLoggedIn(),
//   (request, response, next) => {
//     console.log(request.params.id); // hallID
//     console.log(request.user.id); // userID
//     const { xyz } = request.body;
//     console.log(xyz);
//     // works
//   }
// );

module.exports = router;
