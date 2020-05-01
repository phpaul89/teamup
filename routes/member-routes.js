// jshint esversion:8

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

// welcome page
router.get(
  "/private", // welcome.hbs
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allUsersPromise = User.find({});
    const allTeamsPromise = User.findOne({ _id: request.user._id }).populate(
      "myTeams"
    );
    const someHallsPromise = Hall.find();
    const friendsPromise = User.findOne({ _id: request.user._id }).populate(
      "myFriends"
    );

    //const schedulesPromise = User.findOne({ _id: request.user._id }).populate("mySchedules");

    const schedulesPromise = User.findOne({ _id: request.user._id })
      .populate({
        path: "mySchedules",
        populate: {
          path: "hall",
          model: "Hall",
        },
      })
      .populate({
        path: "mySchedules",
        populate: {
          path: "team",
          model: "Team",
        },
      });

    // parallel 'await'ing instead of sequential
    const [
      allUsers,
      allTeams,
      someHalls,
      allFriends,
      allSchedules,
    ] = await Promise.all([
      allUsersPromise,
      allTeamsPromise,
      someHallsPromise,
      friendsPromise,
      schedulesPromise,
    ]);

    response.render("member/welcome.hbs", {
      user: request.user,
      allUsers: allUsers,
      allTeams: allTeams.myTeams,
      someHalls: someHalls,
      friends: allFriends.myFriends,
      allSchedules: allSchedules,
    });
  }
);

// all members
router.get(
  "/private/allmembers",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allUsers = await User.find();

    response.render("member/all-members.hbs", {
      allUsers: allUsers,
      user: request.user,
    });
  }
);

// add friends
router.get("/addfriend", (request, response) => {
  response.render("member/add-friends.hbs");
});

router.post(
  "/addfriends",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const friendObjectId = await User.findOne({
      username: request.body.friend,
    });

    // works:
    if (friendObjectId._id.equals(request.user._id)) {
      console.log("cannot add yourself!");
      response.redirect("/private/allmembers");
    } else {
      User.updateOne(
        { _id: request.user._id },
        { $push: { myFriends: friendObjectId } }
      ).then((user) => {
        console.log(user);
        response.redirect("/private");
      });
    }
  }
);

// remove friends
// router.post(
//   "/removefriends",
//   ensureLogin.ensureLoggedIn(),
//   async (request, response) => {
//     const removeUser = request.body.friend;
//     const removeUserId = await User.find({ username: removeUser });
//     const theUser = await User.find({ _id: request.user._id }).populate(
//       "myFriends"
//     );

//     console.log(removeUserId);
//     console.log(removeUser._id);
//     console.log(theUser);

//     User.findOne({_id: request.user._id})

//     // User.update(
//     //   { _id: request.user._id },
//     //   { $pull: { myFriends: { $elemMatch: { _id: removeUserId._id } } } }
//     // ).then((user) => {
//     //   console.log(user);
//     //   console.log("removed");
//     //   response.redirect("/private");
//     // });
//   }
// );

router.get("/get-marker", async (request, response) => {
  // '.lean()' has to be added to be able to push coordinates as a new property in 'getCoordinates()'
  const someHalls = await Hall.find().lean();
  let updatedHalls = [];

  //console.log("1");
  //console.log("Here: ", updatedHalls);

  let token =
    "pk.eyJ1IjoicGhwYXVsODkiLCJhIjoiY2s5anB3dnAxMDBjdzNlcDk3ZXNjb2VqNiJ9.3F5ihEH6D8CIfUm_WN1yvw";

  let query = (street, city, zip, token) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${street}_${city}_${zip}.json?types=address&access_token=${token}`;
  };

  //console.log("2");

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

  //console.log("3");

  await getCoordinates(someHalls);

  //console.log("4");
  //console.log("Here again: ", updatedHalls);
  //console.log(updatedHalls);

  response.send(updatedHalls);
});

router.post(
  "/join-team",
  ensureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    // insert 'User' into 'Team' property 'teamMembers'

    // request.user -> logged in user
    // push this user into teamMembers
    const teamObjectId = await Team.findOne({ teamName: request.body.team });

    User.updateOne(
      { _id: request.user._id },
      { $push: { myTeams: teamObjectId } }
    )
      .then((x) => {
        Team.update(
          { teamName: request.body.team },
          { $push: { teamMembers: request.user._id } }
        )
          .then((x) => {
            console.log(x);
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
);

router.post(
  "/addschedule",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const {
      testDate,
      slots,
      teamSelectorDropDown,
      hallNameSelected,
    } = request.body;
    const teamObjectId = await Team.findOne({ teamName: teamSelectorDropDown });

    console.log(
      testDate,
      slots,
      teamSelectorDropDown,
      teamObjectId,
      hallNameSelected
    );

    // get the value of the checkbox in popup at marker, then:
    const hallObjectId = await Hall.findOne({ name: hallNameSelected });

    await Schedule.create({
      date: testDate,
      timeSlot: slots,
      hall: hallObjectId,
      team: teamObjectId,
    })
      .then(async (schedule) => {
        console.log(schedule);
        await User.updateMany(
          { myTeams: teamObjectId },
          { $push: { mySchedules: schedule } }
        ).then((x) => {
          response.redirect("/private");
        });
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
    //console.log(request.params.id);
    const theHall = await Hall.findById(request.params.id);
    const userTeams = await Team.find({ teamMembers: request.user._id });

    response.render("member/detail.hbs", {
      hall: theHall,
      userTeams: userTeams,
      message: request.flash("error"),
    });
  }
);

// DOESN'T WORK?
router.post(
  "/removefriends/:id",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.params.id);
    console.log(request.user._id);

    const uId = await User.find({ _id: request.params.id });

    User.find({ _id: request.params.id }).then((a) => {
      User.updateMany(
        { _id: request.user._id },
        { $pull: { myFriends: { uId } } }
      ).then((x) => {
        console.log(x);
        response.redirect("/private");
      });
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

router.post("/spots", async (request, response) => {
  const { date, hallName } = request.body;
  //console.log(date, hallName);

  const hallObjectId = await Hall.findOne({ name: hallName });

  //console.log(hallObjectId);

  const timeSlotsFilled = await Schedule.findOne({
    date: date,
    hall: hallObjectId,
  });
  console.log(timeSlotsFilled);
  //console.log(timeSlotsFilled.timeSlot);

  response.send(timeSlotsFilled.timeSlot);
});

module.exports = router;
