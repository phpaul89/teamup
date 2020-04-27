const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/User-model.js");

// get URL /signup -> do stuff

router.get("/signup", (request, response) => {
  response.render("auth/signup.hbs");
});

router.post("/signup", (request, response, next) => {
  // get username, password, email, then create user
  const { username, password, email } = request.body;

  //console.log(username);

  // existing user via username? yes, no -> if no: create User

  /* if(USER exists){
    console.log("user exists already");
    return
  } else {
    ... create user somehow
  }
  */

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
          //response.redirect("/login");
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  });
});

module.exports = router;
