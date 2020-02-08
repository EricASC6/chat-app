const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bodyParser = require("body-parser");

// Setting up parser
router.use(bodyParser.json());

// GET Requests
router.get("/", async (req, res) => {
  const queries = req.query;
  const username = queries.username;

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.json({ ok: true, user: user });
    } else {
      res.json({ ok: false, user: null });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: "Something went wrong" });
  }
});

// POST Request
router.post("/", async (req, res) => {
  console.log(req.body);

  const { id, newContact } = req.body;

  try {
    const srcUser = await User.findById(id);
    if (srcUser) {
      srcUser.contacts.unshift(newContact);
      await srcUser.save();
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
