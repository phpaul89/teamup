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
    const userTeams = await Team.find({ teamMembers: request.user._id });

    const slots = ["8-9", "9-10", "10-11"];
    const slotsBooked = await Hall.find(
      { _id: request.params.id }.then(),
      "slotsBooked"
    ); // --> CHECK for correct query/logic

    console.log(slotsBooked);
    console.log(typeof slotsBooked);
    console.log("---------");

    const slotsAvailable = slots.filter((slot) => !slotsBooked.includes(slot));

    console.log(theHall);
    console.log(userTeams);
    console.log(slotsAvailable);
    console.log(typeof slotsAvailable);
    // response.render("member/detail.hbs", {
    //   hall: theHall,
    //   userTeams: userTeams,
    // });
  }
);

router.post("/book-hall/:id");

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
