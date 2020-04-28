const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const axios = require("axios");
const User = require("../models/User-model.js");
const Team = require("../models/Team-model.js");
const Hall = require("../models/Hall-model.js");
const Schedule = require("../models/Schedule-model.js");

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

router.get("/get-marker", async (request, response) => {
  // '.lean()' has to be added to be able to push coordinates as a new property in 'getCoordinates()'
  const someHalls = await Hall.find().lean();
  let updatedHalls = [];

  console.log("1");
  console.log("Here: ", updatedHalls);

  let token =
    "pk.eyJ1IjoicGhwYXVsODkiLCJhIjoiY2s5anB3dnAxMDBjdzNlcDk3ZXNjb2VqNiJ9.3F5ihEH6D8CIfUm_WN1yvw";

  let query = (street, city, zip, token) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${street}_${city}_${zip}.json?types=address&access_token=${token}`;
  };

  console.log("2");

  async function getCoordinates(halls) {
    for (let hall of halls) {
      const {
        data: { features },
      } = await axios.get(query(hall.street, hall.city, hall.zip, token));
      hall["coordinates"] = features[0].center;
      //console.log("got coordinates: ", hall.coordinates);
      //console.log("new hall: ", hall);
      updatedHalls.push(hall);
    }
    return null;
  }

  console.log("3");

  await getCoordinates(someHalls);

  console.log("4");
  //console.log("Here again: ", updatedHalls);
  console.log(updatedHalls);

  response.send(updatedHalls);
});

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

    response.render("member/detail.hbs", {
      hall: theHall,
      userTeams: userTeams,
      message: request.flash("error"),
    });
  }
);

router.post(
  "/book-hall/:id",
  ensureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    // get all required values for Schedule Schema:
    const { bookingDate, slots, teamBooking } = request.body;
    // as 'hall' and 'team' requires 'Schema.Types.ObjectId' -> get whole Object:
    const hallObjectId = await Hall.findOne({ _id: request.params.id });
    const teamObjectId = await Team.findOne({ teamName: teamBooking });

    Schedule.findOne({
      date: bookingDate,
      timeSlot: slots,
      hall: hallObjectId,
      team: teamObjectId,
    }).then((exists) => {
      if (exists !== null) {
        console.log("Schedule exists already");
        response.redirect("/private");
      } else {
        Schedule.create({
          date: bookingDate,
          timeSlot: slots,
          hall: hallObjectId,
          team: teamObjectId,
        })
          .then((schedule) => {
            console.log(schedule);
            response.redirect("/private");
          })
          .catch((error) => {
            console.log(error);
            next();
          });
      }
    });
  }
);

router.post("/spots", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
