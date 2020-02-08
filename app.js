// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Express app
const app = express();

// Controllers
const signup = require("./controllers/signup");
const login = require("./controllers/login");

// API
const userAPI = require("./controllers/userAPI");
app.use("/user", userAPI);

// Body parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// Connecting to mongodb
mongoose.connect("mongodb+srv://eric:eric@chat-app-srfip.mongodb.net/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => console.log("Made connection to mongodb"));
db.on("error", err => console.error(err));

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
  signup.isUsernameAvail,
  signup.registerNewUser,
  (req, res) => {
    res.redirect(`/home?id=${req.id}`);
  }
);

app.post("/login", login.loginUser, (req, res) => {
  if (req.user) {
    res.redirect(`/home?id=${req.user._id}`);
  } else res.redirect("/login/invalid");
});

// Listening to a port
app.listen(3000, () => console.log("Listening to port 3000"));
