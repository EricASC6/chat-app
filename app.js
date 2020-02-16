// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Server = require("socket.io");

// Express app
const app = express();
const server = app.listen(3000, () => console.log("Listening to port 3000"));

// Routers
const signupRouter = require("./controllers/router/signup");
const loginRouter = require("./controllers/router/login");
const homeRouter = require("./controllers/router/home");

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

// Welcome Page
app.get("/", (req, res) => res.render("welcome"));

// Routes
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

// Chat Functionality
const io = Server(server);
io.on("connection", socket => {
  console.log("Hi");
});
