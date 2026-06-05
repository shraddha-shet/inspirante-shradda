const jwt = require("jsonwebtoken");
const SECRET = "inspirante_2026_super_secret";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decodedUser;
    next();
  });
}

module.exports = { authenticate, SECRET };
