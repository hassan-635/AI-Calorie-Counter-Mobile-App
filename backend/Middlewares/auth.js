const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Token header se pakrein
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Yahan user object set ho raha hai (jis mein id hoti hai)
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
