// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Server = require("socket.io");

// Routers
const signupRouter = require("./controllers/router/signup");
const loginRouter = require("./controllers/router/login");
const homeRouter = require("./controllers/router/home");

// Express app
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("Listening to port 3000"));

// API
const userAPI = require("./controllers/apis/userAPI");
app.use("/user", userAPI);

const chatAPI = require("./controllers/apis/chatAPI");
app.use("/chat", chatAPI);

// Body parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// Connecting to mongodb
mongoose.connect(
  "mongodb+srv://eric:eric@chat-app-srfip.mongodb.net/chat-app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

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
const chatManager = require("./controllers/ChatManager");

const io = Server(server);
io.on("connection", socket => {
  socket.on("online", user => chatManager.addUserOnline(user, socket.id));
  socket.on("disconnect", () => chatManager.removeUserFromOnline(socket.id));

  socket.on("message", messageData => {
    const clients = chatManager.getOnlineUsersFromSameChat(messageData);
    const socketIDs = chatManager.getSocketIDsFromUsers(clients);
    socketIDs.forEach(id => io.sockets.to(id).emit("message", messageData));
  });
});
