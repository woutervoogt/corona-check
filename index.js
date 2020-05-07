// ------ Adding dependancies ------
var express = require("express"),
  bodyParser = require("body-parser"),
  dotEnv = require("dotenv").config(),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  passport = require("passport"),
  User = require("./models/User.js"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

// ------ Adding route dependancies ------

var indexRoutes = require("./routes/index_routes.js");

/* ------ Setting up dependancies and connections ------ */

// ... express ...
var app = express();

// ... mongoose ...
const dbLocation =
  process.env.DATABASELOCATION || "mongodb://localhost/corona_check";
mongoose
  .connect(dbLocation, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Corona Check DB");
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

// ... bodyparser ...
app.use(bodyParser.urlencoded({ extended: true }));
// ... passport ...
app.use(
  expressSession({
    secret: process.env.PASSPORTSECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//... adding user info to all routes ...
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ... static files ...
app.use(express.static("stylesheets"));
app.use(express.static("images"));
app.use(express.static("public"));

// ... Using router ...
app.use(indexRoutes);

////////////////////////////////////////////////////////////////////////////////////
// ......------ Listnening to server------......
////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Corona Check server is running at http://localhost:${port}`);
});
