const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function userExtractor(req, res, next) {
  const auth = req.get("authorization");
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) return res.status(401).json({ error: "Invalid token" });
    const [user] = await db
      .promise()
      .query(
        "SELECT id, username, email FROM users WHERE id = ?",
        decodedToken.id
      );
    const [userProfile] = await db
      .promise()
      .query(
        "SELECT firstname, lastname FROM user_profiles WHERE user_id = ?",
        user[0].id
      );
    const [store] = await db
      .promise()
      .query("SELECT id FROM stores WHERE user_id = ?", user[0].id);
    req.user = { ...user[0], ...userProfile[0], storeId: store[0]?.id };
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = userExtractor;
