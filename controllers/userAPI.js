const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Contact = require("../models/Contact").model;
const bodyParser = require("body-parser");

// Setting up parser
router.use(bodyParser.json());

// GET Requests
router.get("/", async (req, res) => {
  const queries = req.query;
  if (queries.id && queries.username) {
    res.redirect(`user/${queries.id}/${queries.username}`);
    return;
  }

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

router.get("/:id/:username", async (req, res) => {
  const { id, username } = req.params;
  try {
    const srcUser = await User.findById(id);
    console.log(srcUser);
    const contact = await srcUser.contacts.filter(
      contact => contact.username === username
    )[0];
    if (contact) {
      res.json({ ok: true, contact: contact });
    } else {
      res.json({ ok: false, contact: null });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: "Something went wrong" });
  }
});

// POST Request
router.post("/", async (req, res) => {
  const { id, newContact } = req.body;

  try {
    const srcUser = await User.findById(id);
    if (srcUser) {
      const newContactDoc = new Contact(newContact);
      srcUser.contacts.unshift(newContactDoc);
      await srcUser.save();
      // Need to send back res
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
