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
app.use(express.static("src"));
app.use(express.static("public"));

// GET Requests

// Welcome Page
app.get("/", (req, res) => {
  res.render("welcome");
});

// Testing purposes only b/c cannot connect to db
app.get("/user", (req, res) => {
  res.render("home");
});

// Signup Page
app.get("/signup/:isInvalid?", (req, res) => {
  let error = req.params.isInvalid === "invalid" ? "User already exists" : "";
  res.render("signup", { error: error });
});

// Login Page
app.get("/login/:isInvalid?", (req, res) => {
  let error =
    req.params.isInvalid === "invalid" ? "Incorrect username or password" : "";
  res.render("login", { error: error });
});

// User page
app.get("/home", login.authenicateId, (req, res) => {
  res.render("home");
});

// POST Requests
app.post(
  "/signup",
  urlencodedParser,
  signup.isUsernameAvail,
  signup.registerNewUser,
  (req, res) => {
    res.redirect("/home");
  }
);

app.post("/login", urlencodedParser, login.loginUser, (req, res) => {
  if (req.user) {
    res.redirect(`/home?id=${req.user._id}`);
  } else res.redirect("/login/invalid");
});

// Listening to a port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
