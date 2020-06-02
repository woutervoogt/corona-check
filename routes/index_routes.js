//================================================================================
// Dependancies.
//================================================================================

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/user.js"),
  YTSearchData = require("../models/yt-data"),
  ReviewedChannel = require("../models/reviewed-channel"),
  youtubeAPI = require("../controllers/youtube-api.js"),
  authentication = require("../controllers/authentication.js");

//================================================================================
// Setting up dependancies
//================================================================================

const router = express.Router();
let timer = false;

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

router.get("/dashboard", authentication.isExpert, async function (req, res) {
  if (timer === true) {
    timer = false;
    setTimeout(function () {
      timer = true;
    }, 300000);

    await updateRoute().then(async () => {
      await youtubeAPI.videoInfo().then(async () => {
        YTSearchData.find({}, async function (err, allVideos) {
          // comment Alwin: Dit wacht nu niet op je update.
          if (err) {
            console.log(err);
          } else {
            console.log("hij gaat via de else");
            res.render("expertpage.ejs", { data: allVideos });
          }
        });
      });
    });

    async function updateRoute() {
      await youtubeAPI.searchList();
    }
  } else {
    YTSearchData.find({}, function (err, allVideos) {
      // comment Alwin: Dit wacht nu niet op je update.
      if (err) {
        console.log(err);
      } else {
        res.render("expertpage.ejs", { data: allVideos });
      }
    });
  }
});

router.post("/dashboard", authentication.isExpert, function (req, res) {
  //Als yt-data wordt ververst, kan de video info niet gevonden worden.
  //Mogelijke oplossing; database opruimen moet losgemaakt worden van nieuwe info opvragen
  YTSearchData.findById(req.body.dbID, function (err, foundVideo) {
    if (err) {
      console.log(err);
    } else {
      const author = {
        id: req.user._id,
        name: req.user.username,
      };
      const newReview = {
        videoTitle: foundVideo.videoTitle,
        videoId: foundVideo.videoId,
        videoDescription: foundVideo.videoDescription,
        viewCount: foundVideo.viewCount,
        channelTitle: foundVideo.channelTitle,
        channelId: foundVideo.channelId,
        score: req.body.trustscore,
        explanation: req.body.score_explanation,
        publish: req.body.publish,
        author: author,
      };

      ReviewedChannel.create(newReview, function (err, newlyCreated) {
        if (err) {
          console.log(err);
        } else {
          console.log(newlyCreated);
          res.redirect("back");
        }
      });
    }
  });
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
  res.render("registerpage.ejs");
});

// ------ Post ------ //
router.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("back");
      });
    }
  });
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
    successRedirect: "back",
    failureRedirect: "/register",
  }),
  function (req, res) {}
);

//================================================================================
// Logout routes
//================================================================================

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("back");
});

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
