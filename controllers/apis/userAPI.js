const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const DBManager = require("../DBManager");

// Setting up parser
router.use(bodyParser.json());

// // GET Requests
// router.get("/", async (req, res) => {
//   const queries = req.query;
//   if (queries.id && queries.username) {
//     res.redirect(`user/${queries.id}/${queries.username}`);
//     return;
//   }

//   const username = queries.username;

//   try {
//     const user = await User.findOne({ username: username });
//     if (user) {
//       res.json({ ok: true, user: user });
//     } else {
//       res.json({ ok: false, user: null });
//     }
//   } catch (err) {
//     res.status(500).json({ ok: false, error: "Something went wrong" });
//   }
// });

// router.get("/:id/:username", async (req, res) => {
//   const { id, username } = req.params;
//   try {
//     const srcUser = await User.findById(id);
//     console.log(srcUser);
//     const contact = await srcUser.contacts.filter(
//       contact => contact.username === username
//     )[0];
//     if (contact) {
//       res.json({ ok: true, contact: contact });
//     } else {
//       res.json({ ok: false, contact: null });
//     }
//   } catch (err) {
//     res.status(500).json({ ok: false, error: "Something went wrong" });
//   }
// });

// // POST Request
// router.post("/", async (req, res) => {
//   const { id, newContact } = req.body;

//   try {
//     const srcUser = await User.findById(id);
//     if (srcUser) {
//       const newContactDoc = new Contact(newContact);
//       srcUser.contacts.unshift(newContactDoc);
//       await srcUser.save();
//       res.json({ ok: true });
//     }
//   } catch (err) {
//     res.status(500).json({
//       ok: false
//     });
//   }
// });

// GET Requests Middleware
const authenticateKey = async (req, res, next) => {
  const KEY = req.query.key;
  const isValidKey = await DBManager.getUser({ _id: KEY });
  if (isValidKey) next();
};

const getUserDataByID = async (req, res, next) => {
  const userID = req.query.user_id;
  const user = await DBManager.getUser({ _id: userID });
  const { fullname, bio } = user;
  const userData = {
    fullname: fullname,
    bio: bio
  };

  req.userData = userData;
  next();
};

const sendResponse = (statusCode, data) => {};

router.get("/", authenticateKey, getUserDataByID);

module.exports = router;
