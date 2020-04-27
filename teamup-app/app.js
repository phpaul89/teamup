require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash"); // error handling
const User = require("./models/User-model.js");

mongoose
  .connect("mongodb://localhost/teamup-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup 'session' secret for authentication/login functionality
app.use(
  session({
    // refer to '.env' for actual secret
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//// Passport setup for authentication/login functionality, see lecture
// '.serializeUser' is used to saved user id in the session
passport.serializeUser((user, next) => {
  next(null, user._id);
});

// '.deserializeUser' is used to retrieve the whole User object later via the user id in '.serializeUser'
passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((found) => next(null, found))
    .catch((error) => {
      console.log(error);
      next();
    });
});

app.use(flash());
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (request, username, password, next) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return next(null, false, { message: "Incorrect credentials" });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: "Incorrect credentials" });
          }
          return next(null, user);
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index.js");
app.use("/", index);

const auth = require("./routes/auth-routes.js");
app.use("/", auth);

const member = require("./routes/member-routes.js");
app.use("/", member);

const team = require("./routes/team-routes.js");
app.use("/", team);

module.exports = app;
