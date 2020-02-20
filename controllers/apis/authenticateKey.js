const User = require("../../models/User");

const authenticateKey = async (req, res, next) => {
  try {
    const KEY = req.query.key;
    const isValidKey = await User.findById(KEY);
    if (isValidKey) next();
    else res.status(400).json({ ok: false, error: "Invalid Key" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server Error" });
  }
};

module.exports = authenticateKey;
