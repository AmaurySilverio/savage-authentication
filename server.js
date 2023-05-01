// server.js

// set up ======================================================================
// get all the tools we need
var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose"); //another way of talking to mongodb, supports schemas
var passport = require("passport"); // used to handle authentication
var flash = require("connect-flash"); // for error messages

var morgan = require("morgan"); //logger
var cookieParser = require("cookie-parser"); //enables us to look at cookies, text files on computer
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js"); // allows us to pull from our database

var db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passport, db);
}); // connect to our database

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //all static folders are served up without setting up individual routes

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rcbootcamp2023a", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================
app.listen(port);
console.log("The magic happens on port " + port);
