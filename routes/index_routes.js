let dataOld = true;
//================================================================================
// Dependancies.
//================================================================================

var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/User.js"),
  YTSearchData = require("../models/yt-data"),
  youtubeAPI = require("../controllers/youtube-api.js");

//================================================================================
// Setting up dependancies
//================================================================================

var router = express.Router();

//================================================================================
// Index Routes
//================================================================================

router.get("/", function (req, res) {
  res.render("landing.ejs");
});

//================================================================================
// Under construction route
//================================================================================

router.get("/under_construction", function (req, res) {
  res.render("under_construction.ejs");
});

//================================================================================
// Expert User Routes
//================================================================================

router.get("/dashboard", function (req, res) {
  console.log(dataOld);
  if (dataOld === true) {
    console.log("doet ie het");
    setTimeout(() => {
      dataOld = true;
    }, 3600000);
    getNewData().then(() => render());
  } else {
    console.log("nee");
    render();
  }

  async function getNewData() {
    await youtubeAPI.searchList().then(() => youtubeAPI.videoInfo());
    return (dataOld = false);
  }

  function render() {
    YTSearchData.find({}, function (err, allVideos) {
      if (err) {
        console.log(err);
      } else {
        res.render("expertpage.ejs", { data: allVideos });
      }
    });
  }

  // let minusOneHourDate = new Date(Date.now() - 360); //3600000

  //   let minusOneHourDate = new Date(Date.now() - 360); //3600000
  //   YTSearchData.find(
  //     {
  //       createdAt: {
  //         $lt: minusOneHourDate,
  //       },
  //     },
  //     function (err, oldVideos) {
  //       if (err) {
  //         console.log(err);
  //       } else if (oldVideos.length) {
  //         getNewData();
  //         console.log("New Youtube Search Data");
  //       }
  //     }
  //   );

  //   async function getNewData() {
  //     await youtubeAPI.searchList().then(() => youtubeAPI.videoInfo());
  //   }

  //   YTSearchData.find({}, function (err, allVideos) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("expertpage.ejs", { data: allVideos });
  //     }
  //   });
});

//================================================================================
// Test routes
//================================================================================

router.post("/test", function (req, res) {
  console.log(req.body.loginUsername);
  console.log(req.body.loginPassword);
  res.redirect("/login");
});

router.get("/test1", function (req, res) {
  res.render("search_page.ejs");
});

router.get("/test2", function (req, res) {
  res.render("public_overview.ejs");
});

router.get("/test3", function (req, res) {
  res.render("expertpage.ejs");
});

//================================================================================
// Register routes
//================================================================================

// ------ Get ------ //
router.get("/register", function (req, res) {
  res.render("registerform.ejs");
});

// ------ Post ------ //
router.post("/register", function (req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
});

//================================================================================
// Login routes
//================================================================================

// ------ Get ------ //

router.get("/login", function (req, res) {
  res.render("loginpage.ejs");
});

// ------ Post ------ //

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projectspage",
    failureRedirect: "/register",
  }),
  function (req, res) {}
);

//================================================================================
// Middleware
//================================================================================

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//================================================================================
// Export
//================================================================================

module.exports = router;
