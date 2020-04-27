const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const User = require("../models/User-model.js");
const Team = require("../models/Team-model.js");

router.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allUsers = await User.find({});
    const allTeams = await Team.find({});
    response.render("member/welcome.hbs", {
      user: request.user,
      allUsers: allUsers,
      allTeams: allTeams,
    });
  }
);

module.exports = router;
