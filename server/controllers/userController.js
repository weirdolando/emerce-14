const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function auth(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Required field cannot be empty" });
  try {
    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", email);
    if (!user.length)
      return res.status(401).json({ error: "Email is not registered" });
    const isValid = bcrypt.compareSync(password, user[0].password);
    if (!isValid) return res.status(401).json({ error: "Password incorrect" });
    // !FIXME: Change expires to a longer time in production
    const token = jwt.sign({ id: user[0].id }, process.env.SECRET, {
      expiresIn: "5s",
    });
    return res.status(200).json({
      message: "Login success",
      data: { username: user[0].username, email: user[0].email },
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function register(req, res) {
  const { email, password, phone, firstname, lastname, username } = req.body;

  if (!email || !password || !phone || !firstname || !lastname || !username) {
    return res.status(400).json({ error: "Required field cannot be empty" });
  }

  const saltRounds = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  try {
    await db.promise().query("START TRANSACTION");
    await db
      .promise()
      .query("INSERT INTO users (username, email, password) VALUES(?, ?, ?)", [
        username,
        email,
        hashPassword,
      ]);
    const [user] = await db
      .promise()
      .query("SELECT id FROM users WHERE username = ? AND email = ?", [
        username,
        email,
      ]);
    const userId = user[0].id;
    await db
      .promise()
      .query(
        "INSERT INTO user_profiles (user_id, firstname, lastname) VALUES(?, ?, ?)",
        [userId, firstname, lastname]
      );
    const [userProfile] = await db
      .promise()
      .query("SELECT id FROM user_profiles WHERE user_id = ?", userId);
    const userProfileId = userProfile[0].id;
    await db
      .promise()
      .query("INSERT INTO user_phones (phone, user_profile_id) VALUES(?, ?)", [
        phone,
        userProfileId,
      ]);
    await db.promise().query("COMMIT");
    res.status(201).json({
      message: "User successfully registered",
      data: {
        username,
        email,
        phone,
        firstname,
        lastname,
      },
    });
  } catch (err) {
    await db.promise().query("ROLLBACK");
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function keepLogin(req, res) {
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
    return res.status(200).json({
      message: "Authenticated",
      data: { ...user[0], ...userProfile[0] },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { auth, register, keepLogin };
