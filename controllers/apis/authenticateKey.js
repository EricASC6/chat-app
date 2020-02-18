const User = require("../../models/User");

const authenticateKey = async (req, res, next) => {
  const KEY = req.query.key;
  const isValidKey = await User.findById(KEY);
  if (isValidKey) next();
  else res.status(400).json({ ok: false, error: "Invalid Key" });
};

module.exports = authenticateKey;
