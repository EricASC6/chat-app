// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Controllers
const signup = require("./controllers/signup");

// Body parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Express app
const app = express();

// Connecting to mongodb
mongoose.connect("mongodb+srv://eric:eric@chat-app-srfip.mongodb.net/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .once("open", () => {
    console.log("Connection to mongodb");
  })
  .on("error", err => {
    console.error(err);
  });

// Using ejs engine
app.set("view engine", "ejs");

// Serving static files
app.use("/src", express.static("src"));

/**
 * GET Requests
 * */

// Welcome Page
app.get("/", (req, res) => {
  res.render("welcome");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// User page
app.get("/user", (req, res) => {
  res.send("New User");
});

/**
 * POST Requests
 */
app.post("/signup", urlencodedParser, signup.registerNewUser, (req, res) => {
  res.redirect("/user");
});

// Listening to a port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
