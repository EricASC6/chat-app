// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Controllers
const signup = require("./controllers/signup");
const login = require("./controllers/login");

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
app.use(express.static("./src"));

/**
 * GET Requests
 * */

// Welcome Page
app.get("/", (req, res) => {
  res.render("welcome");
});

// Signup Page
app.get("/signup/:isInvalid?", (req, res) => {
  let isInvalid = req.params.isInvalid;
  if (isInvalid === "invalid") console.log("User already exists");
  res.render("signup");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// User page
app.get("/user", (req, res) => {
  res.send("New User");
});

app.get("/home/:userId", (req, res) => {
  res.send(req.params.userId);
});

/**
 * POST Requests
 */
app.post(
  "/signup",
  urlencodedParser,
  signup.isUsernameAvail,
  signup.registerNewUser,
  (req, res) => {
    res.redirect("/user");
  }
);

app.post("/login", urlencodedParser, login.loginUser, (req, res) => {
  if (req.loggedin) res.redirect(`/home/user=${req.userId}`);
  else res.redirect("/login");
});

// Listening to a port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
