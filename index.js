// ------ Adding dependancies ------
var express =    require("express"),
    bodyParser = require("body-parser"),
    mongoose =   require("mongoose"),
    expressSession = require("express-session"),
    passport = require('passport'),
    User = require("./models/User.js"),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require("passport-local-mongoose"),


// ------ Adding route dependancies ------

var indexRoutes = require("./routes/index_routes.js"),


/* ------ Setting up dependancies and connections ------ */

// ... express ...   
var app = express();










// ... mongoose ...
// Voeg nog een locatie van de database toe !!!!!!!!!!!!!!!!!
// !!!!!!! mongoose.connect('mongodb://localhost/addOurPath', {useNewUrlParser: true});








// ... bodyparser ...
app.use(bodyParser.urlencoded({extended: true}));
// ... passport ...
app.use(expressSession(
    {
        secret: "we hebben een secret nodig",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//... adding user info to all routes ...
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

// ... static files ...
app.use(express.static('stylesheets'));
app.use(express.static("images"));

// ... Using router ...
app.use(indexRoutes);


////////////////////////////////////////////////////////////////////////////////////
// ......------ Listnening to server------......
////////////////////////////////////////////////////////////////////////////////////

app.listen(3000, function(){
    console.log("scratch server is listening");
});